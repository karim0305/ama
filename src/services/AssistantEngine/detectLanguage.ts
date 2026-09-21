// Simple heuristic: Urdu script uses a distinct Unicode range.
// Roman Urdu vs English is genuinely ambiguous without a real
// language model, so we use a small keyword list of common
// Roman Urdu words as a signal. This is intentionally lightweight —
// a proper model-based detector would replace this if accuracy
// becomes an issue in practice.

import { Language } from "@/types/commands";

const URDU_SCRIPT_RANGE = /[\u0600-\u06FF]/;

const ROMAN_URDU_MARKERS = [
  "kholo",
  "khol",
  "karo",
  "kro",
  "chalao",
  "chalaao",
  "kaho",
  "batao",
  "ka",
  "ki",
  "ke",
  "hai",
  "hy",
  "mujhe",
  "mera",
  "meri",
  "aap",
  "tum",
  "karein",
  "karain",
  "ko",
];

export function detectLanguage(text: string): Language {
  if (URDU_SCRIPT_RANGE.test(text)) return "ur";

  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const romanMatches = words.filter((w) =>
    ROMAN_URDU_MARKERS.includes(w),
  ).length;

  if (romanMatches > 0) return "roman-ur";
  return "en";
}
