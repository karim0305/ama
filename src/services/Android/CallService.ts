import { Linking } from "react-native";

export async function initiateCall(phoneNumber: string): Promise<boolean> {
  const url = `tel:${phoneNumber}`;
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) return false;

  await Linking.openURL(url);
  return true;
}
