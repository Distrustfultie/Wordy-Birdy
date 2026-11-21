import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LogOutIcon } from "lucide-react";
import { logout } from "../lib/api";
import { useConfirm } from "../context/ConfirmContext";

/**
 * Logging out.
 * - `confirmLogout()`: asks first, then logs out. Use this for buttons.
 * - `logoutMutation()`: logs out immediately.
 */
const useLogout = () => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const { mutate: logoutMutation, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Mark the user as logged out, then drop everything cached for them
      // (friends, requests, Stream token) so the next account starts clean.
      queryClient.setQueryData(["authUser"], null);
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== "authUser" });
    },
    onError: () => toast.error("Couldn't log out. Please try again."),
  });

  const confirmLogout = async () => {
    const ok = await confirm({
      title: "Log out of WordyBirdy?",
      message: "You'll need to sign in again to see your friends and messages.",
      confirmLabel: "Log out",
      icon: LogOutIcon,
    });
    if (ok) logoutMutation();
  };

  return { confirmLogout, logoutMutation, isPending, error };
};

export default useLogout;
