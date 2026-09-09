"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { handleApiError, API_URL, setAuthCookie, clearAuthCookie } from "@fsd/shared/api";
import { useTranslation } from "@fsd/shared/i18n/use-translation";
import type { User, UserResponse, LoginResult, LoginCredentials, RegisterData } from "@fsd/entities/user";

export const useAuth = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// React Compiler cannot optimize: async function used as dep in useEffect below
	const checkAuth = useCallback(async () => {
		const token = localStorage.getItem("access_token");

		if (!token) {
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(`${API_URL}/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const userData = await response.json();
				setUser(userData);
			} else {
				localStorage.removeItem("access_token");
				clearAuthCookie();
				setUser(null);
			}
		} catch {
			localStorage.removeItem("access_token");
			clearAuthCookie();
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	// React Compiler cannot optimize: depends on checkAuth (stable ref needed to avoid stale closure)
	const login = useCallback(
		async (credentials: LoginCredentials): Promise<LoginResult> => {
			setError(null);
			setLoading(true);

			try {
				const formData = new URLSearchParams();
				formData.append("username", credentials.username);
				formData.append("password", credentials.password);

				const response = await fetch(`${API_URL}/auth/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: formData,
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					const errorMessage = handleApiError(errorData, response, t);
					throw new Error(errorMessage);
				}

				const data = await response.json();
				localStorage.setItem("access_token", data.access_token);
				setAuthCookie(data.access_token);

				await checkAuth();

				return data;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error al iniciar sesión";
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[checkAuth, t]
	);

	// React Compiler cannot optimize: depends on login (stable ref needed to avoid stale closure)
	const register = useCallback(
		async (data: RegisterData): Promise<UserResponse> => {
			setError(null);
			setLoading(true);

			try {
				const response = await fetch(`${API_URL}/auth/register`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));

					if (Array.isArray(errorData.detail)) {
						const messages = errorData.detail
							.map((err: { msg?: string }) => err.msg)
							.join(", ");
						throw new Error(messages);
					}

					const errorMessage = handleApiError(errorData, response, t);
					throw new Error(errorMessage);
				}

				const userData = await response.json();

				await login({
					username: data.username,
					password: data.password,
				});

				return userData;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error al registrar";
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[login, t]
	);

	// React Compiler cannot optimize: closure over setUser/setError state setters
	const logout = useCallback(() => {
		localStorage.removeItem("access_token");
		clearAuthCookie();
		setUser(null);
		setError(null);
		router.push("/login");
		router.refresh();
	}, [router]);

	// React Compiler cannot optimize: async function passed as stable ref to AuthContext consumers
	const refreshUser = useCallback(async (): Promise<void> => {
		const token = localStorage.getItem("access_token");
		if (!token) return;

		try {
			const response = await fetch(`${API_URL}/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const userData = await response.json();
				setUser(userData);
			}
		} catch {
			// Refresh is best-effort — user stays as-is if the request fails
		}
	}, []);

	return {
		user,
		loading,
		error,
		login,
		register,
		logout,
		isAuthenticated: !!user,
		checkAuth,
		refreshUser,
	};
};
