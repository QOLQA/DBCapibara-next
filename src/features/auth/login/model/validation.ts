import {
	validatePassword,
	validateUsername,
	validateEmail,
} from "@fsd/shared/api";

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

export const loginValidation = {
	username: {
		required: "El username es requerido" as const,
	},
	password: {
		required: "La contraseña es requerida" as const,
	},
};

export const registerValidation = {
	username: {
		required: "El username es requerido" as const,
		validate: (value: string) => {
			const validation = validateUsername(value);
			return validation.isValid || validation.errors[0];
		},
	},
	email: {
		required: "El email es requerido" as const,
		validate: (value: string) => {
			return validateEmail(value) || "Email inválido";
		},
	},
	password: {
		required: "La contraseña es requerida" as const,
		validate: (value: string) => {
			const validation = validatePassword(value);
			return validation.isValid || validation.errors[0];
		},
	},
};
