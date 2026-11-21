import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GlobeIcon, SearchIcon, UsersIcon, XIcon } from "lucide-react";
import { getRecommendedUsers } from "../lib/api";
import useDebounce from "../hooks/useDebounce";
import useFriendActions from "../hooks/useFriendActions";
import { useFriendRequests, useOutgoingRequests } from "../hooks/useFriendRequests";
import { capitalize } from "../lib/utilis";
import { languageOptions } from "../lib/languageOptions";
import UserCard from "./UserCard";
import EmptyState from "./EmptyState";
import Select from "./ui/Select";
import { CardGridSkeleton } from "./Skeletons";

const FILTER_OPTIONS = [
  { value: "", label: "Any native language", icon: <GlobeIcon className="size-4 opacity-60" /> },
  ...languageOptions((lang) => `Speaks ${lang}`),
];

/** Search + language filter + grid of recommended partners. */
const PartnerFinder = ({ learningLanguage }) => {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const debouncedSearch = useDebounce(search.trim());
  const actions = useFriendActions();

  const params = { search: debouncedSearch, language };
  const { data: users = [], isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["users", params],
    queryFn: () => getRecommendedUsers(params),
    placeholderData: keepPreviousData,
  });

  const { outgoingReqs } = useOutgoingRequests();
  const { incomingReqs } = useFriendRequests();

  // userId -> pending request id, so each card knows whether a request already exists.
  const { sent, received } = useMemo(
    () => ({
      sent: new Map(outgoingReqs.map((r) => [r.recipient._id, r._id])),
      received: new Map(incomingReqs.map((r) => [r.sender._id, r._id])),
    }),
    [outgoingReqs, incomingReqs]
  );

  const filtered = Boolean(debouncedSearch || language);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Meet new learners</h2>
        <p className="text-sm text-base-content/70">
          People who natively speak{" "}
          {learningLanguage ? <strong>{capitalize(learningLanguage)}</strong> : "your target language"} are shown first.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="input input-bordered flex flex-1 items-center gap-2">
          <SearchIcon className="size-4 opacity-60" />
          <input
            type="search"
            className="grow"
            placeholder="Search by name or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isFetching && !isLoading && <span className="loading loading-spinner loading-xs opacity-60" />}
        </label>
        <Select
          className="sm:w-60"
          ariaLabel="Filter by native language"
          value={language}
          onChange={setLanguage}
          options={FILTER_OPTIONS}
        />
      </div>

      {learningLanguage && language !== learningLanguage && (
        <button
          className="btn btn-xs btn-outline btn-primary rounded-full"
          onClick={() => setLanguage(learningLanguage)}
        >
          Only native {capitalize(learningLanguage)} speakers
        </button>
      )}

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : isError ? (
        <EmptyState
          icon={UsersIcon}
          title="Couldn't load learners"
          description="Check your connection and try again."
          action={<button className="btn btn-primary btn-sm" onClick={() => refetch()}>Retry</button>}
        />
      ) : users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={filtered ? "No one matches those filters" : "No new learners right now"}
          description={filtered ? "Try a different name or language." : "Check back soon, new people join every day."}
          action={
            filtered && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setSearch("");
                  setLanguage("");
                }}
              >
                <XIcon className="size-4" /> Clear filters
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => {
            const status = sent.has(user._id) ? "sent" : received.has(user._id) ? "received" : "none";
            return (
              <UserCard
                key={user._id}
                user={user}
                status={status}
                requestId={sent.get(user._id) || received.get(user._id)}
                actions={actions}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PartnerFinder;
