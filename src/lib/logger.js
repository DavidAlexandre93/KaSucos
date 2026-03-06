export function logWarn(message, context = {}) {
  if (import.meta.env.DEV) {
    console.warn(`[KaSucos] ${message}`, context);
  }
}

export function logError(message, context = {}) {
  console.error(`[KaSucos] ${message}`, context);
}
