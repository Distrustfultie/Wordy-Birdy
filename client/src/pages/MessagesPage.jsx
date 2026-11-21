import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Chat, ChannelList } from "stream-chat-react";
import { MessageCircleIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { useStreamChat } from "../context/StreamChatContext";
import { useThemeStore } from "../store/useThemeStore";
import { DARK_THEMES } from "../constants";
import { timeAgo } from "../lib/utilis";
import Avatar from "../components/Avatar";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import ChatLoader from "../components/ChatLoader";
import { ListSkeleton } from "../components/Skeletons";

/** One row in the inbox: the other person, last message, time and unread count. */
const ConversationPreview = ({ channel, lastMessage, unread }) => {
  const myId = channel.getClient().userID;
  const other = Object.values(channel.state.members).find((m) => m.user?.id !== myId)?.user;
  if (!other) return null;

  const when = lastMessage?.created_at || channel.state.last_message_at;
  const mine = lastMessage?.user?.id === myId;
  const text = lastMessage
    ? lastMessage.deleted_at
      ? "Message deleted"
      : lastMessage.text || (lastMessage.attachments?.length ? "📎 Attachment" : "")
    : "No messages yet. Say hello!";

  return (
    <Link
      to={`/chat/${other.id}`}
      className={`flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-base-200 ${
        unread > 0 ? "bg-primary/5" : ""
      }`}
    >
      <Avatar src={other.image} name={other.name} size="md" online={Boolean(other.online)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className={`truncate ${unread > 0 ? "font-bold" : "font-semibold"}`}>{other.name || "Unknown user"}</p>
          {when && <span className="shrink-0 text-xs text-base-content/50">{timeAgo(when)}</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className={`truncate text-sm ${unread > 0 ? "text-base-content" : "text-base-content/60"}`}>
            {mine && "You: "}
            {text}
          </p>
          {unread > 0 && <span className="badge badge-primary badge-sm shrink-0">{unread}</span>}
        </div>
      </div>
    </Link>
  );
};

const NoConversations = () => (
  <EmptyState
    icon={MessageCircleIcon}
    title="No conversations yet"
    description="Open a friend's card and tap Message to start chatting."
    action={<Link to="/friends" className="btn btn-primary btn-sm">Go to friends</Link>}
  />
);

const InboxLoading = () => <ListSkeleton count={5} />;

const MessagesPage = () => {
  const { authUser } = useAuthUser();
  const { client, error } = useStreamChat();
  const { theme } = useThemeStore();

  const filters = useMemo(() => ({ type: "messaging", members: { $in: [authUser._id] } }), [authUser._id]);
  const sort = useMemo(() => ({ last_message_at: -1 }), []);
  const options = useMemo(() => ({ limit: 20, presence: true, state: true, watch: true }), []);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Messages" subtitle="All your conversations in one place." />

      {error ? (
        <EmptyState icon={MessageCircleIcon} title="Couldn't connect to chat" description="Please refresh the page and try again." />
      ) : !client ? (
        <ChatLoader label="Loading conversations..." />
      ) : (
        <div className="wb-inbox rounded-3xl border border-base-300 bg-base-100 p-2">
          <Chat client={client} theme={DARK_THEMES.has(theme) ? "str-chat__theme-dark" : "str-chat__theme-light"}>
            <ChannelList
              filters={filters}
              sort={sort}
              options={options}
              Preview={ConversationPreview}
              EmptyStateIndicator={NoConversations}
              LoadingIndicator={InboxLoading}
              setActiveChannelOnMount={false}
            />
          </Chat>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
