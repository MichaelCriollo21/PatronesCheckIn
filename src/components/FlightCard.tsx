import { Flight } from "../domain/Flight";
import { FlightStateName } from "../application/FlightState";

interface FlightCardProps {
  flight: Flight;
  flightState: FlightStateName;
  onClick: (flightId: string) => void;
  selected?: boolean;
}

const STATE_LABELS: Record<FlightStateName, string> = {
  New: "Nuevo",
  Delayed: "Retrasado",
  Boarding: "Abordando",
  Cancelled: "Cancelado",
  Takeoff: "Despegado",
};

const STATE_STYLES: Record<FlightStateName, { background: string; text: string }> = {
  New: { background: "#1e3a8a", text: "#bfdbfe" },
  Delayed: { background: "#7c2d12", text: "#fdba74" },
  Boarding: { background: "#14532d", text: "#86efac" },
  Cancelled: { background: "#7f1d1d", text: "#fca5a5" },
  Takeoff: { background: "#334155", text: "#cbd5e1" },
};

export function FlightCard({ flight, flightState, onClick, selected = false }: FlightCardProps) {
  const departure = flight.getDepartureTime();
  const statusBaseLabel = STATE_LABELS[flightState];
  const statusLabel =
    flightState === "Delayed" ? `${statusBaseLabel} ${flight.getDelayMinutes()} min` : statusBaseLabel;
  const statusColor = STATE_STYLES[flightState].background;
  const statusTextColor = STATE_STYLES[flightState].text;

  return (
    <div
      onClick={() => onClick(flight.getId())}
      style={{
        background: "#0a0e1a",
        border: selected ? "1px solid #0d6efd" : "1px solid #1e3a5f",
        boxShadow: selected ? "0 0 0 1px rgba(13, 110, 253, 0.35)" : "none",
        borderRadius: "12px",
        padding: "16px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #1e3a5f, #0d6efd)",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#7dd3fc",
              minWidth: "92px",
              textAlign: "center",
            }}
          >
            {flight.getNumber()}
          </div>

          <div>
            <div style={{ fontSize: "14px", color: "#94a3b8" }}>{flight.getRoute()}</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              {flight.getAvailableSeats()} asientos disponibles de {flight.getCapacity()}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            background: statusColor,
            color: statusTextColor,
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "1px",
            whiteSpace: "nowrap",
          }}
        >
          {statusLabel.toUpperCase()}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "10px",
          fontSize: "12px",
          color: "#94a3b8",
        }}
      >
        <div>
          <div style={{ color: "#64748b", marginBottom: "4px" }}>Salida</div>
          <div>{departure.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ color: "#64748b", marginBottom: "4px" }}>Pasajeros</div>
          <div>{flight.getBoardedPassengers()}</div>
        </div>
        <div>
          <div style={{ color: "#64748b", marginBottom: "4px" }}>Retraso</div>
          <div>{flightState === "Delayed" ? `${flight.getDelayMinutes()} min` : "-"}</div>
        </div>
      </div>
    </div>
  );
}