/**
 * API service with automatic JWT authentication
 * Handles tokens, headers and authentication errors
 */

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export { API_URL };

// Error keys — consumers are responsible for i18n translation
export const API_ERROR_SESSION_EXPIRED = "errors.session_expired";
export const API_ERROR_REQUEST_FAILED = "errors.request_failed";

const AUTH_COOKIE = "access_token";

function authCookieFlags(): string {
	const isProduction = process.env.NODE_ENV === "production";
	return ["path=/", "SameSite=Lax", isProduction ? "Secure" : ""]
		.filter(Boolean)
		.join("; ");
}

export const setAuthCookie = (token: string): void => {
	if (typeof document === "undefined") return;
	document.cookie = `${AUTH_COOKIE}=${token}; ${authCookieFlags()}; max-age=1800`;
};

export const clearAuthCookie = (): void => {
	if (typeof document === "undefined") return;
	document.cookie = `${AUTH_COOKIE}=; ${authCookieFlags()}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getAuthToken = (): string | null => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("access_token");
};

export const isTokenExpired = (token: string): boolean => {
	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		return payload.exp * 1000 < Date.now();
	} catch {
		return true;
	}
};

interface FetchOptions extends RequestInit {
	headers?: Record<string, string>;
}

/**
 * Fetch with automatic authentication
 * Adds JWT token to all requests
 */
export const fetchWithAuth = async (
	endpoint: string,
	options: FetchOptions = {},
): Promise<Response> => {
	const token = getAuthToken();

	if (token && isTokenExpired(token)) {
		localStorage.removeItem("access_token");
		clearAuthCookie();
		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}
		throw new Error(API_ERROR_SESSION_EXPIRED);
	}

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...options.headers,
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

	const response = await fetch(url, {
		...options,
		headers,
	});

	if (response.status === 401) {
		localStorage.removeItem("access_token");
		clearAuthCookie();
		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}
		throw new Error(API_ERROR_SESSION_EXPIRED);
	}

	return response;
};

export const api = {
	async get<T>(endpoint: string): Promise<T> {
		const response = await fetchWithAuth(endpoint);
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || API_ERROR_REQUEST_FAILED);
		}
		return response.json();
	},

	async post<T>(endpoint: string, data: unknown): Promise<T> {
		const response = await fetchWithAuth(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || API_ERROR_REQUEST_FAILED);
		}
		return response.json();
	},

	async patch<T>(endpoint: string, data: unknown): Promise<T> {
		const response = await fetchWithAuth(endpoint, {
			method: "PATCH",
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || API_ERROR_REQUEST_FAILED);
		}
		return response.json();
	},

	async delete(endpoint: string): Promise<void> {
		const response = await fetchWithAuth(endpoint, {
			method: "DELETE",
		});
		if (!response.ok && response.status !== 204) {
			const error = await response.json();
			throw new Error(error.detail || API_ERROR_REQUEST_FAILED);
		}
	},
};
