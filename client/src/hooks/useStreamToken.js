import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import useAuthUser from "./useAuthUser";

/**
 * The Stream token for the logged-in user. Keyed by user id so a cached token
 * is never reused for another account; Stream tokens don't expire, so it is
 * fetched once per session.
 */
const useStreamToken = () => {
  const { authUser } = useAuthUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ["streamToken", authUser?._id],
    queryFn: getStreamToken,
    enabled: !!authUser?.isOnboarded,
    staleTime: Infinity,
  });

  return { token: data?.token, isLoading, error };
};

export default useStreamToken;
