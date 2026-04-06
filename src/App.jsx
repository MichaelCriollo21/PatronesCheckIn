/* eslint-disable react-hooks/refs */
// ============================================================
// App.jsx — Punto de entrada principal
// Patrones implementados:
//   - SINGLETON:  logger (una sola instancia global)
//   - STRATEGY:   CheckInStrategies (algoritmo intercambiable)
//   - OBSERVER:   FlightSubject notifica a pasajeros suscritos
//   - FACTORY:    PassengerFactory crea objetos Passenger estandarizados
//   - MEDIATOR:   FlightMediator desacopla la comunicación entre módulos
// ============================================================

import { useState, useEffect, useRef } from "react";

import logger from "./patterns/Logger";
import FlightSubject from "./patterns/FlightSubject";
import PassengerFactory from "./patterns/PassengerFactory";
import FlightMediator from "./patterns/FlightMediator";

import StrategySelector from "./components/StrategySelector";
import FlightControl from "./components/FlightControl";
import PassengerCard from "./components/PassengerCard";
import LogPanel from "./components/LogPanel";

// FACTORY: los pasajeros iniciales se crean con la fábrica
const INITIAL_PASSENGERS = [
  PassengerFactory.create("Ana García", "vip"),
  PassengerFactory.create("Carlos Ruiz", "regular"),
  PassengerFactory.create("María López", "crew"),
];

