import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUserQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    // Many components read the auth user. Without these, each one mounting after
    // a failed request (server down / 500) would refetch, flip the app back to
    // its loading screen, remount everything, and loop forever.
    retryOnMount: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    isLoading: authUserQuery.isLoading,
    authUser: authUserQuery.data?.user || null, 
  };
};

export default useAuthUser;