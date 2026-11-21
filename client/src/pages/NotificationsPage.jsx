import { useState } from "react";
import { Link } from "react-router-dom";
import { BellIcon, CheckIcon, ClockIcon, InboxIcon, MessageCircleIcon, SendIcon, XIcon } from "lucide-react";
import { useFriendRequests, useOutgoingRequests } from "../hooks/useFriendRequests";
import useFriendActions from "../hooks/useFriendActions";
import { timeAgo } from "../lib/utilis";
import Avatar from "../components/Avatar";
import LanguageBadge from "../components/LanguageBadge";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { ListSkeleton } from "../components/Skeletons";

const Row = ({ user, children, meta }) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-200 p-4 sm:flex-row sm:items-center">
    <Link to={`/profile/${user._id}`} className="flex min-w-0 flex-1 items-center gap-3">
      <Avatar src={user.profilePic} name={user.fullName} size="md" />
      <div className="min-w-0">
        <p className="truncate font-semibold hover:text-primary">{user.fullName}</p>
        {meta}
      </div>
    </Link>
    <div className="flex gap-2">{children}</div>
  </div>
);

const NotificationsPage = () => {
  const [tab, setTab] = useState("received");
  const { incomingReqs, acceptedReqs, isLoading } = useFriendRequests();
  const { outgoingReqs, isLoading: loadingOutgoing } = useOutgoingRequests();
  const { acceptRequest, acceptingId, declineRequest, cancelRequest, removingRequestId } = useFriendActions();

  const tabs = [
    { id: "received", label: "Requests", count: incomingReqs.length, icon: InboxIcon },
    { id: "sent", label: "Sent", count: outgoingReqs.length, icon: SendIcon },
    { id: "activity", label: "Activity", count: 0, icon: BellIcon },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Notifications" subtitle="Friend requests and what's new with your connections." />

      <div role="tablist" className="tabs tabs-boxed w-full sm:w-fit">
        {tabs.map(({ id, label, count, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            className={`tab gap-2 ${tab === id ? "tab-active" : ""}`}
            onClick={() => setTab(id)}
          >
            <Icon className="size-4" />
            {label}
            {count > 0 && <span className="badge badge-sm">{count}</span>}
          </button>
        ))}
      </div>

      {tab === "received" &&
        (isLoading ? (
          <ListSkeleton />
        ) : incomingReqs.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            title="No pending requests"
            description="When someone wants to practice with you, their request shows up here."
          />
        ) : (
          <div className="space-y-3">
            {incomingReqs.map((req) => (
              <Row
                key={req._id}
                user={req.sender}
                meta={
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <LanguageBadge language={req.sender.nativeLanguage} kind="native" />
                    <LanguageBadge language={req.sender.learningLanguage} kind="learning" />
                    <span className="text-xs text-base-content/50">{timeAgo(req.createdAt)}</span>
                  </div>
                }
              >
                <button
                  className="btn btn-primary btn-sm flex-1 sm:flex-none"
                  onClick={() => acceptRequest(req._id)}
                  disabled={acceptingId === req._id}
                >
                  <CheckIcon className="size-4" /> Accept
                </button>
                <button
                  className="btn btn-ghost btn-sm flex-1 sm:flex-none"
                  onClick={() => declineRequest(req._id, req.sender.fullName)}
                  disabled={removingRequestId === req._id}
                >
                  <XIcon className="size-4" /> Decline
                </button>
              </Row>
            ))}
          </div>
        ))}

      {tab === "sent" &&
        (loadingOutgoing ? (
          <ListSkeleton />
        ) : outgoingReqs.length === 0 ? (
          <EmptyState
            icon={SendIcon}
            title="No requests waiting"
            description="Requests you send stay here until they're accepted."
            action={<Link to="/" className="btn btn-primary btn-sm">Find partners</Link>}
          />
        ) : (
          <div className="space-y-3">
            {outgoingReqs.map((req) => (
              <Row
                key={req._id}
                user={req.recipient}
                meta={
                  <p className="flex items-center gap-1 text-xs text-base-content/60">
                    <ClockIcon className="size-3" /> Sent {timeAgo(req.createdAt)}
                  </p>
                }
              >
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => cancelRequest(req._id, req.recipient.fullName)}
                  disabled={removingRequestId === req._id}
                >
                  <XIcon className="size-4" /> Cancel
                </button>
              </Row>
            ))}
          </div>
        ))}

      {tab === "activity" &&
        (isLoading ? (
          <ListSkeleton />
        ) : acceptedReqs.length === 0 ? (
          <EmptyState icon={BellIcon} title="Nothing new yet" description="We'll let you know when someone accepts your request." />
        ) : (
          <div className="space-y-3">
            {acceptedReqs.map((req) => (
              <Row
                key={req._id}
                user={req.recipient}
                meta={
                  <p className="text-sm text-base-content/70">
                    accepted your friend request ·{" "}
                    <span className="text-xs text-base-content/50">{timeAgo(req.updatedAt)}</span>
                  </p>
                }
              >
                <Link to={`/chat/${req.recipient._id}`} className="btn btn-outline btn-sm">
                  <MessageCircleIcon className="size-4" /> Say hi
                </Link>
              </Row>
            ))}
          </div>
        ))}
    </div>
  );
};

export default NotificationsPage;
