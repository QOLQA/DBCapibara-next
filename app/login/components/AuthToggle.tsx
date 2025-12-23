interface AuthToggleProps {
	isSignUp: boolean;
	onToggle: (isSignUp: boolean) => void;
}

export function AuthToggle({ isSignUp, onToggle }: AuthToggleProps) {
	return (
		<div className="flex rounded-xl bg-terciary-gray p-1 mb-8 transition-all duration-300">
			<button
				type="button"
				onClick={() => onToggle(false)}
				className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer ${!isSignUp
						? 'bg-blue text-white shadow-sm scale-[1.02]'
						: 'text-secondary-white hover:text-white hover:bg-cuartenary-gray'
					}`}
			>
				Log In
			</button>
			<button
				type="button"
				onClick={() => onToggle(true)}
				className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer ${isSignUp
						? 'bg-blue text-white shadow-sm scale-[1.02]'
						: 'text-secondary-white hover:text-white hover:bg-cuartenary-gray'
					}`}
			>
				Sign Up
			</button>
		</div>
	);
}
