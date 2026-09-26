import AndroidLauncher from "../../../modules/android-launcher";

export function hasOverlayPermission(): boolean {
  return AndroidLauncher.hasOverlayPermission();
}

export function requestOverlayPermission(): void {
  AndroidLauncher.requestOverlayPermission();
}
