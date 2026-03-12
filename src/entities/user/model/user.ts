export interface User {
	id: string;
	username: string;
	email: string;
	full_name?: string;
	avatar?: string;
	is_active: boolean;
	created_at: string;
}

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface RegisterData {
	username: string;
	email: string;
	password: string;
	full_name?: string;
}
