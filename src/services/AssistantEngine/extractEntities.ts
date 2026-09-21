import { IntentType } from "../../types/commands";

export function extractEntities(
  intent: IntentType,
  rawText: string,
): Record<string, string> {
  const lower = rawText.toLowerCase().trim();

  switch (intent) {
    case "CALL_CONTACT": {
      let match = lower.match(/^call\s+(?:to\s+)?(.+)$/);
      if (match) return { contact: match[1].trim() };

      match = lower.match(/^(.+?)\s+ko\s+call/);
      if (match) return { contact: match[1].trim() };

      return {};
    }

    case "OPEN_APP":
      // The AppResolver itself handles noise-word stripping,
      // so we just pass the raw text through as the "app" entity.
      return { app: rawText };

    default:
      return {};
  }
}
