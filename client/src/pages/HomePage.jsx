import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon, BellIcon, MessageCircleIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { getUserFriends } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import usePresence from "../hooks/usePresence";
import { useFriendRequests } from "../hooks/useFriendRequests";
import { useStreamChat } from "../context/StreamChatContext";
import { capitalize, greeting } from "../lib/utilis";
import FriendCard from "../components/FriendCard";
import PartnerFinder from "../components/PartnerFinder";
import EmptyState from "../components/EmptyState";
import { CardGridSkeleton } from "../components/Skeletons";
import { LanguageFlag } from "../components/LanguageBadge";

const StatCard = ({ to, icon: Icon, label, value, highlight }) => (
  <Link
    to={to}
    className={`flex items-center gap-4 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
      highlight ? "border-primary/40 bg-primary/10" : "border-base-300 bg-base-200"
    }`}
  >
    <span className={`rounded-xl p-3 ${highlight ? "bg-primary text-primary-content" : "bg-base-300"}`}>
      <Icon className="size-5" />
    </span>
    <div>
      <p className="text-2xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-sm text-base-content/70">{label}</p>
    </div>
  </Link>
);

const HomePage = () => {
  const { authUser } = useAuthUser();
  const { unreadCount } = useStreamChat();
  const { incomingReqs } = useFriendRequests();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const online = usePresence(friends.map((f) => f._id));
  // Online friends first, then the rest.
  const preview = [...friends].sort((a, b) => Number(online.has(b._id)) - Number(online.has(a._id))).slice(0, 3);
  const firstName = authUser?.fullName?.split(" ")[0];

  return (
    <div className="mx-auto max-w-7xl space-y-12 p-4 sm:p-6 lg:p-8">
      {/* Greeting */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-base-200 to-secondary/15 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/20 blur-3xl" />
        <h1 className="relative text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting()}, {firstName} 👋
        </h1>
        <p className="relative mt-2 flex flex-wrap items-center gap-1.5 text-base-content/70">
          You&apos;re learning
          <span className="inline-flex items-center gap-1.5 font-semibold text-base-content">
            <LanguageFlag language={authUser?.learningLanguage} />
            {capitalize(authUser?.learningLanguage)}
          </span>
          . Who will you practice with today?
        </p>

        <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard to="/friends" icon={UsersIcon} label="Friends" value={friends.length} />
          <StatCard
            to="/messages"
            icon={MessageCircleIcon}
            label="Unread messages"
            value={unreadCount}
            highlight={unreadCount > 0}
          />
          <StatCard
            to="/notifications"
            icon={BellIcon}
            label="Friend requests"
            value={incomingReqs.length}
            highlight={incomingReqs.length > 0}
          />
        </div>
      </section>

      {/* Friends preview */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Your friends</h2>
            {friends.length > 0 && (
              <p className="text-sm text-base-content/70">
                {online.size > 0 ? `${online.size} online now` : "Say hi, they'll see it next time they're on"}
              </p>
            )}
          </div>
          {friends.length > 0 && (
            <Link to="/friends" className="btn btn-ghost btn-sm">
              See all <ArrowRightIcon className="size-4" />
            </Link>
          )}
        </div>

        {loadingFriends ? (
          <CardGridSkeleton count={3} />
        ) : friends.length === 0 ? (
          <EmptyState
            icon={UserPlusIcon}
            title="No friends yet"
            description="Send a friend request to someone below. Once they accept, you can chat and call."
            compact
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {preview.map((friend) => (
              <FriendCard key={friend._id} friend={friend} online={online.has(friend._id)} />
            ))}
          </div>
        )}
      </section>

      <PartnerFinder learningLanguage={authUser?.learningLanguage} />
    </div>
  );
};

export default HomePage;
