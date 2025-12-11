'use client';

import { useEffect } from 'react';
import { getAuthToken } from '@/lib/api';

/**
 * Componente que sincroniza el token JWT entre localStorage y cookies
 * Esto permite que tanto client components como server components accedan al token
 * 
 * NOTA: En producción, considera usar httpOnly cookies por seguridad
 * y manejar el token completamente del lado del servidor
 */
export function AuthTokenSync() {
	useEffect(() => {
		const syncToken = () => {
			const token = getAuthToken();

			if (token) {
				// Sincronizar token a cookies para que server components puedan acceder
				// SameSite=Lax previene CSRF attacks
				// Secure solo en producción (HTTPS)
				const isProduction = process.env.NODE_ENV === 'production';
				const cookieOptions = [
					`access_token=${token}`,
					'path=/',
					'max-age=1800', // 30 minutos
					'SameSite=Lax',
					isProduction ? 'Secure' : '' // Solo HTTPS en producción
				].filter(Boolean).join('; ');

				document.cookie = cookieOptions;
			} else {
				// Limpiar cookie si no hay token
				document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
			}
		};

		// Sincronizar inmediatamente
		syncToken();

		// Sincronizar cada vez que cambie el localStorage
		window.addEventListener('storage', syncToken);

		// Sincronizar periódicamente (cada 5 minutos) por si acaso
		const interval = setInterval(syncToken, 5 * 60 * 1000);

		return () => {
			window.removeEventListener('storage', syncToken);
			clearInterval(interval);
		};
	}, []);

	return null;
}
