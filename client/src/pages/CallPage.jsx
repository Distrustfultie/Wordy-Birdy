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

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser
  });

  useEffect(() => {
  /**
   * Initializes the Stream video client and joins a call.
   * @function
   * @async
   * @throws {Error} - If there is an error joining the call.
   * @returns {Promise<void>} - A promise that resolves when the call is joined.
   */
    const initCall = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream video client ...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        })

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true })

        console.log("Joined call Successfully")

        setClient(videoClient);
        setCall(callInstance);

      } catch (error) {
        console.error("Error joining call", error);
        toast.error("Could not join call. Please try again.");

      } finally {
        setIsConnecting(false);
      }

    };

    initCall();
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
          <div className="felx items-center justify-center h-full">
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

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    < StreamTheme >
      <SpeakerLayout />
      <CallControls />
    </StreamTheme >
  );

};

export default CallPage;