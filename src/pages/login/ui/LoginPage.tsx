"use client";

import {
	useState,
	useEffect,
	useOptimistic,
	Suspense,
	startTransition,
} from "react";
import {
	useAuth,
	createLoginAction,
	createRegisterAction,
	StatusMessages,
	AuthToggle,
	LoginForm,
} from "@fsd/features/auth";
import type { LoginFormData, RegisterFormData } from "@fsd/features/auth";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const { login, register, isAuthenticated } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();

	type OptimisticState = {
		status: "idle" | "submitting" | "success";
		message?: string;
	};
	const [optimisticState, setOptimisticState] = useOptimistic<OptimisticState>({
		status: "idle",
	});

	const handleSuccess = () => {
		const redirect = searchParams?.get("redirect") || "/models";
		router.push(redirect);
	};

	const loginAction = createLoginAction(
		login,
		setOptimisticState,
		handleSuccess,
	);
	const registerAction = createRegisterAction(
		register,
		setOptimisticState,
		handleSuccess,
	);

	const handleFormSubmit = async (data: LoginFormData | RegisterFormData) => {
		setServerError(null);

		startTransition(async () => {
			const error = isSignUp
				? await registerAction(data as RegisterFormData)
				: await loginAction(data as LoginFormData);

			if (error) {
				setServerError(error);
			}
		});
	};

	useEffect(() => {
		if (isAuthenticated) {
			const redirect = searchParams?.get("redirect") || "/models";
			router.push(redirect);
		}
	}, [isAuthenticated, router, searchParams]);

	useEffect(() => {
		setServerError(null);
	}, [isSignUp]);

	const currentErrors = serverError ? [serverError] : null;

	return (
		<div className="min-h-screen bg-primary-gray flex items-center justify-center p-4 transition-colors duration-300">
			<div className="w-full max-w-md">
				<div className="bg-secondary-gray rounded-2xl shadow-lg p-8 border border-gray transition-all duration-300">
					<AuthToggle isSignUp={isSignUp} onToggle={setIsSignUp} />

					<div className="text-center mb-8 transition-all duration-300">
						<h1 className="text-2xl font-bold text-white mb-2 transition-all duration-300">
							{isSignUp ? "Create Account" : "Welcome Back"}
						</h1>
						<p className="text-secondary-white transition-all duration-300">
							{isSignUp
								? "Fill in your information to get started"
								: "Enter your credentials to access your account"}
						</p>
					</div>

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

export function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-primary-gray flex items-center justify-center p-4">
					<div className="w-full max-w-md">
						<div className="bg-secondary-gray rounded-2xl shadow-lg p-8 border border-gray">
							<div className="text-center">
								<p className="text-white">Loading...</p>
							</div>
						</div>
					</div>
				</div>
			}
		>
			<LoginContent />
		</Suspense>
	);
}
