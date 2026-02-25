import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUserQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  return {
    isLoading: authUserQuery.isLoading,
    authUser: authUserQuery.data?.user || null, 
  };
};

export default useAuthUser;