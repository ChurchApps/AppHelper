import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

export class LocalHelper {

  private static i18n = i18n
  	.use(Backend)
  	.use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      debug: true,
      interpolation: {
        escapeValue: false, // React already does escaping
      },
      backend: {
        loadPath: '/locales/{{lng}}.json',
      },
      supportedLngs: ['en', 'es'],
    });


  static label(key:string) {
    return i18n.t(key);
  }

}
