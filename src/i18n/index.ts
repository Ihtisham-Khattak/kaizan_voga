import { getLocales } from 'expo-localization';
/* eslint-disable import/no-named-as-default-member -- i18next's default instance API */
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

import type { Language } from '@/store/types';

import en from './en';
import ur from './ur';

export const supportedLanguages: Language[] = ['en', 'ur'];

/** First-launch default: device language if we support it, otherwise English. */
export function detectLanguage(): Language {
  const code = getLocales()[0]?.languageCode;
  return code === 'ur' ? 'ur' : 'en';
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, ur: { translation: ur } },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
    compatibilityJSON: 'v4',
  });
}

export const setLanguage = (lang: Language) => i18n.changeLanguage(lang);

/** Typed-ish translate hook. Usage: `const { t } = useT(); t('tabs.home')`. */
export const useT = useTranslation;

export { i18n };
