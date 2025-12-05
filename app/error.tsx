'use client'

import { useEffect } from 'react'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-4">
			<h1 className="text-4xl font-bold">Error</h1>
			<p className="text-lg text-muted-foreground">
				Algo salió mal. Por favor, intenta de nuevo.
			</p>
			<button
				onClick={reset}
				className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
			>
				Intentar de nuevo
			</button>
		</div>
	)
}
