import { normalizeText } from "../../constants/appAliases";
import { StructuredCommand } from "../../types/commands";
import { resolveApp } from "../Android/AppResolver";
import { detectLanguage } from "./detectLanguage";
import { extractEntities } from "./extractEntities";
import { INTENT_PATTERNS } from "./intentPatterns";

export interface AssistantEngineInput {
  text: string;
  language?: "en" | "ur" | "roman-ur" | "auto";
}

/**
 * Converts free-form text (English / Urdu / Roman Urdu) into a
 * StructuredCommand. This is the single entry point both voice and
 * text input funnel through — see Phase 6 requirement #13.
 *
 * Pipeline:
 *  1. Detect language (if not explicitly given)
 *  2. Normalize text (strip punctuation/noise words)
 *  3. Match against known intent patterns
 *  4. If no pattern matches, try resolving it as an app name (OPEN_APP)
 *  5. If that also fails, return UNKNOWN
 *
 * This is intentionally rule-based and fully offline — see Phase 0/14
 * for why: predictable, auditable, no internet dependency for core
 * commands. A cloud AI fallback can be added later as an additional
 * step after step 5, for genuinely ambiguous phrasing this parser
 * can't handle — but that step is NOT implemented in this phase,
 * since it introduces cost/internet dependency that should be an
 * explicit choice, not a silent default.
 */
export function parseCommand(input: AssistantEngineInput): StructuredCommand {
  const { text } = input;
  const detectedLanguage =
    input.language && input.language !== "auto"
      ? input.language
      : detectLanguage(text);

  const normalized = normalizeText(text);

  for (const pattern of INTENT_PATTERNS) {
    if (pattern.test(normalized) || pattern.test(text.toLowerCase())) {
      const entities = extractEntities(pattern.intent, text);
      return {
        intent: pattern.intent,
        entities,
        requiresConfirmation: pattern.requiresConfirmation,
        raw: text,
        detectedLanguage,
      };
    }
  }

  // Fallback: try resolving as an app name
  const resolved = resolveApp(text);
  if (resolved) {
    return {
      intent: "OPEN_APP",
      entities: { app: text },
      requiresConfirmation: false,
      raw: text,
      detectedLanguage,
    };
  }

  return {
    intent: "UNKNOWN",
    entities: {},
    requiresConfirmation: false,
    raw: text,
    detectedLanguage,
  };
}
