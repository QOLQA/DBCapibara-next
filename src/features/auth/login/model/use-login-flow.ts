"use client";

import {
	useState,
	useEffect,
	useOptimistic,
	startTransition,
	useCallback,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../model/useAuth";
import { createLoginAction, createRegisterAction } from "./actions";
import type { LoginFormData, RegisterFormData } from "./validation";

type OptimisticState = {
	status: "idle" | "submitting" | "success";
	message?: string;
};

export function useLoginFlow() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const { login, register, isAuthenticated } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [optimisticState, setOptimisticState] = useOptimistic<OptimisticState>({
		status: "idle",
	});

	const getRedirectPath = useCallback(() => {
		return searchParams?.get("redirect") || "/projects";
	}, [searchParams]);

	const handleSuccess = useCallback(() => {
		// Forzar refresh del router para invalidar cache y re-evaluar autenticación
		// Esto asegura que el proxy.ts vea la cookie recién creada
		router.refresh();
		router.push(getRedirectPath());
	}, [getRedirectPath, router]);

	const loginAction = createLoginAction(
		login,
		setOptimisticState,
		handleSuccess,
	);
	const registerAction = createRegisterAction(
		register,
		setOptimisticState,
		handleSuccess,
	);

	const handleFormSubmit = async (data: LoginFormData | RegisterFormData) => {
		setServerError(null);

		startTransition(async () => {
			const error = isSignUp
				? await registerAction(data as RegisterFormData)
				: await loginAction(data as LoginFormData);

			if (error) {
				setServerError(error);
			}
		});
	};

	useEffect(() => {
		if (isAuthenticated) {
			// Forzar refresh antes de redirigir para asegurar estado actualizado
			router.refresh();
			router.push(getRedirectPath());
		}
	}, [getRedirectPath, isAuthenticated, router]);

	useEffect(() => {
		setServerError(null);
	}, [isSignUp]);

	return {
		isSignUp,
		setIsSignUp,
		optimisticState,
		currentErrors: serverError ? [serverError] : null,
		handleFormSubmit,
	};
}
