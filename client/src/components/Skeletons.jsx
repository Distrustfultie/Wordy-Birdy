/** Placeholder card shown while people/friends lists load. */
export const CardSkeleton = () => (
  <div className="card bg-base-200 border border-base-300">
    <div className="card-body p-5 gap-4">
      <div className="flex items-center gap-3">
        <div className="skeleton size-14 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-5 w-24" />
        <div className="skeleton h-5 w-24" />
      </div>
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-10 w-full" />
    </div>
  </div>
);

export const CardGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const ListSkeleton = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-2xl bg-base-200 p-4">
        <div className="skeleton size-12 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);
