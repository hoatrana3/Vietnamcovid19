import Vue from 'vue'
import VueI18n from 'vue-i18n'
import LStorageUtils from "./utils/LStorageUtils";

Vue.use(VueI18n);

export const LANGUAGES = {
  VI: 'vi',
  EN: 'en'
};

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key)
    }
  });
  return messages
}

function getDefaultLocale() {
  let defaultLocale = LStorageUtils.getDefaultLanguage();

  if (defaultLocale == null) {
    defaultLocale = LANGUAGES.VI;
    LStorageUtils.saveDefaultLanguage(defaultLocale);
  }

  return defaultLocale
}

export default new VueI18n({
  locale: getDefaultLocale(),
  fallbackLocale: LANGUAGES.VI,
  messages: loadLocaleMessages()
})
