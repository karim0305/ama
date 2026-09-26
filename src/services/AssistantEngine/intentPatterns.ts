import { IntentType } from "../../types/commands";

interface IntentPattern {
  intent: IntentType;
  // Patterns are checked in order; first match wins.
  test: (normalized: string) => boolean;
  requiresConfirmation: boolean;
}

// normalized = lowercased, trimmed command text
export const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: "GO_HOME",
    test: (t) =>
      /\b(go\s*home|home\s*screen|ghar\s*jao|home\s*par\s*jao)\b/.test(t),
    requiresConfirmation: false,
  },
  {
    intent: "GO_BACK",
    test: (t) => /\b(go\s*back|^back$|peeche\s*jao|wapas\s*jao)\b/.test(t),
    requiresConfirmation: false,
  },
  {
    intent: "OPEN_RECENTS",
    test: (t) => /\b(recent\s*apps?|recents|pichlay\s*apps?)\b/.test(t),
    requiresConfirmation: false,
  },
  {
    intent: "OPEN_WIFI_SETTINGS",
    test: (t) => /\bwi[\s-]?fi\b/.test(t),
    requiresConfirmation: false,
  },
  {
    intent: "OPEN_BLUETOOTH_SETTINGS",
    test: (t) => /\bbluetooth\b/.test(t),
    requiresConfirmation: false,
  },
  {
    intent: "ENABLE_ACCESSIBILITY",
    test: (t) => /\benable\s*accessibility\b/.test(t),
    requiresConfirmation: false,
  },
  {
    intent: "OPEN_SETTINGS",
    test: (t) => /\b(settings|سیٹنگز|setting)\b/.test(t),
    requiresConfirmation: false,
  },
  {
    intent: "CHECK_BATTERY",
    test: (t) => /\b(battery|batari|بیٹری)\b/.test(t),
    requiresConfirmation: false,
  },
  {
    intent: "CALL_CONTACT",
    // "call X", "X ko call karo", "X ko call karein"
    test: (t) => /^call\s+/.test(t) || /\sko\s+call\b/.test(t),
    requiresConfirmation: true, // sensitive action — Phase 9 security requirement
  },
  {
    intent: "INSTALL_APP",
    test: (t) => /^install\s+/.test(t) || /\binstall\s+karo\b/.test(t),
    requiresConfirmation: false,
  },
  // OPEN_APP is the fallback — anything that isn't the above and
  // isn't total gibberish gets tried against the AppResolver.
];
