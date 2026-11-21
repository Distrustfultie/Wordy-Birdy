import { Link } from "react-router-dom";
import { CheckIcon, ClockIcon, MapPinIcon, SparklesIcon, UserPlusIcon, XIcon } from "lucide-react";
import Avatar from "./Avatar";
import LanguageBadge from "./LanguageBadge";

/**
 * A potential language partner.
 * `status` is "none" | "sent" | "received"; `requestId` is the pending request for sent/received.
 */
const UserCard = ({ user, status = "none", requestId, actions }) => {
  const { sendRequest, sendingId, acceptRequest, acceptingId, declineRequest, cancelRequest, removingRequestId } = actions;

  return (
    <div className="card bg-base-200 border border-base-300 hover:border-primary/40 hover:shadow-lg transition-all duration-200">
      <div className="card-body p-5 gap-4">
        <div className="flex items-start gap-3">
          <Link to={`/profile/${user._id}`} className="shrink-0">
            <Avatar src={user.profilePic} name={user.fullName} size="lg" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link to={`/profile/${user._id}`} className="block truncate font-semibold text-lg hover:text-primary transition-colors">
              {user.fullName}
            </Link>
            {user.location && (
              <p className="flex items-center gap-1 text-xs text-base-content/60">
                <MapPinIcon className="size-3 shrink-0" />
                <span className="truncate">{user.location}</span>
              </p>
            )}
            {user.isMatch && (
              <span className="badge badge-accent badge-sm mt-1.5 gap-1">
                <SparklesIcon className="size-3" /> Great match
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <LanguageBadge language={user.nativeLanguage} kind="native" />
          <LanguageBadge language={user.learningLanguage} kind="learning" />
        </div>

        {user.bio && <p className="text-sm text-base-content/70 line-clamp-2">{user.bio}</p>}

        <div className="mt-auto">
          {status === "received" ? (
            <div className="flex gap-2">
              <button
                className="btn btn-primary btn-sm flex-1"
                onClick={() => acceptRequest(requestId)}
                disabled={acceptingId === requestId}
              >
                <CheckIcon className="size-4" /> Accept
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => declineRequest(requestId, user.fullName)}
                disabled={removingRequestId === requestId}
                aria-label="Decline"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          ) : status === "sent" ? (
            <button
              className="btn btn-outline btn-sm w-full group"
              onClick={() => cancelRequest(requestId, user.fullName)}
              disabled={removingRequestId === requestId}
            >
              <ClockIcon className="size-4 group-hover:hidden" />
              <XIcon className="size-4 hidden group-hover:inline" />
              <span className="group-hover:hidden">Request sent</span>
              <span className="hidden group-hover:inline">Cancel request</span>
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm w-full"
              onClick={() => sendRequest(user._id)}
              disabled={sendingId === user._id}
            >
              {sendingId === user._id ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <UserPlusIcon className="size-4" />
              )}
              Add friend
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
