import * as IntentLauncher from "expo-intent-launcher";
import AndroidLauncher from "../../../modules/android-launcher";
import { resolveApp } from "./AppResolver";

export interface ActionResult {
  success: boolean;
  message: string;
}

export function openApp(rawCommandText: string): ActionResult {
  const resolved = resolveApp(rawCommandText);

  if (!resolved) {
    return {
      success: false,
      message: `"${rawCommandText}" is not installed. Say "install ${rawCommandText}" to search it on the Play Store.`,
    };
  }

  const launched = AndroidLauncher.openApp(resolved.packageName);
  return launched
    ? { success: true, message: `Opening ${resolved.displayName}.` }
    : { success: false, message: `Could not open ${resolved.displayName}.` };
}

export function searchOnPlayStore(query: string): ActionResult {
  AndroidLauncher.openPlayStoreSearch(query);
  return {
    success: true,
    message: `Opening Play Store to search for "${query}". Please tap Install to add it.`,
  };
}

export function goHome(): ActionResult {
  AndroidLauncher.goHome();
  return { success: true, message: "Going home." };
}

export async function openSettings(): Promise<ActionResult> {
  try {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.SETTINGS,
    );
    return { success: true, message: "Opening settings." };
  } catch {
    return { success: false, message: "Could not open settings." };
  }
}

export async function openWifiSettings(): Promise<ActionResult> {
  try {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.WIFI_SETTINGS,
    );
    return { success: true, message: "Opening Wi-Fi settings." };
  } catch {
    return { success: false, message: "Could not open Wi-Fi settings." };
  }
}

export async function openBluetoothSettings(): Promise<ActionResult> {
  try {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.BLUETOOTH_SETTINGS,
    );
    return { success: true, message: "Opening Bluetooth settings." };
  } catch {
    return { success: false, message: "Could not open Bluetooth settings." };
  }
}
