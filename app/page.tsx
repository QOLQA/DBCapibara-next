'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (isAuthenticated) {
				router.push('/models');
			} else {
				router.push('/login');
			}
		}
	}, [isAuthenticated, loading, router]);

	// Mostrar loading mientras se verifica
	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
				<p className="text-text-secondary">Cargando...</p>
			</div>
		</div>
	);
}
