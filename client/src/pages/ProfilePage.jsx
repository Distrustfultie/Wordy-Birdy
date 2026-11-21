import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  MessageCircleIcon,
  PencilIcon,
  UserMinusIcon,
  UserPlusIcon,
  UserXIcon,
  XIcon,
} from "lucide-react";
import { getUserProfile } from "../lib/api";
import useFriendActions from "../hooks/useFriendActions";
import usePresence from "../hooks/usePresence";
import { capitalize, memberSince } from "../lib/utilis";
import Avatar from "../components/Avatar";
import { LanguageFlag } from "../components/LanguageBadge";
import EmptyState from "../components/EmptyState";

const LanguageCard = ({ label, language }) => (
  <div className="flex items-center gap-4 rounded-2xl bg-base-200 p-4">
    <span className="flex size-12 items-center justify-center rounded-xl bg-base-100">
      <LanguageFlag language={language} className="h-5" />
    </span>
    <div>
      <p className="text-xs uppercase tracking-wide text-base-content/50">{label}</p>
      <p className="text-lg font-semibold">{capitalize(language)}</p>
    </div>
  </div>
);

const ProfileActions = ({ profile, actions }) => {
  const { sendRequest, sendingId, acceptRequest, acceptingId, declineRequest, cancelRequest, removingRequestId, unfriend } =
    actions;

  switch (profile.relationship) {
    case "self":
      return (
        <Link to="/settings" className="btn btn-outline btn-sm">
          <PencilIcon className="size-4" /> Edit profile
        </Link>
      );
    case "friends":
      return (
        <>
          <Link to={`/chat/${profile._id}`} className="btn btn-primary btn-sm">
            <MessageCircleIcon className="size-4" /> Message
          </Link>
          <button className="btn btn-ghost btn-sm" onClick={() => unfriend(profile._id, profile.fullName)}>
            <UserMinusIcon className="size-4" /> Unfriend
          </button>
        </>
      );
    case "request_sent":
      return (
        <>
          <span className="btn btn-sm btn-disabled no-animation">
            <ClockIcon className="size-4" /> Request sent
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => cancelRequest(profile.requestId, profile.fullName)}
            disabled={removingRequestId === profile.requestId}
          >
            <XIcon className="size-4" /> Cancel
          </button>
        </>
      );
    case "request_received":
      return (
        <>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => acceptRequest(profile.requestId)}
            disabled={acceptingId === profile.requestId}
          >
            <CheckIcon className="size-4" /> Accept request
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => declineRequest(profile.requestId, profile.fullName)}
            disabled={removingRequestId === profile.requestId}
          >
            <XIcon className="size-4" /> Decline
          </button>
        </>
      );
    default:
      return (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => sendRequest(profile._id)}
          disabled={sendingId === profile._id}
        >
          <UserPlusIcon className="size-4" /> Add friend
        </button>
      );
  }
};

const ProfilePage = () => {
  const { id } = useParams();
  const actions = useFriendActions();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getUserProfile(id),
    retry: false,
  });

  const online = usePresence(profile && profile.relationship !== "self" ? [profile._id] : []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="skeleton h-48 w-full rounded-3xl" />
        <div className="skeleton h-6 w-1/3" />
        <div className="skeleton h-24 w-full" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
        <EmptyState
          icon={UserXIcon}
          title="Profile not found"
          description="This user may have left WordyBirdy or the link is wrong."
          action={<Link to="/" className="btn btn-primary btn-sm">Back home</Link>}
        />
      </div>
    );
  }

  const isSelf = profile.relationship === "self";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100">
        <div className="h-32 bg-gradient-to-r from-primary via-secondary to-accent sm:h-40" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end">
            <Avatar
              src={profile.profilePic}
              name={profile.fullName}
              size="2xl"
              online={isSelf ? undefined : online.has(profile._id)}
              className="[&>div]:ring-4 [&>div]:ring-base-100"
            />
            <div className="flex-1 sm:pb-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{profile.fullName}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/60">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="size-4" /> {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <CalendarIcon className="size-4" /> Joined {memberSince(profile.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:pb-2">
              <ProfileActions profile={profile} actions={actions} />
            </div>
          </div>

          <div className="mt-6 flex gap-6 text-sm">
            <p>
              <span className="text-lg font-bold">{profile.friendsCount}</span>{" "}
              <span className="text-base-content/60">{profile.friendsCount === 1 ? "friend" : "friends"}</span>
            </p>
            {!isSelf && profile.mutualFriends > 0 && (
              <p>
                <span className="text-lg font-bold">{profile.mutualFriends}</span>{" "}
                <span className="text-base-content/60">mutual</span>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <LanguageCard label="Native language" language={profile.nativeLanguage} />
        <LanguageCard label="Learning" language={profile.learningLanguage} />
      </section>

      <section className="rounded-3xl border border-base-300 bg-base-100 p-6">
        <h2 className="font-semibold">About</h2>
        <p className="mt-2 whitespace-pre-line leading-relaxed text-base-content/80">
          {profile.bio || "No bio yet."}
        </p>
      </section>
    </div>
  );
};

export default ProfilePage;
