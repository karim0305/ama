import * as Battery from "expo-battery";
import { StructuredCommand } from "../../types/commands";
import {
  goBack,
  openAccessibilitySettings,
  openRecents,
} from "../Android/AccessibilityActions";
import {
  goHome,
  openApp,
  openBluetoothSettings,
  openSettings,
  openWifiSettings,
  searchOnPlayStore,
} from "../Android/AndroidActions";

export interface ExecutionResult {
  success: boolean;
  message: string;
  // Present only for CALL_CONTACT — the UI needs this to show the
  // confirmation/disambiguation modals before actually placing the call.
  needsContactLookup?: string;
}

export async function executeCommand(
  command: StructuredCommand,
): Promise<ExecutionResult> {
  switch (command.intent) {
    case "OPEN_APP":
      return openApp(command.entities.app ?? command.raw);
    case "INSTALL_APP":
      return searchOnPlayStore(command.entities.app ?? command.raw);

    case "GO_HOME":
      return goHome();

    case "GO_BACK":
      return goBack();

    case "OPEN_RECENTS":
      return openRecents();

    case "OPEN_SETTINGS":
      return await openSettings();

    case "OPEN_WIFI_SETTINGS":
      return await openWifiSettings();

    case "OPEN_BLUETOOTH_SETTINGS":
      return await openBluetoothSettings();

    case "ENABLE_ACCESSIBILITY":
      openAccessibilitySettings();
      return {
        success: true,
        message:
          "Opening Accessibility Settings — please enable AMA Assistant.",
      };

    case "CHECK_BATTERY": {
      const level = await Battery.getBatteryLevelAsync();
      const percent = Math.round(level * 100);
      return { success: true, message: `Battery is at ${percent}%.` };
    }

    case "CALL_CONTACT":
      // This intent needs contact lookup + confirmation UI, which lives
      // in the screen component (modals). We signal that here rather
      // than executing directly, since a call is a sensitive action
      // (Phase 9 security requirement).
      return {
        success: true,
        message: "",
        needsContactLookup: command.entities.contact,
      };

    case "UNKNOWN":
    default:
      return {
        success: false,
        message: `Sorry, I didn't understand "${command.raw}".`,
      };
  }
}
