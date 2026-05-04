"use client";

import { LoginForm, useLoginFlow } from "@fsd/features/auth";
import { AuthToggle } from "./AuthToggle";
import { StatusMessages } from "./StatusMessages";
import { Logo } from "@fsd/shared/ui/logo";

export function AuthFlow() {
  const {
    isSignUp,
    setIsSignUp,
    optimisticState,
    currentErrors,
    handleFormSubmit,
  } = useLoginFlow();

  return (
    <div className="min-h-screen bg-primary-gray flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="bg-secondary-gray rounded-2xl shadow-lg p-8 border border-gray transition-all duration-300">
          <div className="flex justify-center mb-5">
            <Logo className="inline-block" logoClassName="text-blue w-52" />
          </div>

          <AuthToggle isSignUp={isSignUp} onToggle={setIsSignUp} />

          <StatusMessages
            errors={currentErrors}
            optimisticState={optimisticState}
          />
          <LoginForm
            isSignUp={isSignUp}
            onSubmit={handleFormSubmit}
            isSubmitting={optimisticState.status === "submitting"}
          />

          <div className="mt-6 text-center transition-all duration-300">
            <p className="text-sm text-secondary-white transition-all duration-300">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue hover:text-blue/80 font-medium transition-colors duration-300"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
