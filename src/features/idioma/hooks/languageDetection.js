const SUPPORTED_LANGUAGES = ["pt", "en", "es", "fr", "ja"];

function toLanguageTagList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap((entry) => toLanguageTagList(entry));
  }

  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((entry) => entry.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);
}

export function resolveLanguageFromCandidates(candidates, fallbackLanguage = "pt") {
  const normalizedFallback = fallbackLanguage == null
    ? null
    : (SUPPORTED_LANGUAGES.includes(fallbackLanguage) ? fallbackLanguage : "pt");
  const tags = toLanguageTagList(candidates);

  for (const tag of tags) {
    if (SUPPORTED_LANGUAGES.includes(tag)) {
      return tag;
    }

    const baseLanguage = tag.split(/[-_]/)[0];
    if (SUPPORTED_LANGUAGES.includes(baseLanguage)) {
      return baseLanguage;
    }
  }

  return normalizedFallback;
}

export function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : "pt";
}

export { SUPPORTED_LANGUAGES };
