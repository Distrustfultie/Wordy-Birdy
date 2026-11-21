import { Link } from "react-router-dom";
import { EllipsisVerticalIcon, MapPinIcon, MessageCircleIcon, UserIcon, UserMinusIcon } from "lucide-react";
import Avatar from "./Avatar";
import LanguageBadge from "./LanguageBadge";
import { Dropdown, DropdownDivider, DropdownItem } from "./ui/Dropdown";

/** A friend, with quick actions. `onUnfriend` is optional (omit to hide the menu). */
const FriendCard = ({ friend, online, onUnfriend }) => (
  <div className="card bg-base-200 border border-base-300 hover:border-primary/40 hover:shadow-lg transition-all duration-200">
    <div className="card-body p-5 gap-4">
      <div className="flex items-start gap-3">
        <Link to={`/profile/${friend._id}`} className="shrink-0">
          <Avatar src={friend.profilePic} name={friend.fullName} size="lg" online={online} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={`/profile/${friend._id}`}
            className="block truncate font-semibold text-lg hover:text-primary transition-colors"
          >
            {friend.fullName}
          </Link>
          <p className={`text-xs ${online ? "text-success" : "text-base-content/50"}`}>
            {online ? "Online now" : "Offline"}
          </p>
          {friend.location && (
            <p className="flex items-center gap-1 text-xs text-base-content/60">
              <MapPinIcon className="size-3 shrink-0" />
              <span className="truncate">{friend.location}</span>
            </p>
          )}
        </div>

        {onUnfriend && (
          <Dropdown
            label={`Actions for ${friend.fullName}`}
            triggerClassName="btn btn-ghost btn-sm btn-circle"
            trigger={<EllipsisVerticalIcon className="size-4" />}
            width="w-48"
          >
            <DropdownItem icon={MessageCircleIcon} to={`/chat/${friend._id}`}>
              Message
            </DropdownItem>
            <DropdownItem icon={UserIcon} to={`/profile/${friend._id}`}>
              View profile
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={UserMinusIcon} danger onClick={() => onUnfriend(friend)}>
              Unfriend
            </DropdownItem>
          </Dropdown>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <LanguageBadge language={friend.nativeLanguage} kind="native" />
        <LanguageBadge language={friend.learningLanguage} kind="learning" />
      </div>

      <Link to={`/chat/${friend._id}`} className="btn btn-primary btn-sm mt-auto">
        <MessageCircleIcon className="size-4" /> Message
      </Link>
    </div>
  </div>
);

export default FriendCard;
