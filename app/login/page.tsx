'use client';

import { useState, useEffect, useActionState, useOptimistic, Suspense } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { createLoginAction, createRegisterAction } from './lib/actions';
import { StatusMessages } from './components/StatusMessages';
import { AuthToggle } from './components/AuthToggle';
import { LoginForm } from './components/LoginForm';

function LoginContent() {
	const [isSignUp, setIsSignUp] = useState(false);
	const { login, register, isAuthenticated } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();

	// Optimistic UI state
	type OptimisticState = { status: 'idle' | 'submitting' | 'success', message?: string };
	const [optimisticState, setOptimisticState] = useOptimistic<OptimisticState>(
		{ status: 'idle' }
	);

	// Callback para redirigir después del éxito
	const handleSuccess = () => {
		const redirect = searchParams.get('redirect') || '/models';
		router.push(redirect);
	};

	// Form actions usando las funciones factory
	const loginAction = createLoginAction(login, setOptimisticState, handleSuccess);
	const registerAction = createRegisterAction(register, setOptimisticState, handleSuccess);

	const [loginErrors, loginFormAction] = useActionState(loginAction, null);
	const [registerErrors, registerFormAction] = useActionState(registerAction, null);

	// Estado actual dependiendo del modo
	const currentErrors = isSignUp ? registerErrors : loginErrors;
	const currentAction = isSignUp ? registerFormAction : loginFormAction;

	// Redirigir si ya está autenticado
	useEffect(() => {
		if (isAuthenticated) {
			const redirect = searchParams.get('redirect') || '/models';
			router.push(redirect);
		}
	}, [isAuthenticated, router, searchParams]);

	return (
		<div className="min-h-screen bg-primary-gray flex items-center justify-center p-4 transition-colors duration-300">
			<div className="w-full max-w-md">
				<div className="bg-secondary-gray rounded-2xl shadow-lg p-8 border border-gray transition-all duration-300">
					<AuthToggle isSignUp={isSignUp} onToggle={setIsSignUp} />

					{/* Title */}
					<div className="text-center mb-8 transition-all duration-300">
						<h1 className="text-2xl font-bold text-white mb-2 transition-all duration-300">
							{isSignUp ? 'Create Account' : 'Welcome Back'}
						</h1>
						<p className="text-secondary-white transition-all duration-300">
							{isSignUp
								? 'Fill in your information to get started'
								: 'Enter your credentials to access your account'
							}
						</p>
					</div>

					<StatusMessages errors={currentErrors} optimisticState={optimisticState} />
					<LoginForm isSignUp={isSignUp} action={currentAction} />

					{/* Footer */}
					<div className="mt-6 text-center transition-all duration-300">
						<p className="text-sm text-secondary-white transition-all duration-300">
							{isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
							<button
								type="button"
								onClick={() => setIsSignUp(!isSignUp)}
								className="text-blue hover:text-blue/80 font-medium transition-colors duration-300"
							>
								{isSignUp ? 'Sign in' : 'Sign up'}
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-primary-gray flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<div className="bg-secondary-gray rounded-2xl shadow-lg p-8 border border-gray">
						<div className="text-center">
							<p className="text-white">Loading...</p>
						</div>
					</div>
				</div>
			</div>
		}>
			<LoginContent />
		</Suspense>
	);
}