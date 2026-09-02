export type LogTone = "info" | "success" | "warning" | "danger";

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  message: string;
  tone: LogTone;
}

const MAX_LOG_ENTRIES = 60;

export function appendLog(log: TerminalLogEntry[], message: string, tone: LogTone = "info"): TerminalLogEntry[] {
  const entry: TerminalLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    message,
    tone,
  };
  return [...log, entry].slice(-MAX_LOG_ENTRIES);
}

export function formatLogTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour12: false });
}
