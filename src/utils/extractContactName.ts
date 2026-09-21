// Very simple extraction for testing. Handles patterns like:
// "call Ali", "Ali ko call karo", "Ahmed ko call karein"
// Phase 10's AI-backed parser will replace this with real entity extraction.
export function extractContactName(text: string): string | null {
  const lower = text.toLowerCase().trim();

  // "call X" or "call to X"
  let match = lower.match(/^call\s+(?:to\s+)?(.+)$/);
  if (match) return match[1].trim();

  // "X ko call karo" / "X ko call karein"
  match = lower.match(/^(.+?)\s+ko\s+call/);
  if (match) return match[1].trim();

  return null;
}
