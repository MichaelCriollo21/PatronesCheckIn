import { create } from "zustand";
import { Logger, LogEntry, LogListener } from "../application/Logger/Logger";

interface LogState {
  logs: LogEntry[];
}

export const useLogger = create<LogState>((set) => {
  const logger = Logger.getInstance();

  const listener: LogListener = {
    onLog(entry: LogEntry) {set((state) => ({ logs: [...state.logs, entry] }))},
    getIdentifier() {
      return "default-listener";
    },
  };

  return {
    logs: logger.addListener(listener),
  };
});
