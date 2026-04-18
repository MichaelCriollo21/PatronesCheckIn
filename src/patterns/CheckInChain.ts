// ============================================================
// PATRÓN: CHAIN OF RESPONSIBILITY
// Cada validador decide si continúa con el siguiente o detiene
// la cadena. Se usa antes de ejecutar el check-in real.
// ============================================================

import logger from "./Logger";
import { Passenger } from "./PassengerFactory";

interface ValidationResult {
  ok: boolean;
  message: string;
}

interface CheckInRequest {
  passenger: Passenger;
  flightStatus: string;
}

abstract class CheckInHandler {
  protected next: CheckInHandler | null = null;

  setNext(handler: CheckInHandler): CheckInHandler {
    this.next = handler;
    return handler;
  }

  handle(request: CheckInRequest): ValidationResult {
    return this.next ? this.next.handle(request) : { ok: true, message: "[CHAIN] Check-in aprobado." };
  }
}

class AlreadyCheckedInHandler extends CheckInHandler {
  handle(request: CheckInRequest): ValidationResult {
    if (request.passenger.checkedIn) {
      return {
        ok: false,
        message: `[CHAIN] ${request.passenger.name} ya tiene check-in registrado.`,
      };
    }
    return super.handle(request);
  }
}

class DelayPriorityHandler extends CheckInHandler {
  handle(request: CheckInRequest): ValidationResult {
    const { passenger, flightStatus } = request;
    if (flightStatus.includes("Retrasado") && passenger.type === "regular") {
      return {
        ok: false,
        message: `[CHAIN] ${passenger.name} no puede hacer check-in ahora: vuelo retrasado y prioridad regular.`,
      };
    }
    return super.handle(request);
  }
}

class CancelledFlightHandler extends CheckInHandler {
  handle(request: CheckInRequest): ValidationResult {
    const { flightStatus } = request;
    if (flightStatus === "Cancelado") {
      return {
        ok: false,
        message: `[CHAIN] No se puede hacer check-in: el vuelo está cancelado.`,
      };
    }
    return super.handle(request);
  }
}

class FinalCheckInHandler extends CheckInHandler {
  handle(request: CheckInRequest): ValidationResult {
    return {
      ok: true,
      message: `[CHAIN] ${request.passenger.name} cumple con todas las validaciones de check-in.`,
    };
  }
}

class CheckInChain {
  private first: CheckInHandler;

  constructor() {
    const already = new AlreadyCheckedInHandler();
    const delayRule = new DelayPriorityHandler();
    const cancelledRule = new CancelledFlightHandler();
    const finalStep = new FinalCheckInHandler();

    already.setNext(delayRule).setNext(cancelledRule).setNext(finalStep);
    this.first = already;
  }

  validate(passenger: Passenger, flightStatus: string, flightId?: string): ValidationResult {
    const result = this.first.handle({ passenger, flightStatus });
    const msg = flightId
      ? `[VALIDACIÓN] Vuelo ${flightId}: ${result.message}`
      : result.message;
    logger.log(msg);
    return result;
  }
}

const checkInChain = new CheckInChain();
export default checkInChain;