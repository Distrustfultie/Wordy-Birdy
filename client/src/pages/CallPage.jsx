import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import { ArrowLeftIcon, UsersIcon, VideoOffIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import useStreamToken from "../hooks/useStreamToken";
import PageLoader from "../components/PageLoader";
import Logo from "../components/Logo";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();
  const { token, error: tokenError } = useStreamToken();

  useEffect(() => {
    if (!token || !authUser) return;

    const videoClient = new StreamVideoClient({
      apiKey: STREAM_API_KEY,
      user: { id: authUser._id, name: authUser.fullName, image: authUser.profilePic },
      token,
    });
    const callInstance = videoClient.call("default", callId);
    let cancelled = false;

    const joining = (async () => {
      try {
        await callInstance.join({ create: true });
        if (cancelled) return;
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        if (cancelled) return;
        console.error("Error joining call", error);
        toast.error("Could not join call. Please try again.");
      } finally {
        if (!cancelled) setIsConnecting(false);
      }
    })();

    // Leave the call and close the connection when navigating away,
    // so the camera/mic are released and the user drops out of the call.
    return () => {
      cancelled = true;
      setClient(null);
      setCall(null);
      joining
        .then(async () => {
          if (callInstance.state.callingState !== CallingState.LEFT) {
            await callInstance.leave();
          }
        })
        .catch((error) => console.error("Error leaving call", error))
        .finally(() => videoClient.disconnectUser());
    };
  }, [token, authUser, callId]);

  if (isLoading || (isConnecting && !tokenError)) return <PageLoader />;

  if (!client || !call) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-100 p-6 text-center">
        <div className="rounded-2xl bg-error/10 p-4 text-error">
          <VideoOffIcon className="size-10" />
        </div>
        <h1 className="text-2xl font-bold">Couldn&apos;t join the call</h1>
        <p className="max-w-sm text-base-content/70">
          Check your connection and camera permissions, then try again.
        </p>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try again
          </button>
          <Link to="/messages" className="btn btn-ghost">
            Back to messages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallContent />
      </StreamCall>
    </StreamVideo>
  );
};

/** In-call UI. Returns home once the user leaves the call. */
const CallContent = () => {
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const navigate = useNavigate();

  // Navigation is a side effect, so it belongs in an effect rather than in render.
  useEffect(() => {
    if (callingState === CallingState.LEFT) navigate("/messages");
  }, [callingState, navigate]);

  if (callingState === CallingState.LEFT) return null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral text-neutral-content">
      <header className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button className="btn btn-ghost btn-sm btn-circle" onClick={() => navigate(-1)} aria-label="Back">
          <ArrowLeftIcon className="size-5" />
        </button>
        <Logo size="sm" />
        <span className="ml-auto badge badge-ghost gap-1.5">
          <UsersIcon className="size-3.5" /> {participantCount} in call
        </span>
      </header>
      <div className="flex-1 px-2 pb-4 sm:px-6">
        <StreamTheme className="h-full">
          {participantCount <= 1 && (
            <p className="mb-3 text-center text-sm opacity-70">
              Waiting for your partner to join... they&apos;ll get the link in your chat.
            </p>
          )}
          <SpeakerLayout />
          <CallControls />
        </StreamTheme>
      </div>
    </div>
  );
};

export default CallPage;
