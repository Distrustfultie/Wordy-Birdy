import { NavLink, Link } from "react-router-dom";
import { SettingsIcon, SparklesIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import useNavItems from "../hooks/useNavItems";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { LanguageFlag } from "./LanguageBadge";
import { useStreamChat } from "../context/StreamChatContext";

const badgeText = (n) => (n > 99 ? "99+" : n);

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const { client } = useStreamChat();
  const items = useNavItems();

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col h-screen sticky top-0 bg-base-200/60 border-r border-base-300">
      <div className="px-6 h-20 flex items-center">
        <Logo />
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {items.map(({ to, label, icon: Icon, badge, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-content shadow-md shadow-primary/20"
                  : "text-base-content/75 hover:bg-base-300 hover:text-base-content"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="size-5" />
                <span className="flex-1">{label}</span>
                {badge > 0 && (
                  <span className={`badge badge-sm ${isActive ? "badge-ghost" : "badge-primary"}`}>
                    {badgeText(badge)}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {authUser?.learningLanguage && (
        <div className="mx-4 mb-4 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SparklesIcon className="size-4 text-primary" />
            Today&apos;s goal
          </div>
          <p className="mt-1 text-xs text-base-content/70 leading-relaxed">
            Have one conversation in{" "}
            <span className="inline-flex items-center gap-1 font-medium text-base-content">
              <LanguageFlag language={authUser.learningLanguage} />
              {authUser.learningLanguage}
            </span>
            . Small daily chats add up fast!
          </p>
        </div>
      )}

      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${authUser?._id}`} className="flex flex-1 min-w-0 items-center gap-3 rounded-xl p-2 hover:bg-base-300 transition-colors">
            <Avatar src={authUser?.profilePic} name={authUser?.fullName} size="sm" online={Boolean(client)} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{authUser?.fullName}</p>
              <p className={`text-xs ${client ? "text-success" : "text-base-content/50"}`}>
                {client ? "Online" : "Connecting..."}
              </p>
            </div>
          </Link>
          <Link to="/settings" className="btn btn-ghost btn-sm btn-square" aria-label="Settings">
            <SettingsIcon className="size-5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
