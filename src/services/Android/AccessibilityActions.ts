import AndroidLauncher from "../../../modules/android-launcher";
import { ActionResult } from "./AndroidActions";

export function isAccessibilityEnabled(): boolean {
  return AndroidLauncher.isAccessibilityServiceEnabled();
}

export function openAccessibilitySettings(): void {
  AndroidLauncher.openAccessibilitySettings();
}

export function goBack(): ActionResult {
  if (!isAccessibilityEnabled()) {
    return {
      success: false,
      message:
        'Please enable the Accessibility Service in Settings first to use "Go Back".',
    };
  }
  const done = AndroidLauncher.goBack();
  return done
    ? { success: true, message: "Going back." }
    : { success: false, message: "Could not go back." };
}

export function openRecents(): ActionResult {
  if (!isAccessibilityEnabled()) {
    return {
      success: false,
      message:
        'Please enable the Accessibility Service in Settings first to use "Recent Apps".',
    };
  }
  const done = AndroidLauncher.openRecents();
  return done
    ? { success: true, message: "Opening recent apps." }
    : { success: false, message: "Could not open recent apps." };
}