export default function App() {
  const flightRef = useRef(new FlightSubject("AF-2047"));
  const mediatorRef = useRef(new FlightMediator(flightRef.current));
  const flight = flightRef.current;
  const mediator = mediatorRef.current;
// 
  const [passengers, setPassengers] = useState(INITIAL_PASSENGERS);
  const [selectedStrategy, setSelectedStrategy] = useState("online");
  const [flightStatus, setFlightStatus] = useState("A tiempo");
  const [logs, setLogs] = useState([]);
  const [checkInResults, setCheckInResults] = useState([]);
  const [newPassenger, setNewPassenger] = useState("");
  const [newPassengerType, setNewPassengerType] = useState("regular");

  const refreshLogs = () => setLogs([...logger.getLogs()]);

  // Registrar callbacks en el Mediator
  useEffect(() => {
    mediator.register({
      onPassengersChange: (updater) => {
        setPassengers(updater);
        refreshLogs();
      },
      onCheckInResult: (msg) => {
        setCheckInResults((prev) => [msg, ...prev].slice(0, 5));
        refreshLogs();
      },
      // onStatusChange removido: ahora se maneja vía Observer
    });
  }, [mediator]);

  // OBSERVER: suscribir/re-suscribir pasajeros al vuelo
  useEffect(() => {
    // Suscribir App para actualizaciones de estado del vuelo
    flight.subscribe({
      name: "App",
      update: (event) => {
        if (event.type === "DELAY" || event.type === "ON_TIME" || event.type === "BOARDING" || event.type === "CANCELLED") {
          setFlightStatus(event.status);
          refreshLogs();
        }
      },
    });

    passengers.forEach((p) => {
      flight.unsubscribe(p.name);
      flight.subscribe({
        name: p.name,
        update: (event) => {
          setPassengers((prev) =>
            prev.map((pass) =>
              pass.name === p.name
                ? {
                    ...pass,
                    notification:
                      event.type === "DELAY"
                        ? `⚠️ Vuelo retrasado ${event.minutes} min`
                        : event.type === "BOARDING"
                        ? `✈ Embarcando`
                        : event.type === "CANCELLED"
                        ? `❌ Vuelo cancelado`
                        : `✅ Vuelo a tiempo`,
                  }
                : pass
            )
          );
        },
      });
    });
  }, [flight, passengers, passengers.length]);

  // FACTORY + MEDIATOR: agregar nuevo pasajero
  const addPassenger = () => {
    if (!newPassenger.trim()) return;
    const passenger = PassengerFactory.create(newPassenger.trim(), newPassengerType);
    mediator.notify("App", "ADD_PASSENGER", { passenger });
    setNewPassenger("");
    refreshLogs();
  };

  const isDelayed = flightStatus.includes("Retrasado");
  const isBoarding = flightStatus === "Embarcando";
  const isCancelled = flightStatus === "Cancelado";

  const getStatusIcon = () => {
    if (isDelayed) return "⚠ ";
    if (isBoarding) return "✈ ";
    if (isCancelled) return "❌ ";
    return "● ";
  };

  const getStatusColor = () => {
    if (isDelayed) return "#7f1d1d"; // Rojo para retrasado
    if (isBoarding) return "#1e40af"; // Azul para embarcando
    if (isCancelled) return "#dc2626"; // Rojo oscuro para cancelado
    return "#14532d"; // Verde para a tiempo
  };

  const getStatusTextColor = () => {
    if (isDelayed) return "#fca5a5";
    if (isBoarding) return "#93c5fd";
    if (isCancelled) return "#fca5a5";
    return "#86efac";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0e1a",
      fontFamily: "'Courier New', monospace",
      color: "#e0e8f0",
      padding: "24px",
    }}>
      {/* HEADER */}
      <div style={{
        borderBottom: "2px solid #1e3a5f",
        paddingBottom: "16px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #1e3a5f, #0d6efd)",
          borderRadius: "12px",
          padding: "10px 18px",
          fontSize: "22px",
          fontWeight: "bold",
          letterSpacing: "4px",
          color: "#7dd3fc",
        }}>
          ✈ AEROFLY
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "2px" }}>
            SISTEMA DE CHECK-IN
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>
            Vuelo AF-2047 · BOG → MAD
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div style={{
            padding: "6px 14px",
            borderRadius: "20px",
            background: getStatusColor(),
            color: getStatusTextColor(),
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}>
            {getStatusIcon()}{flightStatus.toUpperCase()}
          </div>
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* COLUMNA IZQUIERDA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <StrategySelector selected={selectedStrategy} onChange={setSelectedStrategy} />
          <FlightControl mediator={mediator} flightStatus={flightStatus} />

          {checkInResults.length > 0 && (
            <div style={{
              background: "#0f172a",
              border: "1px solid #1e3a5f",
              borderRadius: "12px",
              padding: "16px",
            }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#64748b", marginBottom: "10px" }}>
                ÚLTIMAS ACCIONES
              </div>
              {checkInResults.map((msg, i) => (
                <div key={i} style={{
                  fontSize: "11px", color: "#4ade80",
                  borderLeft: "2px solid #14532d",
                  paddingLeft: "10px", marginBottom: "6px",
                }}>
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{
            background: "#0f172a",
            border: "1px solid #1e3a5f",
            borderRadius: "12px",
            padding: "20px",
            flex: 1,
          }}>
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#a78bfa", marginBottom: "12px" }}>
              PASAJEROS (OBSERVER + FACTORY)
            </div>

            {/* FACTORY: selector de tipo al agregar pasajero */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              <input
                value={newPassenger}
                onChange={(e) => setNewPassenger(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPassenger()}
                placeholder="Nombre del pasajero..."
                style={{
                  flex: 1, background: "#0a0e1a", border: "1px solid #1e3a5f",
                  borderRadius: "6px", color: "#e0e8f0", padding: "8px 12px",
                  fontSize: "12px", fontFamily: "inherit",
                }}
              />
              <select
                value={newPassengerType}
                onChange={(e) => setNewPassengerType(e.target.value)}
                style={{
                  background: "#0a0e1a", border: "1px solid #1e3a5f",
                  borderRadius: "6px", color: "#94a3b8", padding: "8px",
                  fontSize: "12px", fontFamily: "inherit", cursor: "pointer",
                }}
              >
                <option value="regular">🧑 Regular</option>
                <option value="vip">⭐ VIP</option>
                <option value="crew">🧑‍✈️ Crew</option>
              </select>
              <button
                onClick={addPassenger}
                style={{
                  padding: "8px 14px", background: "#1e3a5f", color: "#7dd3fc",
                  border: "none", borderRadius: "6px", cursor: "pointer",
                  fontSize: "14px", fontFamily: "inherit",
                }}
              >+</button>
            </div>

            {/* Ordenar por prioridad (VIP primero) */}
            {[...passengers]
              .sort((a, b) => (a.priority ?? 3) - (b.priority ?? 3))
              .map((p) => (
                <PassengerCard
                  key={p.name}
                  passenger={p}
                  selectedStrategy={selectedStrategy}
                  flightStatus={flightStatus}
                  mediator={mediator}
                />
              ))}
          </div>

          <LogPanel logs={logs} />
        </div>
      </div>

      {/* LEYENDA */}
      <div style={{
        marginTop: "20px", padding: "14px", background: "#0f172a",
        border: "1px solid #1e3a5f", borderRadius: "10px",
        display: "flex", gap: "16px", fontSize: "11px",
        color: "#64748b", flexWrap: "wrap",
      }}>
        <span><span style={{ color: "#0d6efd" }}>●</span> STRATEGY: Algoritmo de check-in intercambiable</span>
        <span><span style={{ color: "#f97316" }}>●</span> OBSERVER: Vuelo notifica a todos los pasajeros</span>
        <span><span style={{ color: "#fbbf24" }}>●</span> SINGLETON: Logger con instancia única global</span>
        <span><span style={{ color: "#4ade80" }}>●</span> FACTORY: Crea pasajeros tipificados (Regular/VIP/Crew)</span>
        <span><span style={{ color: "#f472b6" }}>●</span> MEDIATOR: Desacopla la comunicación entre módulos</span>
        <span><span style={{ color: "#22c55e" }}>●</span> STATE: El vuelo cambia de estado con objetos dedicados</span>
        <span><span style={{ color: "#f472b6" }}>●</span> CHAIN: Validaciones de check-in encadenadas</span>
      </div>
    </div>
  );
}
