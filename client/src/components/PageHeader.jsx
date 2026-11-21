/** Consistent page title block with optional actions on the right. */
const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-base-content/70">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
