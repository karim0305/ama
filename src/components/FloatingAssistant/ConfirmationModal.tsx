import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  visible,
  message,
  onConfirm,
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
          <Text style={[styles.message, dark && styles.messageDark]}>
            {message}
          </Text>
          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={styles.confirmBtn}>
              <Text style={styles.confirmText}>Call</Text>
            </Pressable>
          </View>
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
    padding: 22,
  },
  cardDark: { backgroundColor: "#1E1B24" },
  message: {
    fontSize: 16,
    color: "#222",
    marginBottom: 20,
    textAlign: "center",
  },
  messageDark: { color: "#eee" },
  actions: { flexDirection: "row", justifyContent: "center", gap: 14 },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  cancelText: { color: "#555", fontSize: 15, fontWeight: "600" },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: "#3FB27F",
  },
  confirmText: { color: "white", fontSize: 15, fontWeight: "600" },
});
