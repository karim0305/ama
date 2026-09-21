import { Language } from "../types/commands";

type ResponseKey = "processingCommand" | "notUnderstood" | "micError";

const responses: Record<ResponseKey, Record<Language, string>> = {
  processingCommand: {
    en: "Got it, processing your command.",
    ur: "ٹھیک ہے، آپ کی ہدایت پر عمل ہو رہا ہے۔",
    "roman-ur": "Theek hai, aapki instruction process ho rahi hai.",
    auto: "Got it, processing your command.",
  },
  notUnderstood: {
    en: "Sorry, I didn't understand that.",
    ur: "معذرت، مجھے آپ کی بات سمجھ نہیں آئی۔",
    "roman-ur": "Sorry, mujhe aapki instruction samajh nahi ayi.",
    auto: "Sorry, I didn't understand that.",
  },
  micError: {
    en: "Microphone error occurred.",
    ur: "مائیکروفون میں خرابی ہوئی۔",
    "roman-ur": "Microphone mein masla hua.",
    auto: "Microphone error occurred.",
  },
};

export function getResponse(
  key: ResponseKey,
  language: Language = "en",
): string {
  return responses[key][language] ?? responses[key].en;
}
