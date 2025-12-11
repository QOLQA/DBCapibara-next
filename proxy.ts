import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas protegidas que requieren autenticación
const protectedRoutes = ['/models'];

// Rutas públicas (login, registro, etc)
const publicRoutes = ['/login', '/'];

/**
 * Proxy de Next.js 16 para manejar autenticación
 * (Anteriormente llamado "middleware" en Next.js 15 y anteriores)
 * 
 * Ventajas de usar Proxy:
 * - Se ejecuta en edge runtime (ultra rápido)
 * - Evita renderizar componentes innecesarios
 * - Redirige antes de cargar la página
 * - Verificación optimista sin llamadas a DB
 */
export default async function proxy(request: NextRequest) {
	const path = request.nextUrl.pathname;

	// Verificar si la ruta actual es protegida
	const isProtectedRoute = protectedRoutes.some(route =>
		path.startsWith(route)
	);

	// Verificar si la ruta actual es pública
	// Solo coincide exactamente con las rutas públicas, no con startsWith
	const isPublicRoute = publicRoutes.includes(path);

	// Obtener token de las cookies
	const token = request.cookies.get('access_token')?.value;
	const hasToken = !!token;

	// Verificar si el token está expirado (optimista)
	let isTokenExpired = false;
	if (token) {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			isTokenExpired = payload.exp * 1000 < Date.now();
		} catch {
			isTokenExpired = true;
		}
	}

	// Redirigir a /login si intenta acceder a ruta protegida sin token válido
	if (isProtectedRoute && (!hasToken || isTokenExpired)) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('redirect', path);
		return NextResponse.redirect(loginUrl);
	}

	// Redirigir a /models si intenta acceder a ruta pública estando autenticado
	if (isPublicRoute && hasToken && !isTokenExpired) {
		return NextResponse.redirect(new URL('/models', request.url));
	}

	return NextResponse.next();
}

// Configuración de rutas donde se ejecuta el proxy
// Excluye API routes, archivos estáticos, y assets
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (images, etc)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
	],
};