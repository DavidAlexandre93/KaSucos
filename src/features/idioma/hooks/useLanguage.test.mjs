import test from "node:test";
import assert from "node:assert/strict";
import { resolveLanguageFromCandidates } from "./languageDetection.js";

test("resolveLanguageFromCandidates usa locale completo suportado", () => {
  const language = resolveLanguageFromCandidates(["fr", "en-US"], "pt");
  assert.equal(language, "fr");
});

test("resolveLanguageFromCandidates reduz locale composto para idioma base", () => {
  const language = resolveLanguageFromCandidates(["es-MX", "en-US"], "pt");
  assert.equal(language, "es");
});

test("resolveLanguageFromCandidates interpreta lista com q-factor", () => {
  const language = resolveLanguageFromCandidates("de-DE,de;q=0.9,en-US;q=0.8", "pt");
  assert.equal(language, "en");
});

test("resolveLanguageFromCandidates retorna fallback quando nenhum idioma suportado é encontrado", () => {
  const language = resolveLanguageFromCandidates(["de-DE", "it-IT"], "pt");
  assert.equal(language, "pt");
});

test("resolveLanguageFromCandidates permite fallback nulo para detectar ausência de match", () => {
  const language = resolveLanguageFromCandidates(["de-DE", "it-IT"], null);
  assert.equal(language, null);
});
