'use client';

import { useState } from 'react';
import { login, signup } from './actions';
import InputField from '@/components/ui/InputField';

export default function LoginPage() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		name: '',
		avatar_url: ''
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = new FormData();
		data.append('email', formData.email);
		data.append('password', formData.password);

		if (isSignUp) {
			data.append('name', formData.name);
			data.append('avatar_url', formData.avatar_url);
			await signup(data);
		} else {
			await login(data);
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="bg-surface rounded-2xl shadow-lg p-8">
					{/* Toggle Buttons */}
					<div className="flex rounded-xl bg-surface-secondary p-1 mb-8">
						<button
							type="button"
							onClick={() => setIsSignUp(false)}
							className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${!isSignUp
								? 'bg-primary text-white shadow-sm'
								: 'text-text-secondary hover:text-foreground'
								}`}
						>
							Log In
						</button>
						<button
							type="button"
							onClick={() => setIsSignUp(true)}
							className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${isSignUp
								? 'bg-primary text-white shadow-sm'
								: 'text-text-secondary hover:text-foreground'
								}`}
						>
							Sign Up
						</button>
					</div>

					{/* Title */}
					<div className="text-center mb-8">
						<h1 className="text-2xl font-bold text-foreground mb-2">
							{isSignUp ? 'Create Account' : 'Welcome Back'}
						</h1>
						<p className="text-text-secondary">
							{isSignUp
								? 'Fill in your information to get started'
								: 'Enter your credentials to access your account'
							}
						</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{isSignUp && (
							<InputField
								label="Full Name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Enter your full name"
								required
							/>
						)}

						<InputField
							label="Email Address"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="Enter your email"
							required
						/>

						<InputField
							label="Password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleInputChange}
							placeholder="Enter your password"
							required
						/>

						{isSignUp && (
							<InputField
								label="Avatar URL"
								name="avatar_url"
								type="url"
								value={formData.avatar_url}
								onChange={handleInputChange}
								placeholder="Enter avatar URL (optional)"
							/>
						)}

						<button
							type="submit"
							className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-4 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
						>
							{isSignUp ? 'Create Account' : 'Sign In'}
						</button>
					</form>

					{/* Footer */}
					<div className="mt-6 text-center">
						<p className="text-sm text-text-secondary">
							{isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
							<button
								type="button"
								onClick={() => setIsSignUp(!isSignUp)}
								className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
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