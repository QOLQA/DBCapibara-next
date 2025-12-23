import type { LoginFormData, RegisterFormData } from './validation';

export const createLoginAction = (
	login: (credentials: { username: string; password: string }) => Promise<void>,
	setOptimisticState: (state: { status: 'idle' | 'submitting' | 'success', message?: string }) => void,
	onSuccess: () => void
) => {
	return async (data: LoginFormData): Promise<string | null> => {
		setOptimisticState({ status: 'submitting', message: 'Iniciando sesión...' });

		try {
			await login(data);
			setOptimisticState({ status: 'success', message: '¡Inicio de sesión exitoso!' });
			onSuccess();
			return null;
		} catch (error) {
			setOptimisticState({ status: 'idle' });
			const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
			return errorMessage;
		}
	};
};

export const createRegisterAction = (
	register: (data: { username: string; email: string; password: string; full_name?: string }) => Promise<void>,
	setOptimisticState: (state: { status: 'idle' | 'submitting' | 'success', message?: string }) => void,
	onSuccess: () => void
) => {
	return async (data: RegisterFormData): Promise<string | null> => {
		setOptimisticState({ status: 'submitting', message: 'Creando cuenta...' });

		try {
			await register({
				username: data.username,
				email: data.email,
				password: data.password,
				full_name: data.full_name || undefined
			});
			setOptimisticState({ status: 'success', message: '¡Cuenta creada exitosamente!' });
			onSuccess();
			return null;
		} catch (error) {
			setOptimisticState({ status: 'idle' });
			const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
			return errorMessage;
		}
	};
};
