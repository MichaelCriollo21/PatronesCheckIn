import { create } from "zustand";
import { Flight } from "../domain/Flight";

interface FlightState {
  flights: Flight[];
  addFlight: (flight: Flight) => void;
}

export const useFlights = create<FlightState>((set) => ({
  flights: [],
  addFlight: (flight: Flight) => {
    set((state) => ({ flights: [flight, ...state.flights] }));
  },
}));