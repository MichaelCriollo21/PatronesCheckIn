import { FlightState, FlightStateName } from "./FlightState";

export class TakeoffState implements FlightState {
  readonly name: FlightStateName = "Takeoff";

  getEnabledTransitions(): FlightStateName[] {
    return [];
  }

  canTransitionTo(_target: FlightStateName): boolean {
    throw new Error("Transicion invalida: Takeoff es estado final");
  }
}
