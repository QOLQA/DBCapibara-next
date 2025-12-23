'use client';

interface SubmitButtonProps {
	isSignUp: boolean;
	isSubmitting: boolean;
}

export function SubmitButton({ isSignUp, isSubmitting }: SubmitButtonProps) {
	return (
		<button
			type="submit"
			disabled={isSubmitting}
			className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-4 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{isSubmitting ? (
				<span className="flex items-center justify-center gap-2">
					<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Processing...
				</span>
			) : (
				isSignUp ? 'Create Account' : 'Sign In'
			)}
		</button>
	);
}
