import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Language } from "../../types/commands";

export function localeForLanguage(lang: Language): string {
  switch (lang) {
    case "ur":
      return "ur-PK";
    case "roman-ur":
      // Android has no "Roman Urdu" locale; en-US/en-IN picks up
      // romanized speech reasonably since it's phonetic English script.
      return "en-US";
    case "en":
      return "en-US";
    default:
      // auto: start with English locale; language DETECTION on the
      // resulting text happens in AssistantEngine (Phase 10), not here.
      return "en-US";
  }
}

export async function requestMicPermission(): Promise<boolean> {
  const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  return result.granted;
}

export function startListening(locale: string) {
  ExpoSpeechRecognitionModule.start({
    lang: locale,
    interimResults: true,
    continuous: false,
    requiresOnDeviceRecognition: false,
  });
}

export function stopListening() {
  ExpoSpeechRecognitionModule.stop();
}

export { useSpeechRecognitionEvent };

