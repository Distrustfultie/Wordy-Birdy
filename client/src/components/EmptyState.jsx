/** Friendly placeholder for empty lists. */
const EmptyState = ({ icon: Icon, title, description, action, compact = false }) => (
  <div
    className={`flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-base-content/15 bg-base-200/50 ${
      compact ? "p-6" : "p-10 sm:p-14"
    }`}
  >
    {Icon && (
      <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary">
        <Icon className="size-8" />
      </div>
    )}
    <h3 className="text-lg font-semibold">{title}</h3>
    {description && <p className="mt-1 max-w-md text-sm text-base-content/70">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
