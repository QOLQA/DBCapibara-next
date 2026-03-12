"use client";

import { useEffect } from "react";
import { getAuthToken } from "@fsd/shared/api";

/**
 * Syncs JWT token between localStorage and cookies
 * Allows both client and server components to access the token
 */
export function AuthTokenSync() {
	useEffect(() => {
		const syncToken = () => {
			const token = getAuthToken();

			if (token) {
				const isProduction = process.env.NODE_ENV === "production";
				const cookieOptions = [
					`access_token=${token}`,
					"path=/",
					"max-age=1800",
					"SameSite=Lax",
					isProduction ? "Secure" : "",
				]
					.filter(Boolean)
					.join("; ");

				document.cookie = cookieOptions;
			} else {
				document.cookie =
					"access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
			}
		};

		syncToken();
		window.addEventListener("storage", syncToken);
		const interval = setInterval(syncToken, 5 * 60 * 1000);

		return () => {
			window.removeEventListener("storage", syncToken);
			clearInterval(interval);
		};
	}, []);

	return null;
}
