// ============================================================
// PATRÓN: MEDIATOR
// Centraliza toda la comunicación entre módulos del sistema.
// Ningún módulo se llama directamente entre sí — todo pasa
// por el mediador, que decide qué hacer con cada evento.
//
// Sin mediador:  App.jsx → llama a flight, logger, strategies directamente
// Con mediador:  App.jsx → le dice al mediador qué ocurrió
//                Mediador → coordina flight, logger, strategies
//
// Eventos soportados:
//   "CHECK_IN"   → { passengerName, strategy }
//   "DELAY"      → { minutes }
//   "ON_TIME"    → {}
//   "ADD_PASSENGER" → { name, type }
//   "BOARDING"   → {}
//   "CANCEL"     → {}
// ============================================================

import logger from "./Logger";
import CheckInStrategies from "./CheckInStrategies";
import checkInChain from "./CheckInChain";
import { Passenger } from "./PassengerFactory";
import FlightSubject from "./FlightSubject";

interface MediatorCallbacks {
  onPassengersChange?: (flightId: string, updater: (prev: Passenger[]) => Passenger[]) => void;
  onCheckInResult?: (flightId: string, msg: string) => void;
  onStatusChange?: (flightId: string, status: string) => void;
}

class FlightMediator {
  private flights: Record<string, FlightSubject> = {};
  private onPassengersChange?: (flightId: string, updater: (prev: Passenger[]) => Passenger[]) => void;
  private onCheckInResult?: (flightId: string, msg: string) => void;
  private onStatusChange?: (flightId: string, status: string) => void;

  constructor() {}

  registerFlights(flights: { id: string; subject: FlightSubject }[]): void {
    flights.forEach((flight) => {
      this.flights[flight.id] = flight.subject;
    });
  }

  // Registrar callbacks desde el componente React
  register({ onPassengersChange, onCheckInResult, onStatusChange }: MediatorCallbacks): void {
    this.onPassengersChange = onPassengersChange;
    this.onCheckInResult = onCheckInResult;
    this.onStatusChange = onStatusChange;
  }

  // Punto único de entrada para todos los eventos del sistema
  notify(sender: string, event: string, payload: any = {}): void {
    logger.log(`[MEDIATOR] Evento recibido de "${sender}": ${event}`);

    const { flightId } = payload;
    const flight = flightId ? this.flights[flightId] : undefined;

    switch (event) {
      case "CHECK_IN": {
        if (!flightId || !flight) {
          logger.log(`[MEDIATOR] Vuelo no encontrado para CHECK_IN: ${flightId}`);
          break;
        }

        const { passengerName, strategy, passenger, flightStatus } = payload;
        const validation = checkInChain.validate(passenger, flightStatus, flightId);

        if (!validation.ok) {
          this.onCheckInResult?.(flightId, validation.message);
          break;
        }

        const result = CheckInStrategies[strategy].execute(passengerName, flightId);

        this.onPassengersChange?.(flightId, (prev) =>
          prev.map((p) =>
            p.name === passengerName ? { ...p, checkedIn: true } : p
          )
        );
        this.onCheckInResult?.(flightId, result);
        break;
      }

      case "DELAY": {
        if (!flightId || !flight) {
          logger.log(`[MEDIATOR] Vuelo no encontrado para DELAY: ${flightId}`);
          break;
        }

        const { minutes } = payload;
        flight.delay(minutes);
        this.onStatusChange?.(flightId, flight.getStatus());
        break;
      }

      case "ON_TIME": {
        if (!flightId || !flight) {
          logger.log(`[MEDIATOR] Vuelo no encontrado para ON_TIME: ${flightId}`);
          break;
        }

        flight.onTime();
        this.onStatusChange?.(flightId, flight.getStatus());
        break;
      }

      case "ADD_PASSENGER": {
        if (!flightId) {
          logger.log(`[MEDIATOR] flightId requerido para ADD_PASSENGER`);
          break;
        }

        const { passenger } = payload;
        this.onPassengersChange?.(flightId, (prev) => [...prev, passenger]);
        break;
      }

      case "BOARDING": {
        if (!flightId || !flight) {
          logger.log(`[MEDIATOR] Vuelo no encontrado para BOARDING: ${flightId}`);
          break;
        }

        flight.startBoarding();
        this.onStatusChange?.(flightId, flight.getStatus());
        break;
      }

      case "CANCEL": {
        if (!flightId || !flight) {
          logger.log(`[MEDIATOR] Vuelo no encontrado para CANCEL: ${flightId}`);
          break;
        }

        flight.cancel();
        this.onStatusChange?.(flightId, flight.getStatus());
        break;
      }

      case "FLIGHT_STATUS_CHANGE": {
        if (!flightId || !flight) {
          logger.log(`[MEDIATOR] Vuelo no encontrado para FLIGHT_STATUS_CHANGE: ${flightId}`);
          break;
        }

        const { status } = payload;
        if (status === "A tiempo") {
          flight.onTime();
        } else if (status === "Embarcando") {
          flight.startBoarding();
        } else if (status.includes("Retrasado")) {
          // Para retrasos, mantenemos el estado actual si ya está retrasado
          // o podríamos agregar lógica adicional aquí
        } else if (status === "Cancelado") {
          flight.cancel();
        }

        this.onStatusChange?.(flightId, flight.getStatus());
        break;
      }

      default:
        logger.log(`[MEDIATOR] Evento desconocido: ${event}`);
    }
  }
}

export default FlightMediator;