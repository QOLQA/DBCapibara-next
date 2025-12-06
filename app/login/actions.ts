'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
	const supabase = await createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	}

	const { data: authData, error } = await supabase.auth.signInWithPassword(data)

	if (error) {
		console.error('Login error:', error)
		redirect('/login?error=Invalid credentials')
	}

	console.log('Login successful:', authData)
	revalidatePath('/', 'layout')
	redirect('/')
}

export async function signup(formData: FormData) {
	const supabase = await createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	}

	const userData = {
		name: formData.get('name') as string,
		avatar_url: formData.get('avatar_url') as string,
	}

	const { data: authData, error } = await supabase.auth.signUp({
		...data,
		options: {
			data: userData
		}
	})

	if (error) {
		console.error('Signup error:', error)
		redirect('/login?error=Failed to create account')
	}

	console.log('Signup successful:', authData)
	revalidatePath('/', 'layout')
	redirect('/')
}