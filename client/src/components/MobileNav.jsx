import { NavLink } from "react-router-dom";
import useNavItems from "../hooks/useNavItems";

/** Bottom tab bar for small screens (the sidebar takes over at lg). */
const MobileNav = () => {
  const items = useNavItems();

  return (
    <nav className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-base-300 bg-base-100/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {items.map(({ to, label, shortLabel, icon: Icon, badge, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-base-content/60"
              }`
            }
          >
            <span className="indicator">
              <Icon className="size-5" />
              {badge > 0 && (
                <span className="badge badge-primary badge-xs indicator-item">{badge > 9 ? "9+" : badge}</span>
              )}
            </span>
            {shortLabel || label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
