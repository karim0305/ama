import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useAppSettings } from "../hooks/useAppSettings";
import { useLanguagePreference } from "../hooks/useLanguagePreference";
import { openAccessibilitySettings } from "../services/Android/AccessibilityActions";
import {
  checkAllPermissions,
  PermissionStatuses,
} from "../services/Android/PermissionStatus";
import { clearHistory } from "../services/Storage/LocalStorage";
import { Language } from "../types/commands";

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "auto", label: "Auto Detect" },
  { value: "en", label: "English" },
  { value: "ur", label: "Urdu" },
  { value: "roman-ur", label: "Roman Urdu" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === "dark";
  const { language, setLanguage } = useLanguagePreference();
  const { settings, updateSetting } = useAppSettings();
  const [permissions, setPermissions] = useState<PermissionStatuses | null>(
    null,
  );

  const refreshPermissions = useCallback(() => {
    checkAllPermissions().then(setPermissions);
  }, []);

  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  const handleClearHistory = async () => {
    await clearHistory();
  };

  return (
    <ScrollView style={[styles.container, dark && styles.containerDark]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={[styles.backText, dark && styles.textDark]}>← Back</Text>
      </Pressable>

      <Text style={[styles.heading, dark && styles.textDark]}>Settings</Text>

      {/* Language */}
      <Section title="Language" dark={dark}>
        {LANGUAGE_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            style={styles.row}
            onPress={() => setLanguage(opt.value)}
          >
            <Text style={[styles.rowLabel, dark && styles.textDark]}>
              {opt.label}
            </Text>
            <View
              style={[
                styles.radio,
                language === opt.value && styles.radioSelected,
              ]}
            />
          </Pressable>
        ))}
      </Section>

      {/* Toggles */}
      <Section title="Behavior" dark={dark}>
        <ToggleRow
          label="Voice Response"
          value={settings.voiceResponseEnabled}
          onChange={(v) => updateSetting("voiceResponseEnabled", v)}
          dark={dark}
        />
        <ToggleRow
          label="Confirm Before Calling"
          value={settings.confirmCalls}
          onChange={(v) => updateSetting("confirmCalls", v)}
          dark={dark}
        />
        <ToggleRow
          label="Command History"
          value={settings.historyEnabled}
          onChange={(v) => updateSetting("historyEnabled", v)}
          dark={dark}
        />
      </Section>

      {/* Permissions */}
      <Section title="Permissions" dark={dark}>
        <PermissionRow
          label="Microphone"
          granted={permissions?.microphone ?? false}
          dark={dark}
        />
        <PermissionRow
          label="Contacts"
          granted={permissions?.contacts ?? false}
          dark={dark}
        />
        <PermissionRow
          label="Accessibility Service"
          granted={permissions?.accessibility ?? false}
          dark={dark}
          actionLabel={!permissions?.accessibility ? "Enable" : undefined}
          onAction={openAccessibilitySettings}
        />
        <Pressable onPress={refreshPermissions} style={styles.refreshBtn}>
          <Text style={styles.refreshText}>Refresh status</Text>
        </Pressable>
      </Section>

      {/* Data */}
      <Section title="Data" dark={dark}>
        <Pressable onPress={handleClearHistory} style={styles.dangerRow}>
          <Text style={styles.dangerText}>Clear Command History</Text>
        </Pressable>
      </Section>

      {/* About */}
      <Section title="About" dark={dark}>
        <Text style={[styles.aboutText, dark && styles.textDark]}>
          AMA Assistant v1.0.0{"\n"}A hands-free Android voice assistant.
        </Text>
      </Section>
    </ScrollView>
  );
}

function Section({
  title,
  dark,
  children,
}: {
  title: string;
  dark: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, dark && styles.sectionTitleDark]}>
        {title}
      </Text>
      <View style={[styles.sectionCard, dark && styles.sectionCardDark]}>
        {children}
      </View>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
  dark,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  dark: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, dark && styles.textDark]}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function PermissionRow({
  label,
  granted,
  dark,
  actionLabel,
  onAction,
}: {
  label: string;
  granted: boolean;
  dark: boolean;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, dark && styles.textDark]}>{label}</Text>
      <View style={styles.permissionStatus}>
        <View
          style={[
            styles.dot,
            { backgroundColor: granted ? "#3FB27F" : "#E4574C" },
          ]}
        />
        <Text style={[styles.permissionText, dark && styles.textDark]}>
          {granted ? "Granted" : "Not granted"}
        </Text>
        {actionLabel && onAction && (
          <Pressable onPress={onAction} style={styles.actionBtn}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7FB", paddingHorizontal: 20 },
  containerDark: { backgroundColor: "#121016" },
  backBtn: { paddingTop: 16, paddingBottom: 8 },
  backText: { fontSize: 15, color: "#4C3AE3", fontWeight: "600" },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  textDark: { color: "#eee" },
  section: { marginBottom: 22 },
  sectionTitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 8,
    fontWeight: "600",
  },
  sectionTitleDark: { color: "#999" },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  sectionCardDark: { backgroundColor: "#1E1B24" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  rowLabel: { fontSize: 15, color: "#222" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  radioSelected: { borderColor: "#4C3AE3", backgroundColor: "#4C3AE3" },
  permissionStatus: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  permissionText: { fontSize: 13, color: "#666" },
  actionBtn: {
    backgroundColor: "#4C3AE3",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 6,
  },
  actionText: { color: "white", fontSize: 12, fontWeight: "600" },
  refreshBtn: { paddingVertical: 12, alignItems: "center" },
  refreshText: { color: "#4C3AE3", fontSize: 14 },
  dangerRow: { paddingVertical: 14, alignItems: "center" },
  dangerText: { color: "#E4574C", fontSize: 15, fontWeight: "600" },
  aboutText: {
    fontSize: 13,
    color: "#666",
    paddingVertical: 14,
    lineHeight: 20,
  },
});
