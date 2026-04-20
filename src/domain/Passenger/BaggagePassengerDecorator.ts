import { PassengerFeature } from "./Passenger";
import { PassengerDecorator } from "./PassengerDecorator";

export class BaggagePassengerDecorator extends PassengerDecorator {
  getDescription(): string {
    return `${super.getDescription()} | Equipaje en bodega`;
  }

  getFeatures(): PassengerFeature[] {
    return [...super.getFeatures(), "baggage"];
  }

  hasBaggageInHold(): boolean {
    return true;
  }
}
