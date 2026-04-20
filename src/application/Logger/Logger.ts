export interface LogEntry {
  time: string;
  msg: string;
}

export interface LogListener {
  onLog(entry: LogEntry): void;
  getIdentifier(): string;
}

export class Logger {
  private static instance: Logger
  private listeners: Map<string, LogListener> = new Map();
  private logHistory: LogEntry[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(msg: string): LogEntry {
    const entry: LogEntry = { time: new Date().toLocaleTimeString(), msg };
    this.listeners.forEach(listener => listener.onLog(entry));
    this.logHistory.push(entry);
    return entry;
  }

  addListener(listener: LogListener): LogEntry[] {
    this.listeners.set(listener.getIdentifier(), listener);
    return this.logHistory;
  }

  removeListener(listener: LogListener): void {
    this.listeners.delete(listener.getIdentifier());
  }

  getLogs(): LogEntry[] {
    return this.logHistory;
  }
}