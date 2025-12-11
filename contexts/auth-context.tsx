'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/hooks/use-auth';

interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: string | null;
	login: (credentials: { username: string; password: string }) => Promise<any>;
	register: (data: { username: string; email: string; password: string; full_name?: string }) => Promise<any>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const auth = useAuth();

	return (
		<AuthContext.Provider value={auth}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
}
