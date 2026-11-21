import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import PageLoader from "../components/PageLoader";

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
import "@stream-io/video-react-sdk/dist/css/styles.css"
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

/**
 * The CallPage component is a full-screen component that renders a
 * video call page. It uses the useAuthUser hook to get the current
 * authenticated user and the useQuery hook to get a Stream token.
 * It then uses the StreamVideoClient and StreamCall components to
 * join a call and render the video call UI.
 *
 * @returns {React.ReactElement} The CallPage component.
 */
const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  // Keyed by user id so a cached token is never reused for a different account.
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken", authUser?._id],
    queryFn: getStreamToken,
    enabled: !!authUser
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser) return;

    const videoClient = new StreamVideoClient({
      apiKey: STREAM_API_KEY,
      user: {
        id: authUser._id,
        name: authUser.fullName,
        image: authUser.profilePic,
      },
      token: tokenData.token,
    });
    const callInstance = videoClient.call("default", callId);
    let cancelled = false;

    /**
     * Joins (creating if needed) the call for this page's call id.
     */
    const initCall = async () => {
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
    };

    const joining = initCall();

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
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );

};

/**
 * A component that renders the call content. It checks if the user is in
 * a call and if the call has ended. If the call has ended, it navigates
 * the user back to the home page.
 * @returns {React.ReactElement} A JSX element representing the component.
 */

const CallContent = () => {

  const { useCallCallingState } = useCallStateHooks()
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  // Navigation is a side effect, so it belongs in an effect rather than in render.
  useEffect(() => {
    if (callingState === CallingState.LEFT) navigate("/");
  }, [callingState, navigate]);

  if (callingState === CallingState.LEFT) return null;

  return (
    < StreamTheme >
      <SpeakerLayout />
      <CallControls />
    </StreamTheme >
  );

};

export default CallPage;