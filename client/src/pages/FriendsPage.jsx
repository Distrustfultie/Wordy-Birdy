import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { getUserFriends } from "../lib/api";
import usePresence from "../hooks/usePresence";
import useFriendActions from "../hooks/useFriendActions";
import FriendCard from "../components/FriendCard";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { CardGridSkeleton } from "../components/Skeletons";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "online", label: "Online" },
];

const FriendsPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { unfriend } = useFriendActions();

  const { data: friends = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const online = usePresence(friends.map((f) => f._id));

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return friends
      .filter((f) => filter !== "online" || online.has(f._id))
      .filter(
        (f) =>
          !q ||
          [f.fullName, f.location, f.nativeLanguage, f.learningLanguage].some((v) => v?.toLowerCase().includes(q))
      )
      .sort((a, b) => Number(online.has(b._id)) - Number(online.has(a._id)) || a.fullName.localeCompare(b.fullName));
  }, [friends, search, filter, online]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Friends"
        subtitle={
          friends.length
            ? `${friends.length} ${friends.length === 1 ? "friend" : "friends"} · ${online.size} online`
            : "Your language partners live here."
        }
        actions={
          <Link to="/" className="btn btn-primary btn-sm">
            <UserPlusIcon className="size-4" /> Find partners
          </Link>
        }
      />

      {friends.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="input input-bordered flex flex-1 items-center gap-2">
            <SearchIcon className="size-4 opacity-60" />
            <input
              type="search"
              className="grow"
              placeholder="Search friends by name, place or language"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div role="tablist" className="tabs tabs-boxed">
            {FILTERS.map(({ id, label }) => (
              <button
                key={id}
                role="tab"
                className={`tab ${filter === id ? "tab-active" : ""}`}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : isError ? (
        <EmptyState
          icon={UsersIcon}
          title="Couldn't load your friends"
          action={<button className="btn btn-primary btn-sm" onClick={() => refetch()}>Retry</button>}
        />
      ) : friends.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No friends yet"
          description="Find people who speak the language you're learning and send them a request."
          action={<Link to="/" className="btn btn-primary btn-sm">Find partners</Link>}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title={filter === "online" && !search ? "Nobody's online right now" : "No friends match your search"}
          compact
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((friend) => (
            <FriendCard key={friend._id} friend={friend} online={online.has(friend._id)} onUnfriend={(f) => unfriend(f._id, f.fullName)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
