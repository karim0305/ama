import {
    APP_REGISTRY,
    AppEntry,
    normalizeText,
} from "../../constants/appAliases";

export interface ResolvedApp {
  entry: AppEntry;
  matchedAlias: string;
  confidence: "exact" | "partial";
}

/**
 * Resolves free-form text (English / Urdu / Roman Urdu, with or without
 * verbs like "open"/"kholo") to a known app entry.
 */
export function resolveApp(rawText: string): ResolvedApp | null {
  const normalized = normalizeText(rawText);
  if (!normalized) return null;

  // Pass 1: exact alias match (highest confidence)
  for (const entry of APP_REGISTRY) {
    for (const alias of entry.aliases) {
      if (normalized === alias.toLowerCase()) {
        return { entry, matchedAlias: alias, confidence: "exact" };
      }
    }
  }

  // Pass 2: substring match — normalized text contains the alias,
  // or the alias contains the normalized text (handles leftover words
  // the noise-word list didn't catch, e.g. "mera whatsapp")
  for (const entry of APP_REGISTRY) {
    for (const alias of entry.aliases) {
      const aliasLower = alias.toLowerCase();
      if (normalized.includes(aliasLower) || aliasLower.includes(normalized)) {
        return { entry, matchedAlias: alias, confidence: "partial" };
      }
    }
  }

  return null;
}

export function listKnownApps(): string[] {
  return APP_REGISTRY.map((e) => e.displayName);
}
