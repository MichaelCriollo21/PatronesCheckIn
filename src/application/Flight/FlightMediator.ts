import { Flight } from "../../domain/Flight";
import { FlightStateName } from "../FlightState";
import { FlightStateController } from "../FlightState/FlightStateController";
import { Passenger } from "../../domain/Passenger/Passenger";
import { PassengerConfig, PassengerMediator } from "../../domain/Passenger/PassengerMediator";
import { CheckInStrategyKey, getCheckInStrategy } from "../CheckInStrategies";

const ACTIVE_CHECKIN_STATES: FlightStateName[] = ["New", "Delayed", "Boarding"];

export class FlightMediator {
  private readonly flight: Flight;
  private readonly flightStateController: FlightStateController;
  private readonly passengerMediator: PassengerMediator;
  private readonly passengers: Passenger[] = [];
  private readonly checkedInPassengers: Set<string> = new Set();

  constructor(flight: Flight) {
    this.flight = flight;
    this.flightStateController = new FlightStateController(flight);
    this.passengerMediator = new PassengerMediator();
  }

  getFlight(): Flight {
    return this.flight;
  }

  getState(): FlightStateName {
    return this.flightStateController.getState();
  }

  getPassengers(): Passenger[] {
    return [...this.passengers];
  }

  getCheckedInPassengers(): Passenger[] {
    return this.passengers.filter((passenger) => this.checkedInPassengers.has(passenger.getName()));
  }

  addPassenger(name: string, config: PassengerConfig = {}): Passenger {
    if (this.getState() === "Takeoff") {
      throw new Error("No se pueden agregar pasajeros despues del despegue");
    }

    const passenger = this.passengerMediator.createPassenger(name, config);
    this.passengers.push(passenger);

    return passenger;
  }

  checkInPassenger(name: string, strategy: CheckInStrategyKey): string {
    const currentState = this.getState();

    if (!ACTIVE_CHECKIN_STATES.includes(currentState)) {
      throw new Error(`No se puede hacer check-in en el estado ${currentState}`);
    }

    const passenger = this.passengers.find((entry) => entry.getName() === name);
    if (!passenger) {
      throw new Error(`No existe un pasajero registrado con el nombre ${name}`);
    }

    if (this.checkedInPassengers.has(name)) {
      throw new Error(`El pasajero ${name} ya tiene check-in realizado`);
    }

    const checkInStrategy = getCheckInStrategy(strategy);
    const result = checkInStrategy.execute(passenger.getDescription(), this.flight.getNumber());

    this.checkedInPassengers.add(name);

    return result;
  }

  delay(minutes: number): void {
    this.flightStateController.toDelayed(minutes);
  }

  cancel(): void {
    this.flightStateController.toCancelled();
  }

  boarding(): void {
    this.flightStateController.toBoarding();
  }

  takeoff(): void {
    this.flightStateController.toTakeoff();
  }
}