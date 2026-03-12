/**
 * Client-side validation utilities
 */

export const validatePassword = (password: string) => {
	const errors: string[] = [];

	if (password.length < 8) {
		errors.push("La contraseña debe tener al menos 8 caracteres");
	}
	if (!/[A-Z]/.test(password)) {
		errors.push("La contraseña debe tener al menos una mayúscula");
	}
	if (!/[a-z]/.test(password)) {
		errors.push("La contraseña debe tener al menos una minúscula");
	}
	if (!/\d/.test(password)) {
		errors.push("La contraseña debe tener al menos un número");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

export const validateUsername = (username: string) => {
	const errors: string[] = [];

	if (username.length < 3) {
		errors.push("El username debe tener al menos 3 caracteres");
	}
	if (!/^[a-zA-Z0-9_]+$/.test(username)) {
		errors.push("Solo se permiten letras, números y guiones bajos");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

export const validateEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};
