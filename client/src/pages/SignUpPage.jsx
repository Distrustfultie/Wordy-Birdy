import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircleIcon } from "lucide-react";
import useSignUp from "../hooks/useSignUp";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import { getErrorMessage } from "../lib/utilis";

/** 0-4 rough password strength, for the meter only (server enforces length >= 8). */
const strength = (pw) =>
  [pw.length >= 8, /[A-Z]/.test(pw) && /[a-z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean)
    .length;

const STRENGTH_LABEL = ["Too short", "Weak", "Okay", "Good", "Strong"];
const STRENGTH_COLOR = ["progress-error", "progress-error", "progress-warning", "progress-info", "progress-success"];

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({ fullName: "", email: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const { isPending, error, signupMutation } = useSignUp();

  const score = signupData.password.length < 8 ? 0 : strength(signupData.password);

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <AuthLayout title="Create your account" subtitle="Find language partners and start talking today.">
      {error && (
        <div role="alert" className="alert alert-error mb-6 text-sm">
          <AlertCircleIcon className="size-5" />
          <span>{getErrorMessage(error)}</span>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Full name</span>
          </div>
          <input
            type="text"
            placeholder="Jane Doe"
            className="input input-bordered w-full"
            value={signupData.fullName}
            onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
            autoComplete="name"
            required
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Email</span>
          </div>
          <input
            type="email"
            placeholder="you@example.com"
            className="input input-bordered w-full"
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            autoComplete="email"
            required
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Password</span>
            {signupData.password && (
              <span className="label-text-alt text-base-content/60">{STRENGTH_LABEL[score]}</span>
            )}
          </div>
          <PasswordInput
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            autoComplete="new-password"
            minLength={8}
          />
          <progress
            className={`progress ${STRENGTH_COLOR[score]} mt-2 h-1.5 w-full`}
            value={signupData.password ? Math.max(score, 0.5) : 0}
            max="4"
          />
          <div className="label pt-1">
            <span className="label-text-alt text-base-content/50">At least 8 characters</span>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm mt-0.5"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
          />
          <span className="text-sm text-base-content/70">
            I agree to the <span className="link link-primary">terms of service</span> and{" "}
            <span className="link link-primary">privacy policy</span>
          </span>
        </label>

        <button type="submit" className="btn btn-primary w-full" disabled={isPending || !agreed}>
          {isPending && <span className="loading loading-spinner loading-sm" />}
          {isPending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-base-content/70">
        Already have an account?{" "}
        <Link to="/login" className="link link-primary font-medium">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUpPage;
