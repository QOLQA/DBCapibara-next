'use client';

import { useForm } from 'react-hook-form';
import { SubmitButton } from './SubmitButton';
import {
	LoginFormData,
	RegisterFormData,
	loginValidation,
	registerValidation
} from '../lib/validation';

interface LoginFormProps {
	isSignUp: boolean;
	onSubmit: (data: LoginFormData | RegisterFormData) => Promise<void>;
	isSubmitting: boolean;
}

export function LoginForm({ isSignUp, onSubmit, isSubmitting }: LoginFormProps) {
	const {
		register: registerField,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<RegisterFormData>({
		mode: 'onBlur', // Valida cuando el usuario sale del campo
	});

	// Reset form cuando cambia el modo (solo para login)
	const handleModeChange = () => {
		if (!isSignUp) {
			reset();
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 transition-all duration-300">
			{isSignUp && (
				<div className="space-y-2">
					<label htmlFor="username" className="block text-sm font-medium text-white">
						Username
					</label>
					<input
						id="username"
						type="text"
						placeholder="Enter your username"
						className={`w-full px-4 py-3 rounded-lg bg-terciary-gray border ${errors.username ? 'border-red' : 'border-gray'
							} text-white placeholder-secondary-white focus:outline-none focus:border-blue transition-colors duration-300`}
						{...registerField('username', registerValidation.username)}
					/>
					{errors.username && (
						<p className="text-sm text-red mt-1">{errors.username.message}</p>
					)}
				</div>
			)}

			{isSignUp && (
				<div className="space-y-2">
					<label htmlFor="full_name" className="block text-sm font-medium text-white">
						Full Name (Optional)
					</label>
					<input
						id="full_name"
						type="text"
						placeholder="Enter your full name"
						className="w-full px-4 py-3 rounded-lg bg-terciary-gray border border-gray text-white placeholder-secondary-white focus:outline-none focus:border-blue transition-colors duration-300"
						{...registerField('full_name')}
					/>
				</div>
			)}

			{!isSignUp && (
				<div className="space-y-2">
					<label htmlFor="username" className="block text-sm font-medium text-white">
						Username
					</label>
					<input
						id="username"
						type="text"
						placeholder="Enter your username"
						className={`w-full px-4 py-3 rounded-lg bg-terciary-gray border ${errors.username ? 'border-red' : 'border-gray'
							} text-white placeholder-secondary-white focus:outline-none focus:border-blue transition-colors duration-300`}
						{...registerField('username', loginValidation.username)}
					/>
					{errors.username && (
						<p className="text-sm text-red mt-1">{errors.username.message}</p>
					)}
				</div>
			)}

			{isSignUp && (
				<div className="space-y-2">
					<label htmlFor="email" className="block text-sm font-medium text-white">
						Email Address
					</label>
					<input
						id="email"
						type="email"
						placeholder="Enter your email"
						className={`w-full px-4 py-3 rounded-lg bg-terciary-gray border ${errors.email ? 'border-red' : 'border-gray'
							} text-white placeholder-secondary-white focus:outline-none focus:border-blue transition-colors duration-300`}
						{...registerField('email', registerValidation.email)}
					/>
					{errors.email && (
						<p className="text-sm text-red mt-1">{errors.email.message}</p>
					)}
				</div>
			)}

			<div className="space-y-2">
				<label htmlFor="password" className="block text-sm font-medium text-white">
					Password
				</label>
				<input
					id="password"
					type="password"
					placeholder="Enter your password"
					className={`w-full px-4 py-3 rounded-lg bg-terciary-gray border ${errors.password ? 'border-red' : 'border-gray'
						} text-white placeholder-secondary-white focus:outline-none focus:border-blue transition-colors duration-300`}
					{...registerField('password', isSignUp ? registerValidation.password : loginValidation.password)}
				/>
				{errors.password && (
					<p className="text-sm text-red mt-1">{errors.password.message}</p>
				)}
			</div>

			<SubmitButton isSignUp={isSignUp} isSubmitting={isSubmitting} />
		</form>
	);
}
