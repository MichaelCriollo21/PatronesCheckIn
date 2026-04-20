import { assertTransition, FlightState, FlightStateName } from "./FlightState";

const ALLOWED_TRANSITIONS: readonly FlightStateName[] = ["Delayed", "Cancelled", "Boarding"];

export class NewState implements FlightState {
  readonly name: FlightStateName = "New";

  getEnabledTransitions(): FlightStateName[] {
    return [...ALLOWED_TRANSITIONS];
  }

  canTransitionTo(target: FlightStateName): boolean {
    assertTransition(this.name, target, ALLOWED_TRANSITIONS);
    return true;
  }
}
