import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { MatchedContact } from "../../services/Android/ContactResolver";

interface Props {
  visible: boolean;
  contacts: MatchedContact[];
  onSelect: (contact: MatchedContact) => void;
  onCancel: () => void;
}

export default function DisambiguationModal({
  visible,
  contacts,
  onSelect,
  onCancel,
}: Props) {
  const scheme = useColorScheme();
  const dark = scheme === "dark";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, dark && styles.cardDark]}>
          <Text style={[styles.title, dark && styles.titleDark]}>
            Which one?
          </Text>
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 260 }}
            renderItem={({ item }) => (
              <Pressable
                style={styles.contactRow}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[styles.contactName, dark && styles.contactNameDark]}
                >
                  {item.name}
                </Text>
                <Text style={styles.contactNumber}>{item.phoneNumber}</Text>
              </Pressable>
            )}
          />
          <Pressable onPress={onCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 20,
  },
  cardDark: { backgroundColor: "#1E1B24" },
  title: { fontSize: 16, fontWeight: "600", color: "#222", marginBottom: 12 },
  titleDark: { color: "#eee" },
  contactRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contactName: { fontSize: 15, color: "#222", fontWeight: "500" },
  contactNameDark: { color: "#eee" },
  contactNumber: { fontSize: 13, color: "#888", marginTop: 2 },
  cancelBtn: { marginTop: 14, alignSelf: "center" },
  cancelText: { color: "#888", fontSize: 14 },
});
