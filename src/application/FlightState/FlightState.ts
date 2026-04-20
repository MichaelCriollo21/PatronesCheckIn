export type FlightStateName = "New" | "Delayed" | "Cancelled" | "Boarding" | "Takeoff";

export interface FlightState {
  readonly name: FlightStateName;
  getEnabledTransitions(): FlightStateName[];
  canTransitionTo(target: FlightStateName): boolean;
}

export function assertTransition(
  current: FlightStateName,
  target: FlightStateName,
  allowed: readonly FlightStateName[]
): void {
  if (!allowed.includes(target)) {
    throw new Error(`Transicion invalida: ${current} -> ${target}`);
  }
}
