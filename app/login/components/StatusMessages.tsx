type OptimisticState = { status: 'idle' | 'submitting' | 'success', message?: string };

interface StatusMessagesProps {
	errors: string[] | null;
	optimisticState: OptimisticState;
}

export function StatusMessages({ errors, optimisticState }: StatusMessagesProps) {
	return (
		<>
			{/* Error Messages */}
			{errors && errors.length > 0 && (
				<div className="bg-red-dark/20 border border-red rounded-lg p-4 mb-6 transition-all duration-300">
					<ul className="text-sm text-red space-y-1">
						{errors.map((error, index) => (
							<li key={index}>• {error}</li>
						))}
					</ul>
				</div>
			)}

			{/* Optimistic Success Message */}
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
			)}
		</>
	);
}
