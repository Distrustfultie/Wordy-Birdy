import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthUser from "./hooks/useAuthUser";
import { useThemeStore } from "./store/useThemeStore";
import { StreamChatProvider } from "./context/StreamChatContext";
import PageLoader from "./components/PageLoader";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OnboardingPage from "./pages/OnboardingPage";
import FriendsPage from "./pages/FriendsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ChatLoader from "./components/ChatLoader";

// Chat UI and the video SDK are large; load them only when those pages open.
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const CallPage = lazy(() => import("./pages/CallPage"));

/** Scroll to the top on every route change (chat manages its own scrolling). */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Braces matter: newer browsers return a Promise from scrollTo, and an
    // effect must not return anything but a cleanup function.
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  // Apply the theme to <html> too, so modals, scrollbars and the page background match.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (isLoading) return <PageLoader />;

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = Boolean(authUser?.isOnboarded);

  /** Logged-in, onboarded users only; everyone else is sent where they belong. */
  const app = (element, { layout = true, fullHeight = false } = {}) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isOnboarded) return <Navigate to="/onboarding" replace />;
    return layout ? <Layout fullHeight={fullHeight}>{element}</Layout> : element;
  };

  /** Logged-out users only. */
  const guest = (element) =>
    isAuthenticated ? <Navigate to={isOnboarded ? "/" : "/onboarding"} replace /> : element;

  return (
    <StreamChatProvider>
      <div className="min-h-screen bg-base-100 text-base-content" data-theme={theme}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={!isAuthenticated ? <LandingPage /> : app(<HomePage />)} />
          <Route path="/login" element={guest(<LoginPage />)} />
          <Route path="/signup" element={guest(<SignUpPage />)} />
          <Route
            path="/onboarding"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" replace />
              ) : isOnboarded ? (
                <Navigate to="/" replace />
              ) : (
                <OnboardingPage />
              )
            }
          />

          <Route path="/friends" element={app(<FriendsPage />)} />
          <Route path="/messages" element={app(<Suspense fallback={<ChatLoader />}><MessagesPage /></Suspense>)} />
          <Route path="/notifications" element={app(<NotificationsPage />)} />
          <Route path="/profile/:id" element={app(<ProfilePage />)} />
          <Route path="/settings" element={app(<SettingsPage />)} />
          <Route
            path="/chat/:id"
            element={app(<Suspense fallback={<ChatLoader />}><ChatPage /></Suspense>, { fullHeight: true })}
          />
          <Route
            path="/call/:id"
            element={app(<Suspense fallback={<PageLoader />}><CallPage /></Suspense>, { layout: false })}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            className: "!bg-base-100 !text-base-content !rounded-2xl !shadow-xl border border-base-300",
          }}
        />
      </div>
    </StreamChatProvider>
  );
};

export default App;
