import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { getHistory, HistoryEntry } from "../services/Storage/LocalStorage";

export default function HistoryScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === "dark";
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const load = useCallback(() => {
    getHistory().then(setEntries);
  }, []);

  useFocusEffect(load);

  return (
    <View style={[styles.container, dark && styles.containerDark]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={[styles.backText, dark && styles.textDark]}>← Back</Text>
      </Pressable>
      <Text style={[styles.heading, dark && styles.textDark]}>
        Command History
      </Text>

      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, dark && styles.textDark]}>
            No commands yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.entryCard, dark && styles.entryCardDark]}>
            <View style={styles.entryHeader}>
              <Text style={[styles.icon]}>{item.success ? "✓" : "✕"}</Text>
              <Text
                style={[styles.entryText, dark && styles.textDark]}
                numberOfLines={2}
              >
                {item.rawText}
              </Text>
            </View>
            <Text style={styles.entryMessage}>{item.message}</Text>
            <Text style={styles.entryTime}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
      />
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
    marginBottom: 16,
  },
  textDark: { color: "#eee" },
  emptyText: { textAlign: "center", color: "#888", marginTop: 40 },
  entryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  entryCardDark: { backgroundColor: "#1E1B24" },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  icon: { fontSize: 14 },
  entryText: { fontSize: 15, fontWeight: "600", color: "#222", flex: 1 },
  entryMessage: { fontSize: 13, color: "#777", marginBottom: 4 },
  entryTime: { fontSize: 11, color: "#aaa" },
});
