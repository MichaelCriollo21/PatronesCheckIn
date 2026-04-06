// ============================================================
// PATRÓN: OBSERVER + STATE
// FlightSubject es el "sujeto" que mantiene una lista de observadores
// (pasajeros) y los notifica automáticamente cuando cambia de estado.
// El estado del vuelo se modela con objetos separados para cada situación.
// ============================================================

import logger from "./Logger";
import { OnTimeState, BoardingState, CancelledState } from "./FlightStates";

class FlightSubject {
  constructor(flightNumber) {
    this.flightNumber = flightNumber;
    this.observers = [];
    this.state = new OnTimeState();
    this.status = this.state.getStatus();
  }

  setState(state) {
    this.state = state;
    this.status = state.getStatus();
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(name) {
    this.observers = this.observers.filter((o) => o.name !== name);
  }

  notify(event) {
    this.observers.forEach((o) => o.update(event));
  }

  delay(minutes) {
    this.state.delay(this, minutes);
  }

  onTime() {
    this.state.onTime(this);
  }

  startBoarding() {
    this.state.startBoarding(this);
  }

  cancel() {
    this.state.cancel(this);
  }

  getStatus() {
    return this.status;
  }
}

export default FlightSubject;
