// ============================================================
// PATRÓN: STRATEGY
// Define una familia de algoritmos (métodos de check-in),
// encapsula cada uno y los hace intercambiables.
// El componente solo llama a .execute() sin saber cuál está activo.
// ============================================================

import logger from "./Logger";

export interface CheckInStrategy {
  label: string;
  icon: string;
  execute: (passenger: string, flightId: string) => string;
}

const CheckInStrategies: Record<string, CheckInStrategy> = {
  online: {
    label: "Online",
    icon: "🌐",
    execute: (passenger: string, flightId: string) => {
      const msg = `[CHECK-IN] ${passenger} hizo check-in online en el vuelo ${flightId}. Asiento asignado automáticamente.`;
      logger.log(msg);
      return msg;
    },
  },
  kiosk: {
    label: "Kiosk",
    icon: "🖥️",
    execute: (passenger: string, flightId: string) => {
      const msg = `[CHECK-IN] ${passenger} usó el kiosk del aeropuerto para el vuelo ${flightId}. Tarjeta de embarque impresa.`;
      logger.log(msg);
      return msg;
    },
  },
  counter: {
    label: "Mostrador",
    icon: "🧑‍✈️",
    execute: (passenger: string, flightId: string) => {
      const msg = `[CHECK-IN] ${passenger} hizo check-in en ventanilla para el vuelo ${flightId} con agente.`;
      logger.log(msg);
      return msg;
    },
  },
};

export default CheckInStrategies;