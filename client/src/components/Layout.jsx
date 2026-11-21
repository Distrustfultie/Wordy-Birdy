import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

/**
 * App shell for logged-in pages: sidebar (desktop), top bar, and a bottom tab
 * bar on mobile.
 * `fullHeight` makes the page fill the viewport instead of scrolling (chat),
 * and hides the mobile tab bar to give the conversation more room.
 */
const Layout = ({ children, fullHeight = false }) => (
  <div className="min-h-screen flex bg-base-100">
    <Sidebar />
    <div className="flex-1 min-w-0 flex flex-col">
      <Navbar />
      <main
        className={
          fullHeight
            ? "h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-5rem)] overflow-hidden"
            : "flex-1 pb-24 lg:pb-10"
        }
      >
        {children}
      </main>
      {!fullHeight && <MobileNav />}
    </div>
  </div>
);

export default Layout;
