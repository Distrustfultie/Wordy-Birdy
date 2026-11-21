import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CheckIcon, LogOutIcon, MailIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import { useThemeStore } from "../store/useThemeStore";
import { updateProfile } from "../lib/api";
import { getErrorMessage } from "../lib/utilis";
import { THEMES } from "../constants";
import PageHeader from "../components/PageHeader";
import ProfileForm from "../components/ProfileForm";
import { ThemeSwatches } from "../components/ThemeSelector";

const Section = ({ title, description, children }) => (
  <section className="rounded-3xl border border-base-300 bg-base-100 p-5 sm:p-8">
    <h2 className="text-lg font-semibold">{title}</h2>
    {description && <p className="mt-1 text-sm text-base-content/60">{description}</p>}
    <div className="mt-6">{children}</div>
  </section>
);

const SettingsPage = () => {
  const { authUser } = useAuthUser();
  const { confirmLogout, isPending: loggingOut } = useLogout();
  const { theme, setTheme } = useThemeStore();
  const queryClient = useQueryClient();

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success("Profile updated");
      queryClient.setQueryData(["authUser"], (prev) => ({ ...prev, user: data.user }));
      queryClient.invalidateQueries({ queryKey: ["profile", authUser?._id] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Settings" subtitle="Manage your profile, appearance and account." />

      <Section title="Profile" description="This is what other learners see.">
        {/* Keyed by user so the form resets if the account changes. */}
        <ProfileForm key={authUser?._id} initialValues={authUser} onSubmit={saveProfile} isPending={isPending} submitLabel="Save changes" />
      </Section>

      <Section title="Appearance" description="Pick a theme. It's saved on this device.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {THEMES.map((option) => {
            const active = option.name === theme;
            return (
              <button
                key={option.name}
                data-theme={option.name}
                onClick={() => setTheme(option.name)}
                className={`flex items-center justify-between gap-2 rounded-xl border-2 bg-base-100 px-3 py-3 text-left text-sm text-base-content transition-all ${
                  active ? "border-primary shadow-md" : "border-transparent hover:border-base-content/20"
                }`}
              >
                <span className="flex items-center gap-1.5 font-medium">
                  {active && <CheckIcon className="size-4 text-primary" />}
                  {option.label}
                </span>
                <ThemeSwatches colors={option.colors} />
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Account">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm">
            <MailIcon className="size-4 text-base-content/60" />
            <span className="text-base-content/60">Signed in as</span>
            <span className="font-medium">{authUser?.email}</span>
          </p>
          <button className="btn btn-outline btn-error btn-sm" onClick={confirmLogout} disabled={loggingOut}>
            <LogOutIcon className="size-4" /> Log out
          </button>
        </div>
      </Section>
    </div>
  );
};

export default SettingsPage;
