import * as Contacts from "expo-contacts/legacy";

export interface MatchedContact {
  id: string;
  name: string;
  phoneNumber: string;
}

export async function requestContactsPermission(): Promise<boolean> {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === "granted";
}

/**
 * Finds contacts matching a name fragment. Returns all matches so the
 * caller can decide: 0 = not found, 1 = proceed, 2+ = ask "Which X?"
 */
export async function findContactsByName(
  nameFragment: string,
): Promise<MatchedContact[]> {
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  const query = nameFragment.trim().toLowerCase();
  if (!query) return [];

  const matches: MatchedContact[] = [];

  for (const contact of data) {
    const contactName = (contact.name ?? "").toLowerCase();
    if (!contactName.includes(query)) continue;

    const firstNumber = contact.phoneNumbers?.[0]?.number;
    if (!firstNumber) continue; // skip contacts with no phone number

    matches.push({
      id: contact.id ?? contactName,
      name: contact.name ?? "Unknown",
      phoneNumber: firstNumber,
    });
  }

  return matches;
}
