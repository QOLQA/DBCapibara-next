"use client";

import { useTranslation as useTranslationBase } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n";

/**
 * Client-side hook for translations
 * In the future, this can be extended to use context or state for dynamic locale switching
 */
export function useTranslation(locale?: Locale) {
	const { t } = useTranslationBase(locale || defaultLocale);

	return { t };
}
