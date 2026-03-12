"use client";

import { useState, useEffect, useCallback } from "react";
import { handleApiError } from "@fsd/shared/api";
import { useTranslation } from "@/hooks/use-translation";
import type { User, LoginCredentials, RegisterData } from "@fsd/entities/user";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const useAuth = () => {
	const { t } = useTranslation();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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
				setUser(null);
			}
		} catch (err) {
			console.error("Error verificando autenticación:", err);
			localStorage.removeItem("access_token");
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	const login = useCallback(
		async (credentials: LoginCredentials) => {
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

				if (typeof document !== "undefined") {
					const isProduction = process.env.NODE_ENV === "production";
					const cookieOptions = [
						`access_token=${data.access_token}`,
						"path=/",
						"max-age=1800",
						"SameSite=Lax",
						isProduction ? "Secure" : "",
					]
						.filter(Boolean)
						.join("; ");

					document.cookie = cookieOptions;
				}

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

	const register = useCallback(
		async (data: RegisterData) => {
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

	const logout = useCallback(() => {
		localStorage.removeItem("access_token");

		if (typeof document !== "undefined") {
			document.cookie =
				"access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}

		setUser(null);
		setError(null);
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
	};
};
