import { Flight } from "./Flight";

export interface RouteConfig {
  from: string;
  to: string;
}

export class FlightFactory {
  static createFromFlightWithRoute(flight: Flight, routeConfig: RouteConfig): Flight {
    const from = routeConfig.from.trim();
    const to = routeConfig.to.trim();

    if (!from || !to) {
      throw new Error("La configuracion de ruta requiere 'from' y 'to'");
    }

    if (from === to) {
      throw new Error("La ruta no puede tener el mismo origen y destino");
    }

    const rebuiltFlight = new Flight(
      flight.getId(),
      flight.getNumber(),
      `${from} -> ${to}`,
      flight.getCapacity(),
      flight.getDepartureDate(),
      flight.getDelayMinutes()
    );

    const boardedCount = flight.getBoardedPassengers();
    for (let i = 0; i < boardedCount; i++) {
      rebuiltFlight.boardPassenger();
    }

    return rebuiltFlight;
  }
}
