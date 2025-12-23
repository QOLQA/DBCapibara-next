import { validatePassword, validateUsername, validateEmail } from '@/lib/api';

export type LoginFormData = {
	username: string;
	password: string;
};

export type RegisterFormData = {
	username: string;
	email: string;
	password: string;
	full_name?: string;
};

// Validación personalizada para react-hook-form
export const loginValidation = {
	username: {
		required: 'El username es requerido',
	},
	password: {
		required: 'La contraseña es requerida',
	},
};

export const registerValidation = {
	username: {
		required: 'El username es requerido',
		validate: (value: string) => {
			const validation = validateUsername(value);
			return validation.isValid || validation.errors[0];
		},
	},
	email: {
		required: 'El email es requerido',
		validate: (value: string) => {
			return validateEmail(value) || 'Email inválido';
		},
	},
	password: {
		required: 'La contraseña es requerida',
		validate: (value: string) => {
			const validation = validatePassword(value);
			return validation.isValid || validation.errors[0];
		},
	},
};
