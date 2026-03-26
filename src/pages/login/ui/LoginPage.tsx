"use client";

import { Suspense } from "react";
import { AuthFlow } from "@fsd/widgets/auth-panel";

export function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-primary-gray flex items-center justify-center p-4">
					<div className="w-full max-w-md">
						<div className="bg-secondary-gray rounded-2xl shadow-lg p-8 border border-gray">
							<div className="text-center">
								<p className="text-white">Loading...</p>
							</div>
						</div>
					</div>
				</div>
			}
		>
			<AuthFlow />
		</Suspense>
	);
}
