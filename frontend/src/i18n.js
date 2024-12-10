import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import translationAR from "./locales/ar/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationES from "./locales/es/translation.json";

const resources={
    en: {
        translation:translationEN
    },
    ar:{
        translation:translationAR
    },
    fr:{
        translation:translationFR
    },
    es:{
        translation:translationES
    }
  }
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    },
    react:{
      useSuspense: false  
    }
  });

export default i18n