// ============================================================
// Componente: FlightList
// Muestra una lista general de todos los vuelos con información resumida.
// Permite gestión global y navegación a detalles específicos.
// ============================================================

import { useState } from "react";

interface Flight {
  id: string;
  flightNumber: string;
  route: string;
  status: string;
  passengers: any[];
}

interface FlightListProps {
  flights: Flight[];
  onSelectFlight: (flightId: string) => void;
  selectedStrategy: string;
  onStrategyChange: (strategy: string) => void;
  logs: string[];
  mediator: any;
}

export default function FlightList({
  flights,
  onSelectFlight,
  selectedStrategy,
  onStrategyChange,
  logs,
  mediator,
}: FlightListProps) {
  const [sortBy, setSortBy] = useState<
    "flightNumber" | "status" | "passengers"
  >("flightNumber");
  const [showLogs, setShowLogs] = useState(false);

  const handleQuickStatusChange = (flightId: string, newStatus: string) => {
    mediator.notify("FlightList", "FLIGHT_STATUS_CHANGE", {
      flightId,
      status: newStatus,
    });
  };

  const handleGlobalAction = (action: string) => {
    if (action === "embarcar-todos") {
      flights.forEach((flight) => {
        if (flight.status !== "Cancelado") {
          mediator.notify("FlightList", "FLIGHT_STATUS_CHANGE", {
            flightId: flight.id,
            status: "Embarcando",
          });
        }
      });
    } else if (action === "a-tiempo-todos") {
      flights.forEach((flight) => {
        if (flight.status !== "Cancelado") {
          mediator.notify("FlightList", "FLIGHT_STATUS_CHANGE", {
            flightId: flight.id,
            status: "A tiempo",
          });
        }
      });
    }
  };

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "flightNumber")
      return a.flightNumber.localeCompare(b.flightNumber);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    if (sortBy === "passengers")
      return b.passengers.length - a.passengers.length;
    return 0;
  });

  const getStatusTextColor = (status: string) => {
    if (status.includes("Retrasado")) return "#fca5a5";
    if (status === "Embarcando") return "#93c5fd";
    if (status === "Cancelado") return "#fca5a5";
    return "#86efac";
  };

  const getStatusColor = (status: string) => {
    if (status.includes("Retrasado")) return "#7f1d1d";
    if (status === "Embarcando") return "#1e40af";
    if (status === "Cancelado") return "#dc2626";
    return "#14532d";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0e1a",
        fontFamily: "'Courier New', monospace",
        color: "#e0e8f0",
        padding: "24px",
      }}
    >
      {/* HEADER */}
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
          <div
            style={{ fontSize: "11px", color: "#64748b", letterSpacing: "2px" }}
          >
            SISTEMA DE CHECK-IN
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>
            Panel General de Vuelos
          </div>
        </div>
      </div>

      {/* CONTROLES GLOBALES */}
      <div
        style={{
          marginBottom: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* ESTRATEGIA GLOBAL */}
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
            ESTRATEGIA GLOBAL DE CHECK-IN
          </div>
          <select
            value={selectedStrategy}
            onChange={(e) => onStrategyChange(e.target.value)}
            style={{
              width: "100%",
              background: "#0a0e1a",
              border: "1px solid #1e3a5f",
              borderRadius: "6px",
              color: "#94a3b8",
              padding: "10px",
              fontSize: "12px",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            <option value="online">Online Check-in</option>
            <option value="counter">Counter Check-in</option>
            <option value="priority">Priority Check-in</option>
          </select>
        </div>

        {/* ACCIONES MASIVAS */}
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
            ACCIONES MASIVAS
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleGlobalAction("embarcar-todos")}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #1e3a5f, #0d6efd)",
                border: "none",
                borderRadius: "6px",
                padding: "10px",
                color: "#7dd3fc",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #0d6efd, #1e3a5f)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #1e3a5f, #0d6efd)";
              }}
            >
              Embarcar Todos
            </button>
            <button
              onClick={() => handleGlobalAction("a-tiempo-todos")}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #1e3a5f, #22c55e)",
                border: "none",
                borderRadius: "6px",
                padding: "10px",
                color: "#86efac",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #22c55e, #1e3a5f)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #1e3a5f, #22c55e)";
              }}
            >
              A Tiempo Todos
            </button>
          </div>
        </div>
      </div>

      {/* CONTROLES DE ORDENACIÓN Y LOGS */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Ordenar por:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
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
            <option value="flightNumber">Número de Vuelo</option>
            <option value="status">Estado</option>
            <option value="passengers">Número de Pasajeros</option>
          </select>
        </div>

        <button
          onClick={() => setShowLogs(!showLogs)}
          style={{
            background: showLogs
              ? "#1e3a5f"
              : "linear-gradient(135deg, #1e3a5f, #7c3aed)",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            color: "#7dd3fc",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {showLogs ? "Ocultar Logs" : "Ver Logs Globales"}
        </button>
      </div>

      {/* LOGS GLOBALES */}
      {showLogs && (
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e3a5f",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            maxHeight: "300px",
            overflowY: "auto",
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
            LOGS GLOBALES DEL SISTEMA
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {logs.length > 0 ? (
              logs.slice(-10).map((log, index) => (
                <div
                  key={index}
                  style={{
                    background: "#0a0e1a",
                    border: "1px solid #1e3a5f",
                    borderRadius: "6px",
                    padding: "10px",
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                >
                  <span style={{ color: "#64748b", fontSize: "10px" }}>
                    {log.time}
                  </span>{" "}
                  {log.msg}
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "12px",
                  padding: "20px",
                }}
              >
                No hay logs disponibles
              </div>
            )}
          </div>
        </div>
      )}

      {/* LISTA DE VUELOS */}
      <div style={{ display: "grid", gap: "16px" }}>
        {sortedFlights.map((flight) => (
          <div
            key={flight.id}
            style={{
              background: "#0f172a",
              border: "1px solid #1e3a5f",
              borderRadius: "12px",
              padding: "20px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onClick={() => onSelectFlight(flight.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0d6efd";
              e.currentTarget.style.boxShadow =
                "0 0 10px rgba(13, 110, 253, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1e3a5f";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #1e3a5f, #0d6efd)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#7dd3fc",
                  }}
                >
                  {flight.flightNumber}
                </div>
                <div>
                  <div style={{ fontSize: "14px", color: "#94a3b8" }}>
                    {flight.route}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {flight.passengers.length} pasajero
                    {flight.passengers.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: getStatusColor(flight.status),
                  color: getStatusTextColor(flight.status),
                  fontSize: "12px",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              >
                {flight.status.toUpperCase()}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                Haga clic para gestionar este vuelo
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickStatusChange(flight.id, "A tiempo");
                  }}
                  style={{
                    padding: "4px 8px",
                    background: "#14532d",
                    border: "none",
                    borderRadius: "4px",
                    color: "#86efac",
                    fontSize: "10px",
                    cursor: "pointer",
                  }}
                  title="Marcar como A tiempo"
                >
                  ✓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickStatusChange(flight.id, "Embarcando");
                  }}
                  style={{
                    padding: "4px 8px",
                    background: "#1e40af",
                    border: "none",
                    borderRadius: "4px",
                    color: "#93c5fd",
                    fontSize: "10px",
                    cursor: "pointer",
                  }}
                  title="Marcar como Embarcando"
                >
                  ✈
                </button>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#0d6efd",
                    fontWeight: "bold",
                  }}
                >
                  → Ver Detalles
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LEYENDA */}
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
          <span style={{ color: "#0d6efd" }}>●</span> STRATEGY: Algoritmo de
          check-in intercambiable
        </span>
        <span>
          <span style={{ color: "#f97316" }}>●</span> OBSERVER: Vuelo notifica a
          todos los pasajeros
        </span>
        <span>
          <span style={{ color: "#fbbf24" }}>●</span> SINGLETON: Logger con
          instancia única global
        </span>
        <span>
          <span style={{ color: "#4ade80" }}>●</span> FACTORY: Crea pasajeros
          tipificados (Regular/VIP/Tripulación)
        </span>
        <span>
          <span style={{ color: "#f472b6" }}>●</span> MEDIATOR: Desacopla la
          comunicación entre módulos
        </span>
        <span>
          <span style={{ color: "#22c55e" }}>●</span> STATE: El vuelo cambia de
          estado con objetos dedicados
        </span>
        <span>
          <span style={{ color: "#f472b6" }}>●</span> CHAIN: Validaciones de
          check-in encadenadas
        </span>
      </div>
    </div>
  );
}
