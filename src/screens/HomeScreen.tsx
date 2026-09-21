import { StyleSheet, Text, useColorScheme, View } from "react-native";
import FloatingButton from "../components/FloatingAssistant/FloatingButton";
import { useAssistantState } from "../hooks/useAssistantState";

export default function HomeScreen() {
  const scheme = useColorScheme();
  const { state, setState, statusText, setStatusText, reset } =
    useAssistantState();

  const handleMic = () => {
    // Phase 3 will wire real speech-to-text here
    setState("LISTENING");
    setStatusText("(voice input comes in Phase 3)");
  };

  const handleText = () => {
    // Phase 4 will open the text input modal here
    setStatusText("(text input comes in Phase 4)");
  };

  const handleLanguage = () =>
    setStatusText("(language selector comes in Phase 4/19)");
  const handleSettings = () =>
    setStatusText("(settings screen comes in Phase 19)");

  return (
    <View
      style={[styles.container, scheme === "dark" ? styles.dark : styles.light]}
    >
      <View style={styles.conversationArea}>
        <Text
          style={[styles.statusText, scheme === "dark" && { color: "#ddd" }]}
        >
          {statusText || "Tap the button below to begin"}
        </Text>
      </View>

      <FloatingButton
        state={state}
        onMicPress={handleMic}
        onTextPress={handleText}
        onLanguagePress={handleLanguage}
        onSettingsPress={handleSettings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  light: { backgroundColor: "#F7F7FB" },
  dark: { backgroundColor: "#121016" },
  conversationArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  statusText: { fontSize: 15, color: "#555", textAlign: "center" },
});
