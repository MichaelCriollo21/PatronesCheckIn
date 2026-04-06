// ============================================================
// Componente: StrategySelector
// Permite al usuario elegir el método de check-in (Strategy).
// Cada botón representa una estrategia intercambiable.
// ============================================================

import CheckInStrategies from "../patterns/CheckInStrategies";

export default function StrategySelector({ selected, onChange }) {
  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid #1e3a5f",
      borderRadius: "12px",
      padding: "20px",
    }}>
      <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#0d6efd", marginBottom: "12px" }}>
        PATTERN: STRATEGY
      </div>
      <div style={{ fontSize: "14px", marginBottom: "14px", color: "#94a3b8" }}>
        Selecciona método de check-in:
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {Object.entries(CheckInStrategies).map(([key, s]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: selected === key ? "2px solid #0d6efd" : "1px solid #1e3a5f",
              background: selected === key ? "#1e3a5f" : "#0a0e1a",
              color: selected === key ? "#7dd3fc" : "#64748b",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: "20px" }}>{s.icon}</div>
            <div>{s.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
