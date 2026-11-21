import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UserMinusIcon, UserXIcon, XCircleIcon } from "lucide-react";
import {
  acceptFriendRequest,
  deleteFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "../lib/api";
import { getErrorMessage } from "../lib/utilis";
import { useConfirm } from "../context/ConfirmContext";

// Everything that depends on the friend graph.
const FRIEND_QUERIES = ["friends", "users", "friendRequests", "outgoingFriendReqs", "profile", "authUser"];

/**
 * Friend-related actions with toasts and cache refresh.
 * Destructive ones (decline, cancel, unfriend) ask for confirmation first.
 * Each `...Id` is the id currently being acted on, for per-button spinners.
 */
const useFriendActions = () => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const refresh = () =>
    Promise.all(FRIEND_QUERIES.map((key) => queryClient.invalidateQueries({ queryKey: [key] })));

  const onError = (error) => toast.error(getErrorMessage(error));

  const send = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast.success("Friend request sent");
      return refresh();
    },
    onError,
  });

  const accept = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success("You're now friends!");
      return refresh();
    },
    onError,
  });

  // Decline (incoming) or cancel (outgoing): same endpoint.
  const remove = useMutation({
    mutationFn: deleteFriendRequest,
    onSuccess: (data) => {
      toast.success(data?.message || "Request removed");
      return refresh();
    },
    onError,
  });

  const unfriendMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast.success("Friend removed");
      return refresh();
    },
    onError,
  });

  const declineRequest = async (requestId, name = "this person") => {
    const ok = await confirm({
      title: `Decline ${name}'s request?`,
      message: "They won't be notified. They can send you a new request later.",
      confirmLabel: "Decline",
      icon: UserXIcon,
    });
    if (ok) remove.mutate(requestId);
  };

  const cancelRequest = async (requestId, name = "this person") => {
    const ok = await confirm({
      title: "Cancel friend request?",
      message: `Your request to ${name} will be withdrawn. You can send another one any time.`,
      confirmLabel: "Cancel request",
      cancelLabel: "Keep it",
      icon: XCircleIcon,
    });
    if (ok) remove.mutate(requestId);
  };

  const unfriend = async (userId, name = "this friend") => {
    const ok = await confirm({
      title: `Unfriend ${name}?`,
      message:
        "You'll be removed from each other's friends. Your chat history stays, and you can send a new request any time.",
      confirmLabel: "Unfriend",
      icon: UserMinusIcon,
    });
    if (ok) unfriendMutation.mutate(userId);
  };

  const pendingId = (m) => (m.isPending ? m.variables : null);

  return {
    sendRequest: send.mutate,
    sendingId: pendingId(send),
    acceptRequest: accept.mutate,
    acceptingId: pendingId(accept),
    declineRequest,
    cancelRequest,
    removingRequestId: pendingId(remove),
    unfriend,
    unfriendingId: pendingId(unfriendMutation),
  };
};

export default useFriendActions;
