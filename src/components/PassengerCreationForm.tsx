import { CheckInStrategies, CheckInStrategyKey } from "../application/CheckInStrategies";

interface PassengerCreationFormProps {
  passangerOptions?: {
    name: string;
    vip?: boolean;
    baggageInHold?: boolean;
    priorityBoarding?: boolean;
  };
  selectedStrategy: CheckInStrategyKey;
  onUpdatePassangerOptions: (options: Partial<PassengerCreationFormProps["passangerOptions"]>) => void;
  onStrategyChange: (strategy: CheckInStrategyKey) => void;
  onCreatePassenger: () => void;
}

export function PassengerCreationForm({
  passangerOptions,
  selectedStrategy,
  onUpdatePassangerOptions,
  onStrategyChange,
  onCreatePassenger
}: PassengerCreationFormProps) {
  return (
    <div style={{ display: "grid", gap: "10px" }}>
      <input
        value={passangerOptions?.name || ""}
        onChange={(event) => onUpdatePassangerOptions({ name: event.target.value })}
        placeholder="Nombre del pasajero"
        style={inputStyle}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
        <label style={checkLabelStyle}>
          <input type="checkbox" checked={passangerOptions?.vip} onChange={(event) => onUpdatePassangerOptions({ vip: event.target.checked })} /> VIP
        </label>
        <label style={checkLabelStyle}>
          <input
            type="checkbox"
            checked={passangerOptions?.baggageInHold}
            onChange={(event) => onUpdatePassangerOptions({ baggageInHold: event.target.checked })}
          />
          Equipaje en bodega
        </label>
        <label style={checkLabelStyle}>
          <input
            type="checkbox"
            checked={passangerOptions?.priorityBoarding}
            onChange={(event) => onUpdatePassangerOptions({ priorityBoarding: event.target.checked })}
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