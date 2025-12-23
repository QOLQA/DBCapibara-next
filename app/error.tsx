"use client";

import { useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const { t } = useTranslation();
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-4">
			<h1 className="text-4xl font-bold">Error</h1>
			<p className="text-lg text-muted-foreground">
				{t("errors.somethingWentWrong")}
			</p>
			<button
				onClick={reset}
				className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
			>
				{t("common.tryAgain")}
			</button>
		</div>
	);
}
