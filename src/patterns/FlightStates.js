// ============================================================
// PATRÓN: STATE
// Modela el estado del vuelo como objetos separados.
// Cada estado sabe cómo manejar los eventos delay/onTime
// y cómo cambiar el estado del vuelo.
// ============================================================

import logger from "./Logger";

class FlightState {
  constructor(label) {
    this.label = label;
  }

  delay(flight, minutes) {
    throw new Error("Method 'delay' must be implemented.");
  }

  onTime(flight) {
    throw new Error("Method 'onTime' must be implemented.");
  }

  startBoarding(flight) {
    throw new Error("Method 'startBoarding' must be implemented.");
  }

  cancel(flight) {
    throw new Error("Method 'cancel' must be implemented.");
  }

  getStatus() {
    return this.label;
  }
}

class OnTimeState extends FlightState {
  constructor() {
    super("A tiempo");
  }

  delay(flight, minutes) {
    flight.setState(new DelayedState(minutes));
    const event = { type: "DELAY", minutes, status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }

  onTime(flight) {
    logger.log(`[VUELO ${flight.flightNumber}] El vuelo ya estaba a tiempo.`);
  }

  startBoarding(flight) {
    flight.setState(new BoardingState());
    const event = { type: "BOARDING", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }

  cancel(flight) {
    flight.setState(new CancelledState());
    const event = { type: "CANCELLED", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }
}

class DelayedState extends FlightState {
  constructor(minutes) {
    super(`Retrasado ${minutes} min`);
    this.minutes = minutes;
  }

  delay(flight, minutes) {
    flight.setState(new DelayedState(minutes));
    const event = { type: "DELAY", minutes, status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Nuevo estado: ${flight.getStatus()}`);
    flight.notify(event);
  }

  onTime(flight) {
    flight.setState(new OnTimeState());
    const event = { type: "ON_TIME", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Vuelo normalizado.`);
    flight.notify(event);
  }

  startBoarding(flight) {
    flight.setState(new BoardingState());
    const event = { type: "BOARDING", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }

  cancel(flight) {
    flight.setState(new CancelledState());
    const event = { type: "CANCELLED", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }
}

class BoardingState extends FlightState {
  constructor() {
    super("Embarcando");
  }

  delay(flight, minutes) {
    flight.setState(new DelayedState(minutes));
    const event = { type: "DELAY", minutes, status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }

  onTime(flight) {
    flight.setState(new OnTimeState());
    const event = { type: "ON_TIME", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Vuelo normalizado.`);
    flight.notify(event);
  }

  startBoarding(flight) {
    logger.log(`[VUELO ${flight.flightNumber}] El vuelo ya está embarcando.`);
  }

  cancel(flight) {
    flight.setState(new CancelledState());
    const event = { type: "CANCELLED", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }
}

class CancelledState extends FlightState {
  constructor() {
    super("Cancelado");
  }

  delay(flight, minutes) {
    logger.log(`[VUELO ${flight.flightNumber}] Vuelo cancelado, no se puede retrasar.`);
  }

  onTime(flight) {
    flight.setState(new OnTimeState());
    const event = { type: "ON_TIME", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Vuelo reactivado.`);
    flight.notify(event);
  }

  startBoarding(flight) {
    logger.log(`[VUELO ${flight.flightNumber}] No se puede embarcar un vuelo cancelado.`);
  }

  cancel(flight) {
    logger.log(`[VUELO ${flight.flightNumber}] El vuelo ya está cancelado.`);
  }
}

export { FlightState, OnTimeState, DelayedState, BoardingState, CancelledState };
