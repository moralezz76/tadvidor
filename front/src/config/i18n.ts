import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { camelCase } from 'lodash';
import moment from 'moment';

import 'moment/locale/pt-br';
import 'moment/locale/es';

const detection = {
  lookupLocalStorage: 'language',
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    load: 'languageOnly',
    fallbackLng: 'en',
    debug: false,
    ns: ['translation'],
    defaultNS: 'translation',
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    detection,
    react: {
      wait: true,
      //bindStore: false,
      bindI18n: 'languageChanged',
      useSuspense: false,
    },
  });

export const locale =
  i18n.services.languageDetector.detectors.localStorage.lookup(detection) || 'en';
moment.locale(locale);

const pascalCase = (str: string) => str[0].toUpperCase() + camelCase(str.substr(1));

export const translateWithPrefix = (term: string, prefix: string = 'label') => {
  return i18n.t(`${prefix}${pascalCase(term)}`);
};

export const t = (str: string, options?: {}) => i18n.t(str, options);

export default i18n;
