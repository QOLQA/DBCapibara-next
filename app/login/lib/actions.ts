import { validatePassword, validateUsername, validateEmail } from '@/lib/api';

export const createLoginAction = (
	login: (credentials: { username: string; password: string }) => Promise<void>,
	setOptimisticState: (state: { status: 'idle' | 'submitting' | 'success', message?: string }) => void,
	onSuccess: () => void
) => {
	return async (prevState: string[] | null, formData: FormData): Promise<string[] | null> => {
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		// Validación
		const errors: string[] = [];
		if (!username) errors.push('El username es requerido');
		if (!password) errors.push('La contraseña es requerida');

		if (errors.length > 0) return errors;

		// Optimistic update
		setOptimisticState({ status: 'submitting', message: 'Iniciando sesión...' });

		try {
			await login({ username, password });
			setOptimisticState({ status: 'success', message: '¡Inicio de sesión exitoso!' });
			onSuccess();
			return null;
		} catch (error) {
			setOptimisticState({ status: 'idle' });
			const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
			return [errorMessage];
		}
	};
};

export const createRegisterAction = (
	register: (data: { username: string; email: string; password: string; full_name?: string }) => Promise<void>,
	setOptimisticState: (state: { status: 'idle' | 'submitting' | 'success', message?: string }) => void,
	onSuccess: () => void
) => {
	return async (prevState: string[] | null, formData: FormData): Promise<string[] | null> => {
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const full_name = formData.get('full_name') as string;

		// Validación
		const errors: string[] = [];

		const usernameValidation = validateUsername(username);
		if (!usernameValidation.isValid) {
			errors.push(...usernameValidation.errors);
		}

		if (!validateEmail(email)) {
			errors.push('Email inválido');
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.isValid) {
			errors.push(...passwordValidation.errors);
		}

		if (errors.length > 0) return errors;

		// Optimistic update
		setOptimisticState({ status: 'submitting', message: 'Creando cuenta...' });

		try {
			await register({
				username,
				email,
				password,
				full_name: full_name || undefined
			});
			setOptimisticState({ status: 'success', message: '¡Cuenta creada exitosamente!' });
			onSuccess();
			return null;
		} catch (error) {
			setOptimisticState({ status: 'idle' });
			const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
			return [errorMessage];
		}
	};
};
