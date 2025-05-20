import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { logout } from '../lib/api';


/**
 * A hook for logging out a user.
 * @returns {Object} An object with the following properties:
 *                  logoutMutation: A function that performs the logout mutation.
 *                  isPending: A boolean indicating whether the logout mutation is in progress.
 *                  error: The error object if the logout mutation fails.
 */
const useLogout = () => {
    const queryClient = useQueryClient();

    const { mutate: logoutMutation, isPending, error } = useMutation({
        mutationFn: logout,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    });

    return { logoutMutation, isPending, error };
}

export default useLogout