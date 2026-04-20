import { CheckInStrategies, CheckInStrategyKey } from "../application/CheckInStrategies";

interface PassengerCreationFormProps {
  newPassengerName: string;
  onPassengerNameChange: (value: string) => void;
  vip: boolean;
  onVipChange: (value: boolean) => void;
  baggageInHold: boolean;
  onBaggageInHoldChange: (value: boolean) => void;
  priorityBoarding: boolean;
  onPriorityBoardingChange: (value: boolean) => void;
  selectedStrategy: CheckInStrategyKey;
  onStrategyChange: (strategy: CheckInStrategyKey) => void;
  onCreatePassenger: () => void;
}

export function PassengerCreationForm({
  newPassengerName,
  onPassengerNameChange,
  vip,
  onVipChange,
  baggageInHold,
  onBaggageInHoldChange,
  priorityBoarding,
  onPriorityBoardingChange,
  selectedStrategy,
  onStrategyChange,
  onCreatePassenger,
}: PassengerCreationFormProps) {
  return (
    <div style={{ display: "grid", gap: "10px" }}>
      <input
        value={newPassengerName}
        onChange={(event) => onPassengerNameChange(event.target.value)}
        placeholder="Nombre del pasajero"
        style={inputStyle}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
        <label style={checkLabelStyle}>
          <input type="checkbox" checked={vip} onChange={(event) => onVipChange(event.target.checked)} /> VIP
        </label>
        <label style={checkLabelStyle}>
          <input
            type="checkbox"
            checked={baggageInHold}
            onChange={(event) => onBaggageInHoldChange(event.target.checked)}
          />
          Equipaje en bodega
        </label>
        <label style={checkLabelStyle}>
          <input
            type="checkbox"
            checked={priorityBoarding}
            onChange={(event) => onPriorityBoardingChange(event.target.checked)}
          />
          Entrada prioritaria
        </label>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "12px", color: "#64748b" }}>Estrategia check-in:</span>
        <select
          value={selectedStrategy}
          onChange={(event) => onStrategyChange(event.target.value as CheckInStrategyKey)}
          style={inputStyle}
        >
          {(Object.keys(CheckInStrategies) as CheckInStrategyKey[]).map((key) => (
            <option key={key} value={key}>
              {CheckInStrategies[key].icon} {CheckInStrategies[key].label}
            </option>
          ))}
        </select>
        <button onClick={onCreatePassenger} style={buttonStyle}>
          + Agregar pasajero
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#0a0e1a",
  border: "1px solid #1e3a5f",
  borderRadius: "6px",
  color: "#94a3b8",
  padding: "8px",
  fontSize: "12px",
  fontFamily: "inherit",
};

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

const checkLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  color: "#94a3b8",
  background: "#0a0e1a",
  border: "1px solid #1e3a5f",
  borderRadius: "6px",
  padding: "8px",
};