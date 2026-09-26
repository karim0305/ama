import AndroidLauncher from "../../../modules/android-launcher";
import { APP_REGISTRY, normalizeText } from "../../constants/appAliases";

export interface ResolvedApp {
  packageName: string;
  displayName: string;
  confidence: "exact" | "partial" | "dynamic";
}

export function resolveApp(rawText: string): ResolvedApp | null {
  const normalized = normalizeText(rawText);
  if (!normalized) return null;

  // Pass 1: exact match against curated registry
  for (const entry of APP_REGISTRY) {
    for (const alias of entry.aliases) {
      if (normalized === alias.toLowerCase()) {
        const pkg = entry.packageNames.find((p) =>
          AndroidLauncher.isAppInstalled(p),
        );
        if (pkg)
          return {
            packageName: pkg,
            displayName: entry.displayName,
            confidence: "exact",
          };
      }
    }
  }

  // Pass 2: partial/substring match against curated registry
  for (const entry of APP_REGISTRY) {
    for (const alias of entry.aliases) {
      const aliasLower = alias.toLowerCase();
      if (normalized.includes(aliasLower) || aliasLower.includes(normalized)) {
        const pkg = entry.packageNames.find((p) =>
          AndroidLauncher.isAppInstalled(p),
        );
        if (pkg)
          return {
            packageName: pkg,
            displayName: entry.displayName,
            confidence: "partial",
          };
      }
    }
  }

  // Pass 3: search ALL installed apps by label (dynamic fallback)
  const allApps = AndroidLauncher.getInstalledApps();
  const match = allApps.find((app) => {
    const appNameNormalized = app.appName.toLowerCase();
    return (
      appNameNormalized === normalized ||
      appNameNormalized.includes(normalized) ||
      normalized.includes(appNameNormalized)
    );
  });

  if (match) {
    return {
      packageName: match.packageName,
      displayName: match.appName,
      confidence: "dynamic",
    };
  }

  return null;
}

export function listKnownApps(): string[] {
  return APP_REGISTRY.map((e) => e.displayName);
}
