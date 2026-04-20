import { Flight } from "../../domain/Flight";
import { BoardingState } from "./BoardingState";
import { CancelledState } from "./CancelledState";
import { DelayedState } from "./DelayedState";
import { FlightState, FlightStateName } from "./FlightState";
import { NewState } from "./NewState";
import { TakeoffState } from "./TakeoffState";

export class FlightStateController {
  private readonly flight: Flight;
  private currentState: FlightState;

  constructor(flight: Flight) {
    this.flight = flight;
    this.currentState = new NewState();
  }

  getState(): FlightStateName {
    return this.currentState.name;
  }

  getEnabledTransitions(): FlightStateName[] {
    return this.currentState.getEnabledTransitions();
  }

  getFlight(): Flight {
    return this.flight;
  }

  toDelayed(minutes: number): void {
    if (minutes <= 0) {
      throw new Error("Los minutos de retraso deben ser mayores a 0");
    }

    this.currentState.canTransitionTo("Delayed");
    this.flight.delay(minutes);
    this.currentState = new DelayedState();
  }

  toCancelled(): void {
    this.currentState.canTransitionTo("Cancelled");
    this.currentState = new CancelledState();
  }

  toBoarding(): void {
    this.currentState.canTransitionTo("Boarding");
    this.currentState = new BoardingState();
  }

  toTakeoff(): void {
    this.currentState.canTransitionTo("Takeoff");
    this.currentState = new TakeoffState();
  }
}
