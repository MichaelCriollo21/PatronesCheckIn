import { CheckInStrategies, CheckInStrategyKey } from "../application/CheckInStrategies";
import { Passenger } from "../domain/Passenger/Passenger";

interface PassengerCardProps {
  passenger: Passenger;
  checkedIn: boolean;
  selectedStrategy: CheckInStrategyKey;
  onCheckIn: (passenger: Passenger) => void;
}

export function PassengerCard({
  passenger,
  checkedIn,
  selectedStrategy,
  onCheckIn,
}: PassengerCardProps) {
  return (
    <div
      style={{
        background: "#0a0e1a",
        border: "1px solid #1e3a5f",
        borderRadius: "10px",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div>
        <div style={{ fontSize: "13px", color: "#e0e8f0", fontWeight: 700 }}>
          {passenger.getName()}
        </div>
        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
          {passenger.getFeatures().length > 0 ? passenger.getFeatures().join(" · ") : "regular"}
        </div>
      </div>

      {!checkedIn ? (
        <button onClick={() => onCheckIn(passenger)} style={buttonStyle}>
          {CheckInStrategies[selectedStrategy].icon} Check-in
        </button>
      ) : (
        <span style={{ fontSize: "12px", color: "#4ade80", fontWeight: 700 }}>
          ✓ Registrado
        </span>
      )}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #1e3a5f, #0d6efd)",
  border: "none",
  borderRadius: "8px",
  padding: "8px 14px",
  color: "#7dd3fc",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "12px",
  fontWeight: 700,
};