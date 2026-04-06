// ============================================================
// PATRÓN: SINGLETON
// Garantiza que solo exista UNA instancia del logger en toda la app.
// No importa cuántas veces se importe, siempre es el mismo objeto.
// ============================================================

class Logger {
  constructor() {
    if (Logger.instance) return Logger.instance;
    this.logs = [];
    Logger.instance = this;
  }

  log(msg) {
    const entry = { time: new Date().toLocaleTimeString(), msg };
    this.logs.push(entry);
    return entry;
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}

const logger = new Logger();
export default logger;
