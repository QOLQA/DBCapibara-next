/**
 * Centralized API error handling
 * @param error - The error object
 * @param response - The response object (optional)
 * @param t - Translation function (optional, defaults to English)
 */
export const handleApiError = (
	error: unknown,
	response?: Response,
	t?: (path: string) => string,
): string => {
	const getTranslation = (path: string): string => {
		if (t) return t(path);
		try {
			const { useTranslation } = require("@fsd/shared/lib/i18n");
			const { t: defaultT } = useTranslation("en");
			return defaultT(path);
		} catch {
			const englishErrors: Record<string, string> = {
				"apiErrors.sessionExpired": "Session expired or invalid credentials",
				"apiErrors.noPermission":
					"You don't have permission to perform this action",
				"apiErrors.notFound": "Resource not found",
				"apiErrors.alreadyExists": "Resource already exists",
				"apiErrors.invalidData": "Invalid input data",
				"apiErrors.tooManyRequests":
					"Too many requests. Please try again later",
				"apiErrors.serverError": "Internal server error",
				"apiErrors.unknownError": "An unknown error occurred",
			};
			return englishErrors[path] || path;
		}
	};

	if (response) {
		switch (response.status) {
			case 401:
				return getTranslation("apiErrors.sessionExpired");
			case 403:
				return getTranslation("apiErrors.noPermission");
			case 404:
				return getTranslation("apiErrors.notFound");
			case 409:
				return getTranslation("apiErrors.alreadyExists");
			case 422:
				return getTranslation("apiErrors.invalidData");
			case 429:
				return getTranslation("apiErrors.tooManyRequests");
			case 500:
			case 502:
			case 503:
				return getTranslation("apiErrors.serverError");
			default:
				return (
					(error as Error)?.message || getTranslation("apiErrors.unknownError")
				);
		}
	}

	if (error instanceof TypeError && error.message.includes("fetch")) {
		return "Error de conexión. Verifica tu internet";
	}

	return (error as Error)?.message || "Error desconocido";
};
