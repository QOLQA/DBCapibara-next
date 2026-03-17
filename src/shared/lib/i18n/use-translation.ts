"use client";

import {
	useTranslation as useTranslationBase,
	defaultLocale,
	type Locale,
} from "@fsd/shared/lib/i18n";

export function useTranslation(locale?: Locale) {
	const { t } = useTranslationBase(locale || defaultLocale);

	return { t };
}
