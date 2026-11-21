import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircleIcon } from "lucide-react";
import useLogin from "../hooks/useLogin";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import { getErrorMessage } from "../lib/utilis";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to keep your language streak going.">
      {error && (
        <div role="alert" className="alert alert-error mb-6 text-sm">
          <AlertCircleIcon className="size-5" />
          <span>{getErrorMessage(error)}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Email</span>
          </div>
          <input
            type="email"
            placeholder="you@example.com"
            className="input input-bordered w-full"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            autoComplete="email"
            required
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Password</span>
          </div>
          <PasswordInput
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="btn btn-primary w-full mt-2" disabled={isPending}>
          {isPending && <span className="loading loading-spinner loading-sm" />}
          {isPending ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-base-content/70">
        New to WordyBirdy?{" "}
        <Link to="/signup" className="link link-primary font-medium">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
