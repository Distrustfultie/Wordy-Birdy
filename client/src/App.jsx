import React from 'react'
import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import OnboardingPage from './pages/OnboardingPage';
import ChatPage from './pages/ChatPage';
import CallPage from './pages/CallPage';
import NotificationsPage from './pages/NotificationsPage';
import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader';
import useAuthUser from './hooks/useAuthUser';
import Layout from "./components/Layout";
import { useThemeStore } from './store/useThemeStore';


/**
 * The App component is the top-level component for the application. It
 * renders a set of routes, including the home page, login page, signup
 * page, notifications page, call page, and chat page. It also renders
 * a Toaster component for displaying toast notifications.
 *
 * The component uses the useAuthUser and useThemeStore hooks to get the
 * current authenticated user and theme, respectively. It uses the
 * isLoading property from useAuthUser to determine whether to render
 * a PageLoader component while the authentication state is loading.
 *
 * The component renders a different set of routes depending on whether
 * the user is authenticated and onboarded. If the user is not
 * authenticated, it renders the login page. If the user is authenticated
 * but not onboarded, it renders the onboarding page. If the user is
 * authenticated and onboarded, it renders the home page and the
 * notifications page.
 *
 * The component also renders a Layout component that wraps the home
 * page, notifications page, and chat page. The Layout component renders
 * a sidebar on the left side of the page, and a main content area on
 * the right side of the page. The main content area renders the
 * corresponding page component.
 */
const App = () => {

  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  if (isLoading) return <PageLoader />;

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )}
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App