'use client';

import { useState, useEffect, useActionState, useOptimistic, Suspense } from 'react';
import InputField from '@/components/ui/InputField';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { validatePassword, validateUsername, validateEmail } from '@/lib/api';
import { SubmitButton } from './components/SubmitButton';

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

	// Form actions using useActionState
	const loginAction = async (prevState: string[] | null, formData: FormData): Promise<string[] | null> => {
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		// Validación
		const errors: string[] = [];
		if (!username) errors.push('El username es requerido');
		if (!password) errors.push('La contraseña es requerida');

		if (errors.length > 0) return errors;

		// Optimistic update
		setOptimisticState({ status: 'submitting', message: 'Iniciando sesión...' });

		try {
			await login({ username, password });

			setOptimisticState({ status: 'success', message: '¡Inicio de sesión exitoso!' });

			// Redirigir
			const redirect = searchParams.get('redirect') || '/models';
			router.push(redirect);

			return null;
		} catch (error) {
			setOptimisticState({ status: 'idle' });
			const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
			return [errorMessage];
		}
	};

	const registerAction = async (prevState: string[] | null, formData: FormData): Promise<string[] | null> => {
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const full_name = formData.get('full_name') as string;

		// Validación
		const errors: string[] = [];

		const usernameValidation = validateUsername(username);
		if (!usernameValidation.isValid) {
			errors.push(...usernameValidation.errors);
		}

		if (!validateEmail(email)) {
			errors.push('Email inválido');
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.isValid) {
			errors.push(...passwordValidation.errors);
		}

		if (errors.length > 0) return errors;

		// Optimistic update
		setOptimisticState({ status: 'submitting', message: 'Creando cuenta...' });

		try {
			await register({
				username,
				email,
				password,
				full_name: full_name || undefined
			});

			setOptimisticState({ status: 'success', message: '¡Cuenta creada exitosamente!' });

			// Redirigir
			const redirect = searchParams.get('redirect') || '/models';
			router.push(redirect);

			return null;
		} catch (error) {
			setOptimisticState({ status: 'idle' });
			const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
			return [errorMessage];
		}
	};

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
					{/* Toggle Buttons */}
					<div className="flex rounded-xl bg-terciary-gray p-1 mb-8 transition-all duration-300">
						<button
							type="button"
							onClick={() => setIsSignUp(false)}
							className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer ${!isSignUp
								? 'bg-blue text-white shadow-sm scale-[1.02]'
								: 'text-secondary-white hover:text-white hover:bg-cuartenary-gray'
								}`}
						>
							Log In
						</button>
						<button
							type="button"
							onClick={() => setIsSignUp(true)}
							className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer ${isSignUp
								? 'bg-blue text-white shadow-sm scale-[1.02]'
								: 'text-secondary-white hover:text-white hover:bg-cuartenary-gray'
								}`}
						>
							Sign Up
						</button>
					</div>

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

					{/* Error Messages */}
					{currentErrors && currentErrors.length > 0 && (
						<div className="bg-red-dark/20 border border-red rounded-lg p-4 mb-6 transition-all duration-300">
							<ul className="text-sm text-red space-y-1">
								{currentErrors.map((error, index) => (
									<li key={index}>• {error}</li>
								))}
							</ul>
						</div>
					)}		{/* Optimistic Success Message */}
					{optimisticState.status === 'success' && (
						<div className="bg-green-dark/20 border border-green rounded-lg p-4 mb-6 transition-all duration-300">
							<p className="text-sm text-green">✓ {optimisticState.message}</p>
						</div>
					)}

					{/* Optimistic Loading Message */}
					{optimisticState.status === 'submitting' && (
						<div className="bg-blue-dark/20 border border-blue rounded-lg p-4 mb-6 transition-all duration-300">
							<p className="text-sm text-blue">⏳ {optimisticState.message}</p>
						</div>
					)}					{/* Form */}
					<form action={currentAction} className="space-y-6 transition-all duration-300">
						{isSignUp && (
							<>
								<InputField
									label="Username"
									name="username"
									placeholder="Enter your username"
									required
								/>
								<InputField
									label="Full Name (Optional)"
									name="full_name"
									placeholder="Enter your full name"
								/>
							</>
						)}

						{!isSignUp && (
							<InputField
								label="Username"
								name="username"
								placeholder="Enter your username"
								required
							/>
						)}

						{isSignUp && (
							<InputField
								label="Email Address"
								name="email"
								type="email"
								placeholder="Enter your email"
								required
							/>
						)}

						<InputField
							label="Password"
							name="password"
							type="password"
							placeholder="Enter your password"
							required
						/>

						<SubmitButton isSignUp={isSignUp} />
					</form>

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