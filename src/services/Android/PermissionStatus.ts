import * as Contacts from "expo-contacts/legacy";
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";
import { isAccessibilityEnabled } from "./AccessibilityActions";

export interface PermissionStatuses {
  microphone: boolean;
  contacts: boolean;
  accessibility: boolean;
}

export async function checkAllPermissions(): Promise<PermissionStatuses> {
  const micStatus = await ExpoSpeechRecognitionModule.getPermissionsAsync();
  const contactsStatus = await Contacts.getPermissionsAsync();

  return {
    microphone: micStatus.granted,
    contacts: contactsStatus.status === "granted",
    accessibility: isAccessibilityEnabled(),
  };
}
