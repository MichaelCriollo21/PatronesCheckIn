// ============================================================
// PATRÓN: CHAIN OF RESPONSIBILITY
// Cada validador decide si continúa con el siguiente o detiene
// la cadena. Se usa antes de ejecutar el check-in real.
// ============================================================

import logger from "./Logger";

class CheckInHandler {
  setNext(handler) {
    this.next = handler;
    return handler;
  }

  handle(request) {
    return this.next ? this.next.handle(request) : { ok: true, message: "[CHAIN] Check-in aprobado." };
  }
}

class AlreadyCheckedInHandler extends CheckInHandler {
  handle(request) {
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
  handle(request) {
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

class FinalCheckInHandler extends CheckInHandler {
  handle(request) {
    return {
      ok: true,
      message: `[CHAIN] ${request.passenger.name} cumple con todas las validaciones de check-in.`,
    };
  }
}

class CheckInChain {
  constructor() {
    const already = new AlreadyCheckedInHandler();
    const delayRule = new DelayPriorityHandler();
    const finalStep = new FinalCheckInHandler();

    already.setNext(delayRule).setNext(finalStep);
    this.first = already;
  }

  validate(passenger, flightStatus) {
    const result = this.first.handle({ passenger, flightStatus });
    logger.log(result.message);
    return result;
  }
}

const checkInChain = new CheckInChain();
export default checkInChain;
