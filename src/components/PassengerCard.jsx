// ============================================================
// Componente: PassengerCard
// Muestra el tipo y badge del pasajero (creado por Factory).
// El check-in se despacha a través del Mediator.
// ============================================================

import CheckInStrategies from "../patterns/CheckInStrategies";

export default function PassengerCard({ passenger, selectedStrategy, flightStatus, mediator }) {
  const strategy = CheckInStrategies[selectedStrategy];

  const handleCheckIn = () => {
    mediator.notify("PassengerCard", "CHECK_IN", {
      passengerName: passenger.name,
      strategy: selectedStrategy,
      passenger,
      flightStatus,
    });
  };

  const priorityColors = {
    1: "#fbbf24", // VIP - dorado
    2: "#7dd3fc", // Crew - azul
    3: "#94a3b8", // Regular - gris
  };

  return (
    <div style={{
      background: "#0a0e1a",
      border: `1px solid ${priorityColors[passenger.priority] ?? "#1e3a5f"}22`,
      borderLeft: `3px solid ${priorityColors[passenger.priority] ?? "#1e3a5f"}`,
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "10px",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "6px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>{passenger.badge}</span>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "bold" }}>{passenger.name}</div>
            <div style={{ fontSize: "10px", color: priorityColors[passenger.priority], letterSpacing: "1px" }}>
              {passenger.label?.toUpperCase()} · {passenger.createdAt}
            </div>
          </div>
        </div>

        {!passenger.checkedIn ? (
          <button
            onClick={handleCheckIn}
            style={{
              padding: "5px 12px", background: "#0d6efd", color: "white",
              border: "none", borderRadius: "6px", cursor: "pointer",
              fontSize: "11px", fontFamily: "inherit",
            }}
          >
            {strategy.icon} Check-in
          </button>
        ) : (
          <span style={{ fontSize: "11px", color: "#4ade80" }}>✓ Registrado</span>
        )}
      </div>

      {passenger.notification && (
        <div style={{
          fontSize: "11px", padding: "4px 8px", borderRadius: "4px",
          background: passenger.notification.includes("⚠") ? "#450a0a" : "#052e16",
          color: passenger.notification.includes("⚠") ? "#fca5a5" : "#86efac",
          marginTop: "4px",
        }}>
          {passenger.notification}
        </div>
      )}
    </div>
  );
}
