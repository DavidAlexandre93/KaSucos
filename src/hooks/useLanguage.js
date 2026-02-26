import { useEffect, useState } from "react";

const COUNTRY_LANGUAGE_MAP = {
  BR: "pt",
  PT: "pt",
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  NZ: "en",
  IE: "en",
  FR: "fr",
  BE: "fr",
  CH: "fr",
  LU: "fr",
  MC: "fr",
  ES: "es",
  MX: "es",
  AR: "es",
  CL: "es",
  CO: "es",
  PE: "es",
  UY: "es",
  PY: "es",
  BO: "es",
  EC: "es",
  VE: "es",
  CR: "es",
  PA: "es",
  JP: "ja",
};

const SUPPORTED_LANGUAGES = ["pt", "en", "es", "fr", "ja"];

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : "pt";
}

function getBrowserLanguage() {
  const language = navigator.language?.slice(0, 2)?.toLowerCase();
  return normalizeLanguage(language);
}

async function getCountryLanguage() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return COUNTRY_LANGUAGE_MAP[data.country_code] ?? null;
  } catch {
    return null;
  }
}

export function useLanguage() {
  const [language, setLanguage] = useState("pt");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("kasucos-language");

    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setLanguage(savedLanguage);
      return;
    }

    getCountryLanguage().then((detectedLanguage) => {
      setLanguage(normalizeLanguage(detectedLanguage ?? getBrowserLanguage()));
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleLanguageChange = (nextLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(nextLanguage)) {
      return;
    }

    setLanguage(nextLanguage);
    localStorage.setItem("kasucos-language", nextLanguage);
  };

  return {
    language,
    setLanguage: handleLanguageChange,
  };
}
