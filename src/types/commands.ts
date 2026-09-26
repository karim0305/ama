export type AssistantState =
  | "IDLE"
  | "LISTENING"
  | "PROCESSING"
  | "EXECUTING"
  | "SUCCESS"
  | "ERROR";

export type Language = "en" | "ur" | "roman-ur" | "auto";

export type IntentType =
  | "OPEN_APP"
  | "CALL_CONTACT"
  | "GO_HOME"
  | "GO_BACK"
  | "OPEN_RECENTS"
  | "OPEN_SETTINGS"
  | "OPEN_WIFI_SETTINGS"
  | "OPEN_BLUETOOTH_SETTINGS"
  | "CHECK_BATTERY"
  | "ENABLE_ACCESSIBILITY"
  | "INSTALL_APP"
  | "UNKNOWN";

export interface StructuredCommand {
  intent: IntentType;
  entities: Record<string, string>;
  requiresConfirmation: boolean;
  raw: string;
  detectedLanguage: Language;
}
