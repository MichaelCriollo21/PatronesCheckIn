import { PassengerFeature } from "./Passenger";
import { PassengerDecorator } from "./PassengerDecorator";

export class VipPassengerDecorator extends PassengerDecorator {
  getDescription(): string {
    return `${super.getDescription()} | VIP`;
  }

  getFeatures(): PassengerFeature[] {
    return [...super.getFeatures(), "vip"];
  }

  hasVip(): boolean {
    return true;
  }
}
