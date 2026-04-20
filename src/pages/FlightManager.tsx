import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Logger } from "../application/Logger/Logger";
import { Flight } from "../domain/Flight";
import { CreateFlightForm } from "../components/CreateFlightForm.tsx";
import { FlightList } from "../components/FlightList.tsx";
import { FlightCard } from "../components/FlightCard";
import { decodeFlightId, encodeFlightId } from "../util/FlightIdCodec.ts";
import { useFlights } from "../store/FlightStore.ts";
import { useFlightMediators } from "../store/FlightMediatorStore.ts";

export function FlightManager() {
  const logger = Logger.getInstance();
  const navigate = useNavigate();
  const params = useParams();
  const flights = useFlights((state) => state.flights);
  const addFlight = useFlights((state) => state.addFlight);
  const getOrCreateMediator = useFlightMediators((state) => state.getOrCreateMediator);
  const [sortBy, setSortBy] = useState<"number" | "capacity" | "departure">("number");

  const sortedFlights = useMemo(() => {
    const items = [...flights];

    if (sortBy === "number") {
      return items.sort((a, b) => a.getNumber().localeCompare(b.getNumber()));
    }

    if (sortBy === "capacity") {
      return items.sort((a, b) => b.getCapacity() - a.getCapacity());
    }

    return items.sort(
      (a, b) => a.getDepartureTime().getTime() - b.getDepartureTime().getTime()
    );
  }, [flights, sortBy]);

  const handleCreateFlight = (flight: Flight) => {
    addFlight(flight);
    logger.log(
      `[FLIGHT] Vuelo creado: ${flight.getNumber()} | ${flight.getRoute()} | Capacidad ${flight.getCapacity()}`
    );
  };

  const handleSelectFlight = (flightId: string) => {
    navigate(`/${encodeFlightId(flightId)}`);
  };

  const activeFlightId = useMemo(() => {
    if (!params.flightId) {
      return undefined;
    }

    try {
      return decodeFlightId(params.flightId);
    } catch {
      return undefined;
    }
  }, [params.flightId]);

  return (
    <div
      style={{
        background: "#0a0e1a",
        fontFamily: "'Courier New', monospace",
        color: "#e0e8f0",
        padding: "24px",
      }}
    >
      <div
        style={{
          borderBottom: "2px solid #1e3a5f",
          paddingBottom: "16px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a5f, #0d6efd)",
            borderRadius: "12px",
            padding: "10px 18px",
            fontSize: "22px",
            fontWeight: "bold",
            letterSpacing: "4px",
            color: "#7dd3fc",
          }}
        >
          ✈ AEROFLY
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "2px" }}>
            SISTEMA DE CHECK-IN
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>
            Gestión de vuelos y creación manual
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e3a5f",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#7dd3fc",
              marginBottom: "16px",
              letterSpacing: "2px",
            }}
          >
            CREAR NUEVO VUELO
          </div>

          <CreateFlightForm onCreateFlight={handleCreateFlight} />
        </div>

        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e3a5f",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#7dd3fc",
              marginBottom: "16px",
              letterSpacing: "2px",
            }}
          >
            VUELOS REGISTRADOS
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
              style={{
                background: "#0a0e1a",
                border: "1px solid #1e3a5f",
                borderRadius: "6px",
                color: "#94a3b8",
                padding: "8px",
                fontSize: "12px",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <option value="number">Número de vuelo</option>
              <option value="capacity">Capacidad</option>
              <option value="departure">Salida más próxima</option>
            </select>
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            <FlightList>
              {sortedFlights.map((flight) => (
                <FlightCard
                  key={flight.getId()}
                  flight={flight}
                  flightState={getOrCreateMediator(flight).getState()}
                  onClick={handleSelectFlight}
                  selected={activeFlightId === flight.getId()}
                />
              ))}
            </FlightList>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "14px",
          background: "#0f172a",
          border: "1px solid #1e3a5f",
          borderRadius: "10px",
          display: "flex",
          gap: "16px",
          fontSize: "11px",
          color: "#64748b",
          flexWrap: "wrap",
        }}
      >
        <span>
          <span style={{ color: "#0d6efd" }}>●</span> Lista múltiple de vuelos
        </span>
        <span>
          <span style={{ color: "#4ade80" }}>●</span> Creación de vuelos con Builder
        </span>
        <span>
          <span style={{ color: "#fbbf24" }}>●</span> Estilo oscuro mantenido
        </span>
      </div>
    </div>
  );
}