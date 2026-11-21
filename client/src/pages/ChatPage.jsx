import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import toast from "react-hot-toast";
import { ArrowLeftIcon, MessageCircleIcon, UserIcon, VideoIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import usePresence from "../hooks/usePresence";
import { useStreamChat } from "../context/StreamChatContext";
import { useThemeStore } from "../store/useThemeStore";
import { getUserProfile } from "../lib/api";
import { DARK_THEMES } from "../constants";
import { directChannelId } from "../lib/utilis";
import Avatar from "../components/Avatar";
import { LanguageFlag } from "../components/LanguageBadge";
import ChatLoader from "../components/ChatLoader";
import EmptyState from "../components/EmptyState";

/** Custom header: back, who you're talking to (with presence), and the call button. */
const ChatHeader = ({ partner, partnerId, online, onCall }) => (
  <div className="flex items-center gap-3 border-b border-base-300 bg-base-100 px-3 py-3 sm:px-5">
    <Link to="/messages" className="btn btn-ghost btn-sm btn-circle" aria-label="Back to messages">
      <ArrowLeftIcon className="size-5" />
    </Link>
    <Link to={`/profile/${partnerId}`} className="flex min-w-0 flex-1 items-center gap-3">
      <Avatar src={partner?.profilePic} name={partner?.fullName} size="sm" online={online} />
      <div className="min-w-0">
        <p className="truncate font-semibold leading-tight">{partner?.fullName || "Loading..."}</p>
        <p className="flex items-center gap-1.5 text-xs text-base-content/60">
          {online ? <span className="text-success">Online</span> : <span>Offline</span>}
          {partner?.nativeLanguage && (
            <>
              <span>·</span>
              <LanguageFlag language={partner.nativeLanguage} />
              <span className="capitalize">Speaks {partner.nativeLanguage}</span>
            </>
          )}
        </p>
      </div>
    </Link>
    <Link to={`/profile/${partnerId}`} className="btn btn-ghost btn-sm btn-circle hidden sm:inline-flex" aria-label="View profile">
      <UserIcon className="size-5" />
    </Link>
    <button onClick={onCall} className="btn btn-primary btn-sm gap-2" aria-label="Start video call">
      <VideoIcon className="size-4" />
      <span className="hidden sm:inline">Video call</span>
    </button>
  </div>
);

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const { client, error } = useStreamChat();
  const { theme } = useThemeStore();
  const [channel, setChannel] = useState(null);
  const [channelError, setChannelError] = useState(null);

  const { data: partner } = useQuery({
    queryKey: ["profile", targetUserId],
    queryFn: () => getUserProfile(targetUserId),
    retry: false,
  });
  const online = usePresence([targetUserId]).has(targetUserId);

  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    setChannelError(null);

    const ch = client.channel("messaging", directChannelId(authUser._id, targetUserId), {
      members: [authUser._id, targetUserId],
    });

    ch.watch()
      .then(() => {
        if (!cancelled) setChannel(ch);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error opening chat:", err);
        setChannelError(err);
        toast.error("Could not open this chat. Please try again.");
      });

    return () => {
      cancelled = true;
      setChannel(null);
    };
  }, [client, authUser._id, targetUserId]);

  const handleVideoCall = async () => {
    if (!channel) return;
    const callUrl = `${window.location.origin}/call/${channel.id}`;
    try {
      await channel.sendMessage({ text: `📹 I've started a video call. Join me here: ${callUrl}` });
      navigate(`/call/${channel.id}`);
    } catch (err) {
      console.error("Error starting call:", err);
      toast.error("Could not start the call.");
    }
  };

  if (error || channelError) {
    return (
      <div className="p-4 sm:p-8">
        <EmptyState
          icon={MessageCircleIcon}
          title="Chat is unavailable"
          description="We couldn't connect to this conversation. Please refresh and try again."
          action={<Link to="/messages" className="btn btn-primary btn-sm">Back to messages</Link>}
        />
      </div>
    );
  }

  if (!client || !channel) return <ChatLoader />;

  return (
    <div className="wb-chat h-full">
      <Chat client={client} theme={DARK_THEMES.has(theme) ? "str-chat__theme-dark" : "str-chat__theme-light"}>
        <Channel channel={channel}>
          <Window>
            <ChatHeader partner={partner} partnerId={targetUserId} online={online} onCall={handleVideoCall} />
            <MessageList />
            <MessageInput focus />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
