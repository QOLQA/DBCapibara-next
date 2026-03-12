/**
 * API service with automatic JWT authentication
 * Handles tokens, headers and authentication errors
 */

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}
		throw new Error("Sesión expirada");
	}

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...options.headers,
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

	try {
		const response = await fetch(url, {
			...options,
			headers,
		});

		if (response.status === 401) {
			localStorage.removeItem("access_token");
			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}
			throw new Error("Sesión expirada");
		}

		return response;
	} catch (error) {
		console.error("Error en request:", error);
		throw error;
	}
};

export const api = {
	async get<T>(endpoint: string): Promise<T> {
		const response = await fetchWithAuth(endpoint);
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || "Error en la petición");
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
			throw new Error(error.detail || "Error en la petición");
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
			throw new Error(error.detail || "Error en la petición");
		}
		return response.json();
	},

	async delete(endpoint: string): Promise<void> {
		const response = await fetchWithAuth(endpoint, {
			method: "DELETE",
		});
		if (!response.ok && response.status !== 204) {
			const error = await response.json();
			throw new Error(error.detail || "Error en la petición");
		}
	},
};
