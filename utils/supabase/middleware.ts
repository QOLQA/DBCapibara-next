
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (request: NextRequest) => {
	// Create an unmodified response
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		supabaseUrl!,
		supabaseKey!,
		{
			cookies: {
				get(name: string) {
					return request.cookies.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					// If the cookie is updated, update the cookies for the request and response
					request.cookies.set({
						name,
						value,
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value,
						...options,
					});
				},
				remove(name: string, options: CookieOptions) {
					// If the cookie is removed, update the cookies for the request and response
					request.cookies.set({
						name,
						value: '',
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value: '',
						...options,
					});
				},
			},
		}
	);

	return { supabase, response };
};



export const updateSession = async (request: NextRequest) => {

	try {
		// Verificar que las variables de entorno existen
		if (!supabaseUrl || !supabaseKey) {
			return NextResponse.next({ request });
		}

		let supabaseResponse = NextResponse.next({
			request,
		})

		const supabase = createServerClient(
			supabaseUrl!,
			supabaseKey!,
			{
				cookies: {
					getAll() {
						return request.cookies.getAll()
					},
					setAll(cookiesToSet) {
						cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
						supabaseResponse = NextResponse.next({
							request,
						})
						cookiesToSet.forEach(({ name, value, options }) =>
							supabaseResponse.cookies.set(name, value, options)
						)
					},
				},
			}
		)

		// Check if user is authenticated
		const { data: { user }, error } = await supabase.auth.getUser()

		if (error) console.error('🚨 Error de autenticación:', error);

		// If there's an error or no user and it's a protected route, redirect to login
		const url = request.nextUrl.clone()
		const pathname = url.pathname
		const protectedRoutes = ['/', '/progress']
		const isProtectedRoute = protectedRoutes.includes(pathname)


		if (isProtectedRoute && (!user || error)) {
			url.pathname = '/login'
			return NextResponse.redirect(url)
		}

		// If user is authenticated and trying to access login page, redirect to home
		if (user && pathname === '/login') {
			url.pathname = '/'
			return NextResponse.redirect(url)
		}

		return supabaseResponse
	} catch (error) {
		// On error, let the request continue
		console.error('Error updating session:', error);
		return NextResponse.next({
			request,
		})
	}
}