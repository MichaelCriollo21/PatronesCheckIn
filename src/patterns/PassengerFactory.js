// ============================================================
// PATRÓN: FACTORY
// Centraliza la creación de objetos Passenger.
// En lugar de crear { name, checkedIn, notification } manualmente
// en varios lugares, toda la lógica de construcción vive aquí.
//
// Ventaja: si el objeto Passenger cambia (nuevos campos, validaciones),
// solo se modifica este archivo.
//
// Tipos soportados: "regular", "vip", "crew"
// ============================================================

import logger from "./Logger";

const PassengerFactory = {
  create(name, type = "regular") {
    const base = {
      name,
      type,
      checkedIn: false,
      notification: null,
      createdAt: new Date().toLocaleTimeString(),
    };

    const configs = {
      regular: {
        label: "Pasajero",
        badge: "🧑",
        priority: 3,
      },
      vip: {
        label: "VIP",
        badge: "⭐",
        priority: 1,
      },
      crew: {
        label: "Tripulación",
        badge: "🧑‍✈️",
        priority: 2,
      },
    };

    const config = configs[type] ?? configs.regular;
    const passenger = { ...base, ...config };

    logger.log(`[FACTORY] Pasajero creado: ${name} (${config.label})`);
    return passenger;
  },
};

export default PassengerFactory;
