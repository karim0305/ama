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
      message: `I don't know an app matching "${rawCommandText}" yet.`,
    };
  }

  const { entry } = resolved;

  // Try each known package name for this app, use the first one installed
  const availablePackage = entry.packageNames.find((pkg) =>
    AndroidLauncher.isAppInstalled(pkg),
  );

  if (!availablePackage) {
    return {
      success: false,
      message: `${entry.displayName} is not installed on this device.`,
    };
  }

  const launched = AndroidLauncher.openApp(availablePackage);
  return launched
    ? { success: true, message: `Opening ${entry.displayName}.` }
    : { success: false, message: `Could not open ${entry.displayName}.` };
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
