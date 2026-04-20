import { Passenger, PassengerFeature } from "./Passenger";

export abstract class PassengerDecorator implements Passenger {
  protected readonly passenger: Passenger;

  constructor(passenger: Passenger) {
    this.passenger = passenger;
  }

  getName(): string {
    return this.passenger.getName();
  }

  getDescription(): string {
    return this.passenger.getDescription();
  }

  getFeatures(): PassengerFeature[] {
    return this.passenger.getFeatures();
  }

  hasVip(): boolean {
    return this.passenger.hasVip();
  }

  hasBaggageInHold(): boolean {
    return this.passenger.hasBaggageInHold();
  }

  hasPriorityBoarding(): boolean {
    return this.passenger.hasPriorityBoarding();
  }
}
