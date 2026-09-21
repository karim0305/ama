import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("ama_assistant.db");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS command_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        raw_text TEXT NOT NULL,
        intent TEXT NOT NULL,
        success INTEGER NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  }
  return db;
}

export interface HistoryEntry {
  id: number;
  rawText: string;
  intent: string;
  success: boolean;
  message: string;
  createdAt: string;
}

export async function addHistoryEntry(entry: {
  rawText: string;
  intent: string;
  success: boolean;
  message: string;
}): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    "INSERT INTO command_history (raw_text, intent, success, message, created_at) VALUES (?, ?, ?, ?, ?)",
    entry.rawText,
    entry.intent,
    entry.success ? 1 : 0,
    entry.message,
    new Date().toISOString(),
  );
}

export async function getHistory(limit = 50): Promise<HistoryEntry[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<any>(
    "SELECT * FROM command_history ORDER BY id DESC LIMIT ?",
    limit,
  );
  return rows.map((r) => ({
    id: r.id,
    rawText: r.raw_text,
    intent: r.intent,
    success: !!r.success,
    message: r.message,
    createdAt: r.created_at,
  }));
}

export async function clearHistory(): Promise<void> {
  const database = await getDb();
  await database.runAsync("DELETE FROM command_history");
}

export async function getSetting(key: string): Promise<string | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = ?",
    key,
  );
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    key,
    value,
  );
}
