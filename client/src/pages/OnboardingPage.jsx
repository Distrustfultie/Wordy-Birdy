import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import { completeOnboarding } from "../lib/api";
import { getErrorMessage } from "../lib/utilis";
import Logo from "../components/Logo";
import ProfileForm from "../components/ProfileForm";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const { confirmLogout } = useLogout();
  const queryClient = useQueryClient();

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Welcome to WordyBirdy!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <Logo />
          <button className="btn btn-ghost btn-sm" onClick={confirmLogout}>
            Not you? Log out
          </button>
        </div>

        <ul className="steps w-full my-8 text-sm">
          <li className="step step-primary">Account</li>
          <li className="step step-primary">Profile</li>
          <li className="step">Meet partners</li>
        </ul>

        <div className="card bg-base-100 border border-base-300 shadow-xl">
          <div className="card-body p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Set up your profile</h1>
            <p className="text-base-content/70 mb-4">
              This helps us match you with people who speak the language you want to learn.
            </p>
            <ProfileForm
              initialValues={authUser}
              onSubmit={onboardingMutation}
              isPending={isPending}
              submitLabel="Complete profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
