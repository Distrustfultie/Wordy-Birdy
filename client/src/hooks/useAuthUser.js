import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api';

/**
 * Fetches the authenticated user from the server and returns the data
 * in the query hook format. The `isLoading` property is true while the
 * data is being fetched. The `authUser` property is the user object
 * returned from the server, or null if the user is not authenticated.
 */
const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false,
    });

    return {
        isLoading: authUser.isLoading,
        authUser: authUser.data?.user
    };
};
 
export default useAuthUser