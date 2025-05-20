import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { login } from '../lib/api';

/**
 * A hook for logging in a user.
 * @returns {Object} An object with the following properties:
 *                  error: The error object if the login mutation fails.
 *                  isPending: A boolean indicating whether the login mutation is in progress.
 *                  loginMutation: A function that performs the login mutation.
 */
const useLogin = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: login,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    });

    return { error, isPending, loginMutation: mutate }; 
};

export default useLogin;