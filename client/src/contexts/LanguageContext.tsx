import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  supportedLanguages: { code: string; name: string }[];
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  supportedLanguages: [
    { code: 'en', name: 'English' },
    { code: 'hn', name: 'हिंदी' },
    { code: 'mr', name: 'मराठी' }
  ]
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'hn', name: 'हिंदी' },
    { code: 'es', name: 'Español' },
    { code: 'mr', name: 'मराठी' }
  ];

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: string) => {
    if (supportedLanguages.some(lang => lang.code === language)) {
      setCurrentLanguage(language);
      localStorage.setItem('selectedLanguage', language);
    }
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      supportedLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext };