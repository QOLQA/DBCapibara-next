"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "@fsd/features/auth";
import type { User } from "@fsd/entities/user";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: string | null;
	login: (credentials: {
		username: string;
		password: string;
	}) => Promise<unknown>;
	register: (data: {
		username: string;
		email: string;
		password: string;
		full_name?: string;
	}) => Promise<unknown>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const auth = useAuth();

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
}
