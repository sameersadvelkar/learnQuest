export interface TranslationProvider {
  name: string;
  translate(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string>;
}

export interface TTSProvider {
  name: string;
  generateAudio(text: string, language: string, voice?: string): Promise<string | Blob>;
}

// Google Translate API integration
export class GoogleTranslateProvider implements TranslationProvider {
  name = 'Google Translate';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async translate(text: string, targetLanguage: string, sourceLanguage = 'auto'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Google Translate API key is required');
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  }
}

// LibreTranslate (Free alternative)
export class LibreTranslateProvider implements TranslationProvider {
  name = 'LibreTranslate';
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl = 'https://libretranslate.de', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async translate(text: string, targetLanguage: string, sourceLanguage = 'auto'): Promise<string> {
    const body: any = {
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
      format: 'text',
    };

    if (this.apiKey) {
      body.api_key = this.apiKey;
    }

    const response = await fetch(`${this.baseUrl}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.translatedText;
  }
}

// Built-in Web Speech API TTS
export class WebSpeechTTSProvider implements TTSProvider {
  name = 'Web Speech API';

  async generateAudio(text: string, language: string, voice?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;

      if (voice) {
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === voice || v.lang === language);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onend = () => resolve('audio-completed');
      utterance.onerror = (event) => reject(new Error(`Speech synthesis failed: ${event.error}`));

      speechSynthesis.speak(utterance);
    });
  }
}

// Google Cloud Text-to-Speech API
export class GoogleTTSProvider implements TTSProvider {
  name = 'Google Cloud TTS';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateAudio(text: string, language: string, voice?: string): Promise<Blob> {
    if (!this.apiKey) {
      throw new Error('Google Cloud TTS API key is required');
    }

    const voiceConfig = {
      languageCode: language,
      name: voice || `${language}-Standard-A`,
    };

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: voiceConfig,
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.0,
            pitch: 0.0,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`TTS generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    const audioBytes = data.audioContent;
    
    // Convert base64 to blob
    const byteCharacters = atob(audioBytes);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    
    return new Blob([byteArray], { type: 'audio/mpeg' });
  }
}

// Translation Service Manager
export class TranslationService {
  private translationProvider: TranslationProvider;
  private ttsProvider: TTSProvider;
  private cache: Map<string, string> = new Map();

  constructor(translationProvider: TranslationProvider, ttsProvider: TTSProvider) {
    this.translationProvider = translationProvider;
    this.ttsProvider = ttsProvider;
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
    const cacheKey = `${text}-${sourceLanguage || 'auto'}-${targetLanguage}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const translation = await this.translationProvider.translate(text, targetLanguage, sourceLanguage);
      this.cache.set(cacheKey, translation);
      return translation;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Return original text if translation fails
    }
  }

  async generateSpeech(text: string, language: string, voice?: string): Promise<string | Blob> {
    try {
      return await this.ttsProvider.generateAudio(text, language, voice);
    } catch (error) {
      console.error('TTS generation failed:', error);
      throw error;
    }
  }

  setTranslationProvider(provider: TranslationProvider) {
    this.translationProvider = provider;
  }

  setTTSProvider(provider: TTSProvider) {
    this.ttsProvider = provider;
  }
}

// Language configuration
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', code: 'en-US', flag: '🇺🇸' },
  es: { name: 'Spanish', code: 'es-ES', flag: '🇪🇸' },
  fr: { name: 'French', code: 'fr-FR', flag: '🇫🇷' },
  de: { name: 'German', code: 'de-DE', flag: '🇩🇪' },
  it: { name: 'Italian', code: 'it-IT', flag: '🇮🇹' },
  pt: { name: 'Portuguese', code: 'pt-BR', flag: '🇧🇷' },
  ru: { name: 'Russian', code: 'ru-RU', flag: '🇷🇺' },
  ja: { name: 'Japanese', code: 'ja-JP', flag: '🇯🇵' },
  ko: { name: 'Korean', code: 'ko-KR', flag: '🇰🇷' },
  zh: { name: 'Chinese', code: 'zh-CN', flag: '🇨🇳' },
  hi: { name: 'Hindi', code: 'hi-IN', flag: '🇮🇳' },
  ar: { name: 'Arabic', code: 'ar-SA', flag: '🇸🇦' },
  th: { name: 'Thai', code: 'th-TH', flag: '🇹🇭' },
  vi: { name: 'Vietnamese', code: 'vi-VN', flag: '🇻🇳' },
  tr: { name: 'Turkish', code: 'tr-TR', flag: '🇹🇷' },
};

// Default service instance (will be configured based on available API keys)
export const createTranslationService = (config: {
  translationProvider?: 'google' | 'libretranslate';
  ttsProvider?: 'webspeech' | 'google';
  googleApiKey?: string;
  googleTTSApiKey?: string;
  libreTranslateUrl?: string;
  libreTranslateApiKey?: string;
}): TranslationService => {
  let translationProvider: TranslationProvider;
  let ttsProvider: TTSProvider;

  // Configure translation provider
  switch (config.translationProvider) {
    case 'google':
      if (!config.googleApiKey) {
        throw new Error('Google API key required for Google Translate');
      }
      translationProvider = new GoogleTranslateProvider(config.googleApiKey);
      break;
    case 'libretranslate':
    default:
      translationProvider = new LibreTranslateProvider(
        config.libreTranslateUrl,
        config.libreTranslateApiKey
      );
      break;
  }

  // Configure TTS provider
  switch (config.ttsProvider) {
    case 'google':
      if (!config.googleTTSApiKey) {
        throw new Error('Google TTS API key required for Google Cloud TTS');
      }
      ttsProvider = new GoogleTTSProvider(config.googleTTSApiKey);
      break;
    case 'webspeech':
    default:
      ttsProvider = new WebSpeechTTSProvider();
      break;
  }

  return new TranslationService(translationProvider, ttsProvider);
};