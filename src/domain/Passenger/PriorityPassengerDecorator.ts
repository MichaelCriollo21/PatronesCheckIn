import { PassengerFeature } from "./Passenger";
import { PassengerDecorator } from "./PassengerDecorator";

export class PriorityPassengerDecorator extends PassengerDecorator {
  getDescription(): string {
    return `${super.getDescription()} | Entrada prioritaria`;
  }

  getFeatures(): PassengerFeature[] {
    return [...super.getFeatures(), "priority"];
  }

  hasPriorityBoarding(): boolean {
    return true;
  }
}
