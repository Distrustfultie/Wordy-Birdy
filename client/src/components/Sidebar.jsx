import React from 'react'
import useAuthUser from '../hooks/useAuthUser';
import { Link, useLocation } from 'react-router';
import { BellIcon, Bird, HomeIcon, UsersIcon } from 'lucide-react';

/**
 * Sidebar component renders a vertical navigation panel on the side of the page.
 * It includes links to the home, friends, and notifications pages, and displays
 * the user's profile picture and name at the bottom. The currently active page
 * link is highlighted. The sidebar is only visible on larger screens.
 *
 * @returns {React.ReactElement} A JSX element representing the sidebar.
 */

const Sidebar = () => {
    const {authUser} = useAuthUser();
    const location = useLocation();
    const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <Bird className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            WordyBirdy
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notifications</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-base-300 mt-auto" >
        <div className="flex items-center gap-3" >
            <div className="avatar" >
                <div className="w-10 rounded-full" >
                    <img src={authUser?.profilePic} alt="User Avatar" />
                </div>
            </div>
            <div className="flex-1" >
                <p className="font-semibold text-sm" >{authUser?.fullName}</p>
                <p className="text-xs text-success flex items-center gap-1" >
                    <span className="size-2 rounded-full bg-success inline-block" />
                    Online
                </p>
            </div>
        </div>
      </div>

    </aside>
  );

}

export default Sidebar