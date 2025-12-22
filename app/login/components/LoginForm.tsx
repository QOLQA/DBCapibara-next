import InputField from '@/components/ui/InputField';
import { SubmitButton } from './SubmitButton';

interface LoginFormProps {
	isSignUp: boolean;
	action: (formData: FormData) => void;
}

export function LoginForm({ isSignUp, action }: LoginFormProps) {
	return (
		<form action={action} className="space-y-6 transition-all duration-300">
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
	);
}
