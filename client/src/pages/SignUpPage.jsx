import React, { useState } from 'react';
import { Bird } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSignUp from '../hooks/useSignUp';

/**
 * The SignUpPage component renders a form for users to sign up and create an account.
 * It performs a mutation to the server when the form is submitted, and upon success,
 * invalidates the authUser query to ensure the user is logged in.
 * @returns {JSX.Element} The SignUpPage component.
 */
const SignUpPage = () => {
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  /**
   * Handles the submission of the sign up form, preventing the default
   * submission action and calling the signupMutation with the current
   * signUpData.
   * @param {React.FormEvent<HTMLFormElement>} e The form event.
   */
  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signUpData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="cupcake"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Form Left Section */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <Bird className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              WordyBirdy
            </span>
          </div>

          {error && (
            <div className="alert alert-error shadow-lg mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join WordyBirdy and start your learning journey today!
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Full name"
                      className="input input-bordered w-full"
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter Email address e.g johndoe@gmail.com"
                      className="input input-bordered w-full"
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="**********"
                      className="input input-bordered w-full"
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 8 characters long.
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:underline">
                          privacy policy
                        </span>
                      </span>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary w-full">
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Already have an account?
                      <Link
                        to="/login"
                        className="text-primary hover:underline"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Form Right Section */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/Halloween video call.gif"
                alt="Language connection ilustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Connect with Language partners worldwide
              </h2>
              <p className="text-sm opacity-70">
                Pratice converstaions, make friends and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage