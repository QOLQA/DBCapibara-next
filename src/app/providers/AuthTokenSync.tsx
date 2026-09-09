"use client";

import { useEffect } from "react";
import { getAuthToken, setAuthCookie, clearAuthCookie } from "@fsd/shared/api";

/**
 * Syncs JWT token between localStorage and cookies
 * Allows both client and server components to access the token
 */
export function AuthTokenSync() {
	useEffect(() => {
		const syncToken = () => {
			const token = getAuthToken();

			if (token) {
				setAuthCookie(token);
			} else {
				clearAuthCookie();
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
