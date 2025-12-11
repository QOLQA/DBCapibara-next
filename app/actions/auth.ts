'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function logout() {
	const supabase = await createClient()
	await supabase.auth.signOut()
	revalidatePath('/', 'layout')
	redirect('/login')
}

export async function getCurrentUser() {
	const supabase = await createClient()
	const { data: { user }, error } = await supabase.auth.getUser()
	
	if (error || !user) {
		return null
	}
	
	return {
		id: user.id,
		email: user.email,
		name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0],
		avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
		provider: user.app_metadata?.provider || 'email',
	}
}
