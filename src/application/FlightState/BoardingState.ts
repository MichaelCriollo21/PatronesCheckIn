import { assertTransition, FlightState, FlightStateName } from "./FlightState";

const ALLOWED_TRANSITIONS: readonly FlightStateName[] = ["Takeoff", "Delayed"];

export class BoardingState implements FlightState {
  readonly name: FlightStateName = "Boarding";

  getEnabledTransitions(): FlightStateName[] {
    return [...ALLOWED_TRANSITIONS];
  }

  canTransitionTo(target: FlightStateName): boolean {
    assertTransition(this.name, target, ALLOWED_TRANSITIONS);
    return true;
  }
}
