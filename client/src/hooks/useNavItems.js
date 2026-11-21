import { BellIcon, HomeIcon, MessageCircleIcon, UsersIcon } from "lucide-react";
import { useStreamChat } from "../context/StreamChatContext";
import { useFriendRequests } from "./useFriendRequests";

/** Primary navigation, with live badge counts for unread messages and requests. */
const useNavItems = () => {
  const { unreadCount } = useStreamChat();
  const { incomingReqs } = useFriendRequests();

  return [
    { to: "/", label: "Home", icon: HomeIcon, end: true },
    { to: "/friends", label: "Friends", icon: UsersIcon },
    { to: "/messages", label: "Messages", icon: MessageCircleIcon, badge: unreadCount },
    { to: "/notifications", label: "Notifications", shortLabel: "Alerts", icon: BellIcon, badge: incomingReqs.length },
  ];
};

export default useNavItems;
