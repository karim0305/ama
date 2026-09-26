import { EventEmitter, requireNativeModule } from "expo-modules-core";

interface AndroidLauncherModule {
  openApp(packageName: string): boolean;
  isAppInstalled(packageName: string): boolean;
  goHome(): boolean;
  isAccessibilityServiceEnabled(): boolean;
  openAccessibilitySettings(): boolean;
  goBack(): boolean;
  openRecents(): boolean;
  hasOverlayPermission(): boolean;
  requestOverlayPermission(): boolean;
  startVoiceOverlay(): boolean;
  stopVoiceOverlay(): boolean;
  getInstalledApps(): { packageName: string; appName: string }[];
  openPlayStoreSearch(query: string): boolean;
}

interface AndroidLauncherEvents {
  onOverlayStopPressed: () => void;
  [eventName: string]: (...args: any[]) => void;
}

const nativeModule =
  requireNativeModule<AndroidLauncherModule>("AndroidLauncher");
export const overlayEmitter = new EventEmitter<AndroidLauncherEvents>(
  nativeModule as any,
);
export default nativeModule;
