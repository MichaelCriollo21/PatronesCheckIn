import { assertTransition, FlightState, FlightStateName } from "./FlightState";

const ALLOWED_TRANSITIONS: readonly FlightStateName[] = ["Cancelled", "Boarding"];

export class DelayedState implements FlightState {
  readonly name: FlightStateName = "Delayed";

  getEnabledTransitions(): FlightStateName[] {
    return [...ALLOWED_TRANSITIONS];
  }

  canTransitionTo(target: FlightStateName): boolean {
    assertTransition(this.name, target, ALLOWED_TRANSITIONS);
    return true;
  }
}
