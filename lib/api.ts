/**
 * Servicio API con autenticación JWT automática
 * Maneja tokens, headers y errores de autenticación
 */

// Client-side: usa la URL pública accesible desde el navegador
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
 * Fetch con autenticación automática
 * Agrega el token JWT a todas las peticiones
 */
export const fetchWithAuth = async (
	endpoint: string,
	options: FetchOptions = {}
): Promise<Response> => {
	const token = getAuthToken();

	// Verificar si el token existe y no ha expirado
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

		// Si recibimos 401, el token es inválido o expiró
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

/**
 * Métodos convenientes para operaciones CRUD
 */
export const api = {
	async get<T>(endpoint: string): Promise<T> {
		const response = await fetchWithAuth(endpoint);
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || "Error en la petición");
		}
		return response.json();
	},

	async post<T>(endpoint: string, data: any): Promise<T> {
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

	async patch<T>(endpoint: string, data: any): Promise<T> {
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

/**
 * Validaciones del lado del cliente
 */
export const validatePassword = (password: string) => {
	const errors: string[] = [];

	if (password.length < 8) {
		errors.push("La contraseña debe tener al menos 8 caracteres");
	}
	if (!/[A-Z]/.test(password)) {
		errors.push("La contraseña debe tener al menos una mayúscula");
	}
	if (!/[a-z]/.test(password)) {
		errors.push("La contraseña debe tener al menos una minúscula");
	}
	if (!/\d/.test(password)) {
		errors.push("La contraseña debe tener al menos un número");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

export const validateUsername = (username: string) => {
	const errors: string[] = [];

	if (username.length < 3) {
		errors.push("El username debe tener al menos 3 caracteres");
	}
	if (!/^[a-zA-Z0-9_]+$/.test(username)) {
		errors.push("Solo se permiten letras, números y guiones bajos");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

export const validateEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Manejo centralizado de errores de API
 * @param error - The error object
 * @param response - The response object (optional)
 * @param t - Translation function (optional, defaults to English)
 */
export const handleApiError = (
	error: any,
	response?: Response,
	t?: (path: string) => string
): string => {
	// Helper to get translation with fallback to English
	const getTranslation = (path: string): string => {
		if (t) return t(path);
		// Default to English if no translation function provided
		// Import statically to avoid dynamic require issues
		try {
			const { useTranslation } = require("@/i18n");
			const { t: defaultT } = useTranslation("en");
			return defaultT(path);
		} catch {
			// Fallback to English hardcoded strings if import fails
			const englishErrors: Record<string, string> = {
				"apiErrors.sessionExpired": "Session expired or invalid credentials",
				"apiErrors.noPermission":
					"You don't have permission to perform this action",
				"apiErrors.notFound": "Resource not found",
				"apiErrors.alreadyExists": "Resource already exists",
				"apiErrors.invalidData": "Invalid input data",
				"apiErrors.tooManyRequests":
					"Too many requests. Please try again later",
				"apiErrors.serverError": "Internal server error",
				"apiErrors.unknownError": "An unknown error occurred",
			};
			return englishErrors[path] || path;
		}
	};

	if (response) {
		switch (response.status) {
			case 401:
				return getTranslation("apiErrors.sessionExpired");
			case 403:
				return getTranslation("apiErrors.noPermission");
			case 404:
				return getTranslation("apiErrors.notFound");
			case 409:
				return getTranslation("apiErrors.alreadyExists");
			case 422:
				return getTranslation("apiErrors.invalidData");
			case 429:
				return getTranslation("apiErrors.tooManyRequests");
			case 500:
			case 502:
			case 503:
				return getTranslation("apiErrors.serverError");
			default:
				return error?.message || getTranslation("apiErrors.unknownError");
		}
	}

	if (error instanceof TypeError && error.message.includes("fetch")) {
		return "Error de conexión. Verifica tu internet";
	}

	return error?.message || "Error desconocido";
};
