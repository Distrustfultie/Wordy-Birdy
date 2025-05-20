import React from 'react'
import { signup } from '../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * A hook for signing up a new user.
 * @returns {Object} An object with the following properties:
 *                  isPending: A boolean indicating whether the signup mutation is in progress.
 *                  error: The error object if the signup mutation fails.
 *                  signupMutation: A function that performs the signup mutation.
 */
const useSignUp = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    });

    return {
        isPending, error, signupMutation: mutate
    };
}

export default useSignUp