import { FlightState, FlightStateName } from "./FlightState";

export class CancelledState implements FlightState {
  readonly name: FlightStateName = "Cancelled";

  getEnabledTransitions(): FlightStateName[] {
    return [];
  }

  canTransitionTo(_target: FlightStateName): boolean {
    throw new Error("Transicion invalida: Cancelled es estado final");
  }
}
