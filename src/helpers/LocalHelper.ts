import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';

export class LocalHelper {

  //'/locales/{{lng}}.json'
  static init = async (backends:string[]) => {

    const backendOptions = backends.map((path) => ({ loadPath: path }));


    console.log("backend options", backendOptions)
    console.log({backend: {
      backends: backends.map(() => HttpBackend),
      backendOptions,
    }})

    await i18n
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
          backends: backends.map(() => HttpBackend),
          backendOptions,
        },
        supportedLngs: ['en', 'es'],
      });
  }

  static label(key:string) {
    return i18n.t(key);
  }

}
