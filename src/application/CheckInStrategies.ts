export interface CheckInStrategy {
  label: string;
  icon: string;
  execute(passenger: string, flightId: string): string;
}

export type CheckInStrategyKey = "online" | "kiosk" | "counter";

const CheckInStrategies: Record<CheckInStrategyKey, CheckInStrategy> = {
  online: {
    label: "Online",
    icon: "🌐",
    execute: (passenger: string, flightId: string) => {
      return `[CHECK-IN] ${passenger} hizo check-in online en el vuelo ${flightId}. Asiento asignado automáticamente.`;
    },
  },
  kiosk: {
    label: "Kiosk",
    icon: "🖥️",
    execute: (passenger: string, flightId: string) => {
      return `[CHECK-IN] ${passenger} usó el kiosk del aeropuerto para el vuelo ${flightId}. Tarjeta de embarque impresa.`;
    },
  },
  counter: {
    label: "Mostrador",
    icon: "🧑‍✈️",
    execute: (passenger: string, flightId: string) => {
      return `[CHECK-IN] ${passenger} hizo check-in en ventanilla para el vuelo ${flightId} con agente.`;
    },
  },
};

export function getCheckInStrategy(strategy: CheckInStrategyKey): CheckInStrategy {
  return CheckInStrategies[strategy];
}

export { CheckInStrategies };