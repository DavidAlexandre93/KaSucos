import { useEffect, useState } from "react";
import { fetchWithRetry } from "@/shared/lib/http";
import { logWarn } from "@/shared/lib/logger";

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
const GEO_LANGUAGE_CACHE_KEY = "kasucos-geo-language";
const GEO_LANGUAGE_CACHE_TTL_MS = 1000 * 60 * 60 * 24;

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : "pt";
}

function getBrowserLanguage() {
  const language = navigator.language?.slice(0, 2)?.toLowerCase();
  return normalizeLanguage(language);
}

function readCachedGeoLanguage() {
  if (typeof window === "undefined") return null;

  try {
    const cached = JSON.parse(window.localStorage.getItem(GEO_LANGUAGE_CACHE_KEY) || "null");
    if (!cached?.language || !cached?.ts) return null;
    if (Date.now() - cached.ts > GEO_LANGUAGE_CACHE_TTL_MS) return null;
    return normalizeLanguage(cached.language);
  } catch {
    return null;
  }
}

function writeCachedGeoLanguage(language) {
  if (typeof window === "undefined" || !language) return;

  window.localStorage.setItem(
    GEO_LANGUAGE_CACHE_KEY,
    JSON.stringify({ language: normalizeLanguage(language), ts: Date.now() }),
  );
}

async function getCountryLanguage() {
  try {
    const response = await fetchWithRetry("https://ipapi.co/json/", {}, { retries: 1, timeoutMs: 3500, retryDelayMs: 200 });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const detectedLanguage = COUNTRY_LANGUAGE_MAP[data.country_code] ?? null;
    if (detectedLanguage) writeCachedGeoLanguage(detectedLanguage);
    return detectedLanguage;
  } catch (error) {
    logWarn("Falha ao detectar idioma por geolocalização", { error: String(error) });
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

    const cachedGeoLanguage = readCachedGeoLanguage();
    if (cachedGeoLanguage) {
      setLanguage(cachedGeoLanguage);
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
