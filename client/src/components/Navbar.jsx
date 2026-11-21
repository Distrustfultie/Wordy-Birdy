import { Link } from "react-router-dom";
import { BellIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import { useFriendRequests } from "../hooks/useFriendRequests";
import ThemeSelector from "./ThemeSelector";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { Dropdown, DropdownDivider, DropdownItem } from "./ui/Dropdown";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { confirmLogout } = useLogout();
  const { incomingReqs } = useFriendRequests();

  return (
    <header className="sticky top-0 z-30 h-16 lg:h-20 flex items-center border-b border-base-300 bg-base-100/80 backdrop-blur-md">
      <div className="flex w-full items-center gap-2 px-4 sm:px-6 lg:px-8">
        {/* The sidebar (with the logo) is hidden below lg. */}
        <div className="lg:hidden">
          <Logo size="sm" />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeSelector />

          <Link to="/notifications" className="btn btn-ghost btn-circle" aria-label="Notifications">
            <div className="indicator">
              <BellIcon className="size-5" />
              {incomingReqs.length > 0 && (
                <span className="badge badge-primary badge-xs indicator-item">{incomingReqs.length}</span>
              )}
            </div>
          </Link>

          <Dropdown
            label="Account menu"
            width="w-64"
            trigger={<Avatar src={authUser?.profilePic} name={authUser?.fullName} size="xs" />}
          >
            <div className="flex items-center gap-3 px-3 py-2.5">
              <Avatar src={authUser?.profilePic} name={authUser?.fullName} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{authUser?.fullName}</p>
                <p className="truncate text-xs text-base-content/60">{authUser?.email}</p>
              </div>
            </div>
            <DropdownDivider />
            <DropdownItem icon={UserIcon} to={`/profile/${authUser?._id}`}>
              My profile
            </DropdownItem>
            <DropdownItem icon={SettingsIcon} to="/settings">
              Settings
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={LogOutIcon} danger onClick={confirmLogout}>
              Log out
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
