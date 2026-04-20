import { useState } from "react";
import { Flight, FlightBuilder } from "../domain/Flight";

interface CreateFlightFormProps {
  onCreateFlight: (flight: Flight) => void;
}

export function CreateFlightForm({ onCreateFlight }: CreateFlightFormProps) {
  const [flightNumber, setFlightNumber] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [capacity, setCapacity] = useState(180);
  const [departureDate, setDepartureDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedFlightNumber = flightNumber.trim();
    const trimmedFrom = from.trim();
    const trimmedTo = to.trim();

    if (!trimmedFlightNumber || !trimmedFrom || !trimmedTo || capacity <= 0 || !departureDate) {
      setError("Completa todos los campos para crear el vuelo.");
      return;
    }

    if (trimmedFrom === trimmedTo) {
      setError("El origen y el destino no pueden ser iguales.");
      return;
    }

    const parsedDepartureDate = new Date(departureDate);

    try {
      const flight = new FlightBuilder()
        .withId(`FL-${Date.now()}`)
        .withNumber(trimmedFlightNumber)
        .withRoute(`${trimmedFrom} -> ${trimmedTo}`)
        .withCapacity(capacity)
        .withDepartureDate(parsedDepartureDate)
        .build();

      onCreateFlight(flight);
      setFlightNumber("");
      setFrom("");
      setTo("");
      setCapacity(180);
      setDepartureDate("");
    } catch (builderError) {
      setError(builderError instanceof Error ? builderError.message : "No se pudo crear el vuelo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
      {error ? (
        <div
          style={{
            background: "#3f1d1d",
            border: "1px solid #7f1d1d",
            color: "#fca5a5",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      ) : null}

      <input
        type="text"
        placeholder="Número de vuelo"
        value={flightNumber}
        onChange={(event) => setFlightNumber(event.target.value)}
        style={inputStyle}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <input
          type="text"
          placeholder="Origen"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Destino"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          style={inputStyle}
        />
      </div>

      <input
        type="number"
        min={1}
        placeholder="Capacidad"
        value={capacity}
        onChange={(event) => setCapacity(Number(event.target.value))}
        style={inputStyle}
      />

      <input
        type="datetime-local"
        value={departureDate}
        onChange={(event) => setDepartureDate(event.target.value)}
        style={inputStyle}
      />

      <button
        type="submit"
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #0d6efd)",
          border: "none",
          borderRadius: "6px",
          padding: "10px",
          color: "#7dd3fc",
          fontSize: "12px",
          fontWeight: "bold",
          cursor: "pointer",
          letterSpacing: "1px",
        }}
      >
        Crear Vuelo
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0a0e1a",
  border: "1px solid #1e3a5f",
  borderRadius: "6px",
  color: "#e0e8f0",
  padding: "10px",
  fontSize: "12px",
  fontFamily: "inherit",
  boxSizing: "border-box",
};