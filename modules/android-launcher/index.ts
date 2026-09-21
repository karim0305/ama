import { requireNativeModule } from "expo-modules-core";

interface AndroidLauncherModule {
  openApp(packageName: string): boolean;
  isAppInstalled(packageName: string): boolean;
  goHome(): boolean;
  isAccessibilityServiceEnabled(): boolean;
  openAccessibilitySettings(): boolean;
  goBack(): boolean;
  openRecents(): boolean;
}

export default requireNativeModule<AndroidLauncherModule>("AndroidLauncher");
