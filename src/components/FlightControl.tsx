// ============================================================
// Componente: FlightControl
// Se comunica a través del Mediator en lugar de llamar
// directamente a flight.delay() o flight.onTime().
// ============================================================

import { useState } from "react";

interface FlightControlProps {
  mediator: any; // Could type better
  flightId: string;
  flightStatus: string;
}

export default function FlightControl({ mediator, flightId, flightStatus }: FlightControlProps) {
  const [delayMinutes, setDelayMinutes] = useState(30);

  const getPatternColor = () => {
    if (flightStatus.includes("Retrasado")) return "#f97316"; // Naranja para retrasado
    if (flightStatus === "Embarcando") return "#1e40af"; // Azul para embarcando
    if (flightStatus === "Cancelado") return "#dc2626"; // Rojo para cancelado
    return "#f97316"; // Naranja por defecto (a tiempo)
  };

  const handleDelay = () => {
    mediator.notify("FlightControl", "DELAY", { flightId, minutes: delayMinutes });
  };

  const handleOnTime = () => {
    mediator.notify("FlightControl", "ON_TIME", { flightId });
  };

  const handleStartBoarding = () => {
    mediator.notify("FlightControl", "BOARDING", { flightId });
  };

  const handleCancel = () => {
    mediator.notify("FlightControl", "CANCEL", { flightId });
  };

  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid #1e3a5f",
      borderRadius: "12px",
      padding: "20px",
    }}>
      <div style={{ fontSize: "10px", letterSpacing: "3px", color: getPatternColor(), marginBottom: "12px" }}>
        PATTERN: OBSERVER + MEDIATOR
      </div>
      <div style={{ fontSize: "14px", marginBottom: "14px", color: "#94a3b8" }}>
        Simular cambio de estado del vuelo:
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <label style={{ fontSize: "12px", color: "#64748b" }}>Retraso:</label>
        <input
          type="range"
          min="10"
          max="120"
          step="10"
          value={delayMinutes}
          onChange={(e) => setDelayMinutes(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ color: "#fca5a5", minWidth: "50px", fontSize: "13px" }}>
          {delayMinutes} min
        </span>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleDelay}
          style={{
            flex: 1, padding: "10px", background: "#7f1d1d", color: "#fca5a5",
            border: "none", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontFamily: "inherit",
          }}
        >
          ⚠ Retrasar Vuelo
        </button>
        <button
          onClick={handleOnTime}
          style={{
            flex: 1, padding: "10px", background: "#14532d", color: "#86efac",
            border: "none", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontFamily: "inherit",
          }}
        >
          ✓ Normalizar
        </button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
        <button
          onClick={handleStartBoarding}
          style={{
            flex: 1, padding: "10px", background: "#1e40af", color: "#93c5fd",
            border: "none", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontFamily: "inherit",
          }}
        >
          ✈ Embarcar
        </button>
        <button
          onClick={handleCancel}
          style={{
            flex: 1, padding: "10px", background: "#dc2626", color: "#fca5a5",
            border: "none", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontFamily: "inherit",
          }}
        >
          ❌ Cancelar
        </button>
      </div>
    </div>
  );
}