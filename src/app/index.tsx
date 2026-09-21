import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, useColorScheme, View } from "react-native";
import ConfirmationModal from "../components/FloatingAssistant/ConfirmationModal";
import DisambiguationModal from "../components/FloatingAssistant/DisambiguationModal";
import FloatingButton from "../components/FloatingAssistant/FloatingButton";
import TextCommandModal from "../components/FloatingAssistant/TextCommandModal";
import { useAppSettings } from "../hooks/useAppSettings";
import { useAssistantState } from "../hooks/useAssistantState";
import { initiateCall } from "../services/Android/CallService";
import {
  findContactsByName,
  MatchedContact,
  requestContactsPermission,
} from "../services/Android/ContactResolver";
import { parseCommand } from "../services/AssistantEngine/AssistantEngine";
import { executeCommand } from "../services/Commands/CommandExecutor";
import {
  localeForLanguage,
  requestMicPermission,
  startListening,
  useSpeechRecognitionEvent,
} from "../services/Speech/SpeechService";
import { addHistoryEntry } from "../services/Storage/LocalStorage";
import { syncHistoryEntry } from "../services/Supabase/SyncService";
import { speak } from "../services/TTS/TTSService";

export default function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const { state, setState, statusText, setStatusText } = useAssistantState();
  const { settings } = useAppSettings();
  const [textModalVisible, setTextModalVisible] = useState(false);

  const [pendingCall, setPendingCall] = useState<MatchedContact | null>(null);
  const [disambiguationList, setDisambiguationList] = useState<
    MatchedContact[] | null
  >(null);

  const handleMic = useCallback(async () => {
    const granted = await requestMicPermission();
    if (!granted) {
      Alert.alert(
        "Microphone permission required",
        "Please enable microphone access.",
      );
      return;
    }
    setState("LISTENING");
    setStatusText("Listening...");
    startListening(localeForLanguage("auto"));
  }, []);

  const handleText = () => setTextModalVisible(true);

  /**
   * Actually places the call — used both when the user taps "Call" on
   * the confirmation modal, and directly when "Confirm Before Calling"
   * is turned off in Settings.
   */
  const placeCall = async (contact: MatchedContact) => {
    setPendingCall(null);
    setState("EXECUTING");

    const opened = await initiateCall(contact.phoneNumber);
    const msg = opened
      ? `Calling ${contact.name}.`
      : "Could not open the dialer.";
    setState(opened ? "SUCCESS" : "ERROR");
    setStatusText(msg);
    speak(msg, "en");
    setTimeout(() => setState("IDLE"), 1200);
  };

  const confirmAndCall = async () => {
    if (!pendingCall) return;
    await placeCall(pendingCall);
  };

  const handleContactLookup = async (contactNameQuery: string) => {
    const granted = await requestContactsPermission();
    if (!granted) {
      setState("ERROR");
      const msg = "Contacts permission is required to place calls.";
      setStatusText(msg);
      speak(msg, "en");
      return;
    }

    const matches = await findContactsByName(contactNameQuery);

    if (matches.length === 0) {
      setState("ERROR");
      const msg = `No contact found matching "${contactNameQuery}".`;
      setStatusText(msg);
      speak(msg, "en");
    } else if (matches.length === 1) {
      if (settings.confirmCalls) {
        setPendingCall(matches[0]);
        setState("IDLE");
      } else {
        await placeCall(matches[0]);
      }
    } else {
      setDisambiguationList(matches);
      const msg = `Which ${contactNameQuery}?`;
      setStatusText(msg);
      speak(msg, "en");
    }
  };

  /**
   * Single entry point for BOTH voice and text commands.
   * Everything funnels through AssistantEngine.parseCommand →
   * CommandExecutor, and every result is logged locally and
   * synced to Supabase (if configured).
   */
  const handleCommand = async (rawText: string) => {
    setState("PROCESSING");

    const command = parseCommand({ text: rawText, language: "auto" });
    const result = await executeCommand(command);

    if (result.needsContactLookup) {
      await handleContactLookup(result.needsContactLookup);
      return;
    }

    setState(result.success ? "SUCCESS" : "ERROR");
    setStatusText(result.message);
    speak(result.message, command.detectedLanguage === "ur" ? "ur" : "en");

    if (settings.historyEnabled) {
      const historyEntry = {
        rawText,
        intent: command.intent,
        success: result.success,
        message: result.message,
      };
      await addHistoryEntry(historyEntry);
      syncHistoryEntry({
        ...historyEntry,
        id: 0,
        createdAt: new Date().toISOString(),
      });
    }

    setTimeout(() => setState("IDLE"), 1200);
  };

  // Speech recognition event listeners — placed after handleCommand
  // is defined, since the result handler calls it directly once a
  // final transcript arrives.
  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript ?? "";
    setStatusText(transcript);

    if (event.isFinal && transcript.trim()) {
      handleCommand(transcript);
    }
  });

  useSpeechRecognitionEvent("end", () => {
    setState((prev) => (prev === "LISTENING" ? "IDLE" : prev));
  });

  useSpeechRecognitionEvent("error", () => {
    setState("ERROR");
    setStatusText("Microphone error occurred.");
    speak("Microphone error occurred.", "en");
  });

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
        onLanguagePress={() => router.push("/history")}
        onSettingsPress={() => router.push("/settings")}
      />

      <TextCommandModal
        visible={textModalVisible}
        onClose={() => setTextModalVisible(false)}
        onSubmit={handleCommand}
      />

      <ConfirmationModal
        visible={!!pendingCall}
        message={`Call ${pendingCall?.name}?`}
        onConfirm={confirmAndCall}
        onCancel={() => setPendingCall(null)}
      />

      <DisambiguationModal
        visible={!!disambiguationList}
        contacts={disambiguationList ?? []}
        onSelect={(contact) => {
          setDisambiguationList(null);
          setPendingCall(contact);
        }}
        onCancel={() => setDisambiguationList(null)}
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
