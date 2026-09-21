import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export default function TextCommandModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const [value, setValue] = useState("");
  const scheme = useColorScheme();
  const dark = scheme === "dark";

  const handleExecute = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.card, dark && styles.cardDark]}>
          <Text style={[styles.label, dark && styles.labelDark]}>
            Type your instruction...
          </Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="e.g. WhatsApp kholo"
            placeholderTextColor={dark ? "#888" : "#aaa"}
            style={[styles.input, dark && styles.inputDark]}
            autoFocus
            multiline
            onSubmitEditing={handleExecute}
            returnKeyType="send"
          />
          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleExecute}
              style={[
                styles.executeBtn,
                !value.trim() && styles.executeBtnDisabled,
              ]}
              disabled={!value.trim()}
            >
              <Text style={styles.executeText}>Execute</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  cardDark: { backgroundColor: "#1E1B24" },
  label: { fontSize: 13, color: "#888", marginBottom: 10 },
  labelDark: { color: "#aaa" },
  input: {
    minHeight: 60,
    maxHeight: 140,
    fontSize: 16,
    color: "#111",
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
  },
  inputDark: {
    color: "#eee",
    borderColor: "#3a3640",
    backgroundColor: "#26222c",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 12,
  },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelText: { color: "#888", fontSize: 15 },
  executeBtn: {
    backgroundColor: "#4C3AE3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  executeBtnDisabled: { backgroundColor: "#b5aef0" },
  executeText: { color: "white", fontSize: 15, fontWeight: "600" },
});
