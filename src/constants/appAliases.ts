export interface AppEntry {
  packageNames: string[]; // try in order, first installed one wins
  displayName: string;
  aliases: string[];
}

export const APP_REGISTRY: AppEntry[] = [
  {
    packageNames: ["com.whatsapp", "com.whatsapp.w4b"],
    displayName: "WhatsApp",
    aliases: ["whatsapp", "واٹس ایپ", "واٹساپ", "whats app", "wtsp"],
  },
  {
    packageNames: ["com.google.android.youtube"],
    displayName: "YouTube",
    aliases: ["youtube", "یوٹیوب", "you tube"],
  },
  {
    packageNames: ["com.android.chrome"],
    displayName: "Chrome",
    aliases: ["chrome", "کروم", "browser", "براؤزر"],
  },
  {
    packageNames: ["com.google.android.gm"],
    displayName: "Gmail",
    aliases: ["gmail", "جی میل", "mail", "email", "ای میل"],
  },
  {
    packageNames: ["com.google.android.apps.maps"],
    displayName: "Google Maps",
    aliases: ["maps", "google maps", "نقشہ", "map"],
  },
  {
    packageNames: ["com.facebook.katana"],
    displayName: "Facebook",
    aliases: ["facebook", "فیس بک", "fb"],
  },
  {
    packageNames: ["com.instagram.android"],
    displayName: "Instagram",
    aliases: ["instagram", "انسٹاگرام", "insta"],
  },
  {
    packageNames: ["com.android.dialer", "com.google.android.dialer"],
    displayName: "Phone / Dialer",
    aliases: ["dialer", "phone app", "ڈائلر", "call app", "کال ایپ"],
  },
  {
    packageNames: ["com.android.contacts", "com.google.android.contacts"],
    displayName: "Contacts",
    aliases: ["contacts", "رابطے", "kaanta", "contact list"],
  },
  {
    packageNames: [
      "com.android.camera2",
      "com.google.android.GoogleCamera",
      "com.oppo.camera",
      "com.sec.android.app.camera",
    ],
    displayName: "Camera",
    aliases: ["camera", "کیمرہ", "kaimra"],
  },
  {
    packageNames: ["com.android.settings"],
    displayName: "Settings",
    aliases: ["settings", "سیٹنگز", "setting"],
  },
];

const NOISE_WORDS = [
  "open",
  "launch",
  "start",
  "kholo",
  "khol",
  "chalao",
  "chalaao",
  "karo",
  "kro",
  "please",
  "plz",
  "کھولو",
  "کھول",
  "چلاؤ",
  "کرو",
];

export function normalizeText(text: string): string {
  let normalized = text.toLowerCase().trim();
  normalized = normalized.replace(/[.,!?؟۔]/g, "");
  for (const word of NOISE_WORDS) {
    normalized = normalized.replace(new RegExp(`\\b${word}\\b`, "gi"), "");
  }
  return normalized.replace(/\s+/g, " ").trim();
}
