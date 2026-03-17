/**
 * Utilidades de API para server-side
 * Next.js server components y server actions
 */

import { cookies } from "next/headers";

// En producción (plataformas separadas): usa la URL pública del backend
// En desarrollo con Docker: usa BACKEND_URL (nombre del contenedor)
// En desarrollo sin Docker: usa localhost
const API_URL =
	process.env.BACKEND_URL ||
	process.env.NEXT_PUBLIC_BACKEND_URL ||
	"http://localhost:8000";

/**
 * Obtiene el token de autenticación de las cookies
 */
export async function getServerAuthToken(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get("access_token")?.value || null;
}

/**
 * Verifica si el usuario está autenticado (optimista)
 * Solo verifica la existencia del token, no su validez
 */
export async function isAuthenticated(): Promise<boolean> {
	const cookieStore = await cookies();
	return cookieStore.has("access_token");
}

/**
 * Fetch con autenticación para server-side
 */
export async function serverFetchWithAuth(
	endpoint: string,
	options: RequestInit = {}
): Promise<Response> {
	const token = await getServerAuthToken();

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers as Record<string, string>),
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

	return fetch(url, {
		...options,
		headers,
		cache: "no-store", // Siempre obtener datos frescos para datos autenticados
	});
}

/**
 * Helper para obtener soluciones del usuario autenticado
 */
export async function getAuthenticatedSolutions() {
	const response = await serverFetchWithAuth("/solutions");

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("UNAUTHORIZED");
		}
		throw new Error("Failed to fetch solutions");
	}

	return response.json();
}

export async function deleteAuthenticatedSolution(id: string) {
	const options: RequestInit = {
		method: "DELETE",
	};

	const response = await serverFetchWithAuth(`/solutions/${id}`, options);

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("UNAUTHORIZED");
		}
		throw new Error("Failed to delete solution");
	}

	return response.json();
}

/**
 * Helper para obtener una solución específica
 */
export async function getAuthenticatedSolution(id: string) {
	const response = await serverFetchWithAuth(`/solutions/${id}`);

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("UNAUTHORIZED");
		}
		if (response.status === 403) {
			throw new Error("FORBIDDEN");
		}
		throw new Error("Failed to fetch solution");
	}

	return response.json();
}
