import * as Speech from "expo-speech";
import { Language } from "../../types/commands";

let speechEnabled = true; // Phase 19 settings screen will control this

export function setSpeechEnabled(enabled: boolean) {
  speechEnabled = enabled;
  if (!enabled) {
    Speech.stop();
  }
}

export function isSpeechEnabled() {
  return speechEnabled;
}

function localeForTTS(lang: Language): string {
  switch (lang) {
    case "ur":
      return "ur-PK";
    case "roman-ur":
      // No dedicated "Roman Urdu" voice exists on Android; en-US pronounces
      // romanized text phonetically close enough for short phrases.
      return "en-US";
    case "en":
      return "en-US";
    default:
      return "en-US";
  }
}

export function speak(text: string, language: Language = "en") {
  if (!speechEnabled || !text.trim()) return;

  Speech.stop(); // cancel any in-progress speech before starting new
  Speech.speak(text, {
    language: localeForTTS(language),
    pitch: 1.0,
    rate: 0.95,
  });
}

export function stopSpeaking() {
  Speech.stop();
}
