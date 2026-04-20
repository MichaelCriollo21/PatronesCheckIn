import { BasicPassenger, Passenger } from "./Passenger";
import { BaggagePassengerDecorator } from "./BaggagePassengerDecorator";
import { PriorityPassengerDecorator } from "./PriorityPassengerDecorator";
import { VipPassengerDecorator } from "./VipPassengerDecorator";

export interface PassengerConfig {
  vip?: boolean;
  baggageInHold?: boolean;
  priorityBoarding?: boolean;
}

export class PassengerMediator {
  createPassenger(name: string, config: PassengerConfig = {}): Passenger {
    let passenger: Passenger = new BasicPassenger(name);

    if (config.vip) {
      passenger = new VipPassengerDecorator(passenger);
    }

    if (config.baggageInHold) {
      passenger = new BaggagePassengerDecorator(passenger);
    }

    if (config.priorityBoarding) {
      passenger = new PriorityPassengerDecorator(passenger);
    }

    return passenger;
  }

  applyVip(passenger: Passenger): Passenger {
    return new VipPassengerDecorator(passenger);
  }

  applyBaggageInHold(passenger: Passenger): Passenger {
    return new BaggagePassengerDecorator(passenger);
  }

  applyPriorityBoarding(passenger: Passenger): Passenger {
    return new PriorityPassengerDecorator(passenger);
  }
}
