import { useLanguage } from '@/contexts/LanguageContext';
import enTranslations from '@/locales/en.json';
import hnTranslations from '@/locales/hn.json';
import mrTranslations from '@/locales/mr.json';

type TranslationKey = string;

const translations = {
  en: enTranslations,
  hn: hnTranslations,
  mr: mrTranslations
};

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let translation: any = translations[currentLanguage as keyof typeof translations] || translations.en;
    
    for (const k of keys) {
      translation = translation?.[k];
    }
    
    return translation || key;
  };

  return { t, currentLanguage };
};