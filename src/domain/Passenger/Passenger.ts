export type PassengerFeature = "vip" | "baggage" | "priority";

export interface Passenger {
  getName(): string;
  getDescription(): string;
  getFeatures(): PassengerFeature[];
  hasVip(): boolean;
  hasBaggageInHold(): boolean;
  hasPriorityBoarding(): boolean;
}

export class BasicPassenger implements Passenger {
  private readonly name: string;

  constructor(name: string) {
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new Error("El nombre del pasajero no puede estar vacio");
    }
    this.name = normalizedName;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.name;
  }

  getFeatures(): PassengerFeature[] {
    return [];
  }

  hasVip(): boolean {
    return false;
  }

  hasBaggageInHold(): boolean {
    return false;
  }

  hasPriorityBoarding(): boolean {
    return false;
  }
}
