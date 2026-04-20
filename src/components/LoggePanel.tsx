import { useLogger } from "../store";

export function LogPanel() {
  const { logs } = useLogger();
  
  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid #1e3a5f",
      borderRadius: "12px",
      marginTop: "24px",
      padding: "16px",
      maxHeight: "200px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#fbbf24", marginBottom: "10px" }}>
        PATTERN: SINGLETON — OBSERVADOR
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        {logs.length === 0 && (
          <div style={{ color: "#374151", fontSize: "11px" }}>Sin eventos aún...</div>
        )}
        {[...logs].reverse().map((l, i) => (
          <div
            key={i}
            style={{
              fontSize: "10px",
              color: "#6b7280",
              padding: "2px 0",
              borderBottom: "1px solid #111827",
            }}
          >
            <span style={{ color: "#fbbf24" }}>[{l.time}]</span> {l.msg}
          </div>
        ))}
      </div>
    </div>
  );
}