import { useQuery } from "@tanstack/react-query";
import { getFriendRequests, getOutgoingFriendReqs } from "../lib/api";

/**
 * Incoming + accepted friend requests. Polled so the notification badge stays
 * current without a page reload.
 */
export const useFriendRequests = () => {
  const query = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 30_000,
  });

  return {
    ...query,
    incomingReqs: query.data?.incomingReqs ?? [],
    acceptedReqs: query.data?.acceptedReqs ?? [],
  };
};

/** Requests the user has sent that are still pending. */
export const useOutgoingRequests = () => {
  const query = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });
  return { ...query, outgoingReqs: query.data ?? [] };
};
