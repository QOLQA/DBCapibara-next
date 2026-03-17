import { en } from "./en";
import { es } from "./es";

export type Locale = "en" | "es";

export const translations = {
	en,
	es,
} as const;

// Default locale is English
export const defaultLocale: Locale = "en";

// Helper function to get nested translation value
export function getTranslation(obj: Record<string, any>, path: string): string {
	const keys = path.split(".");
	let value: any = obj;

	for (const key of keys) {
		if (value && typeof value === "object" && key in value) {
			value = value[key];
		} else {
			return path; // Return path if translation not found
		}
	}

	return typeof value === "string" ? value : path;
}

// Hook-like function to get translations (can be used in both client and server)
export function useTranslation(locale: Locale = defaultLocale) {
	const t = translations[locale] || translations[defaultLocale];

	return {
		t: (path: string) => getTranslation(t, path),
		locale,
	};
}
