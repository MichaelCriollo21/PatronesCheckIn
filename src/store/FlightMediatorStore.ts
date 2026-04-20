import { create } from "zustand";
import { FlightMediator } from "../application/FlightMediator";
import { Flight } from "../domain/Flight";

interface FlightMediatorState {
  mediatorsByFlightId: Record<string, FlightMediator>;
  getOrCreateMediator: (flight: Flight) => FlightMediator;
}

export const useFlightMediators = create<FlightMediatorState>((set, get) => ({
  mediatorsByFlightId: {},
  getOrCreateMediator: (flight: Flight) => {
    const flightId = flight.getId();
    const existing = get().mediatorsByFlightId[flightId];

    if (existing) {
      return existing;
    }

    const mediator = new FlightMediator(flight);

    set((state) => ({
      mediatorsByFlightId: {
        ...state.mediatorsByFlightId,
        [flightId]: mediator,
      },
    }));

    return mediator;
  },
}));