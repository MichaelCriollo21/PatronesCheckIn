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
import FlightList from "./components/FlightList";

// FACTORY: los pasajeros iniciales se crean con la fábrica
const INITIAL_PASSENGERS = [
  PassengerFactory.create("Ana García", "vip"),
  PassengerFactory.create("Carlos Ruiz", "regular"),
  PassengerFactory.create("María López", "tripulacion"),
];

const createFlight = (flightNumber, route, passengers = []) => ({
  id: flightNumber,
  flightNumber,
  route,
  subject: new FlightSubject(flightNumber),
  passengers,
  status: "A tiempo",
});

const INITIAL_FLIGHTS = [
  createFlight("AF-2047", "BOG → MAD", INITIAL_PASSENGERS),
  createFlight("IB-3050", "MAD → BCN", []),
];

export default function App() {
  const mediatorRef = useRef(new FlightMediator());
  const mediator = mediatorRef.current;

  const [flights, setFlights] = useState(INITIAL_FLIGHTS);
  const [selectedFlightId, setSelectedFlightId] = useState(INITIAL_FLIGHTS[0].id);
  const [selectedStrategy, setSelectedStrategy] = useState("online");
  const [logs, setLogs] = useState([]);
  const [checkInResults, setCheckInResults] = useState([]);
  const [newPassenger, setNewPassenger] = useState("");
  const [newPassengerType, setNewPassengerType] = useState("regular");

  // Estado para la vista actual: "general" o "detail-{flightId}"
  const [currentView, setCurrentView] = useState("general");

  const activeFlight = flights.find((flight) => flight.id === selectedFlightId) ?? flights[0];
  const flightStatus = activeFlight?.status ?? "A tiempo";
  const passengers = activeFlight?.passengers ?? [];

  const refreshLogs = () => setLogs([...logger.getLogs()]);

  const updateFlight = (flightId, updater) =>
    setFlights((prev) =>
      prev.map((flight) =>
        flight.id === flightId ? { ...flight, ...updater(flight) } : flight
      )
    );

  const goToGeneralView = () => setCurrentView("general");
  const goToDetailView = (flightId) => {
    setSelectedFlightId(flightId);
    setCurrentView(`detail-${flightId}`);
  };

  useEffect(() => {
    mediator.registerFlights(
      flights.map((flight) => ({ id: flight.id, subject: flight.subject }))
    );
  }, [flights, mediator]);

  // Registrar callbacks en el Mediator
  useEffect(() => {
    mediator.register({
      onPassengersChange: (flightId, updater) => {
        updateFlight(flightId, (flight) => ({ passengers: updater(flight.passengers) }));
        refreshLogs();
      },
      onCheckInResult: (flightId, msg) => {
        setCheckInResults((prev) => [`[${flightId}] ${msg}`, ...prev].slice(0, 5));
        refreshLogs();
      },
      onStatusChange: () => {
        // Asegura que cualquier cambio de estado, incluso cuando no se notifica
        // a pasajeros (por ejemplo, normalizar un vuelo ya a tiempo), se refleje
        refreshLogs();
      },
    });
  }, [mediator]);

  // OBSERVER: suscribir/re-suscribir pasajeros al vuelo seleccionado
  useEffect(() => {
    if (!activeFlight) return;

    const flight = activeFlight.subject;
    const appObserverName = `App-${activeFlight.id}`;

    const handleFlightUpdate = (event) => {
      if (["DELAY", "ON_TIME", "BOARDING", "CANCELLED"].includes(event.type)) {
        updateFlight(activeFlight.id, () => ({ status: event.status }));
        refreshLogs();
      }
    };

    flight.subscribe({
      name: appObserverName,
      update: handleFlightUpdate,
    });

    activeFlight.passengers.forEach((p) => {
      const observerName = `${activeFlight.id}-${p.name}`;

      flight.unsubscribe(observerName);
      flight.subscribe({
        name: observerName,
        update: (event) => {
          updateFlight(activeFlight.id, (flight) => ({
            passengers: flight.passengers.map((pass) =>
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
            ),
          }));
        },
      });
    });

    return () => {
      flight.unsubscribe(appObserverName);
      activeFlight.passengers.forEach((p) => {
        flight.unsubscribe(`${activeFlight.id}-${p.name}`);
      });
    };
  }, [activeFlight, activeFlight.passengers.length]);

  const addPassenger = () => {
    if (!newPassenger.trim() || !activeFlight) return;
    const passenger = PassengerFactory.create(newPassenger.trim(), newPassengerType);
    mediator.notify("App", "ADD_PASSENGER", { flightId: activeFlight.id, passenger });
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
      {currentView === "general" ? (
        // Vista General: Lista de vuelos
        <FlightList
          flights={flights}
          onSelectFlight={goToDetailView}
          selectedStrategy={selectedStrategy}
          onStrategyChange={setSelectedStrategy}
          logs={logs}
          mediator={mediator}
        />
      ) : (
        // Vista de Detalle: Gestión específica del vuelo
        <>
          {/* HEADER */}
          <div style={{
            borderBottom: "2px solid #1e3a5f",
            paddingBottom: "16px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}>
            <button
              onClick={goToGeneralView}
              style={{
                background: "linear-gradient(135deg, #1e3a5f, #0d6efd)",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                color: "#7dd3fc",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #0d6efd, #1e3a5f)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #1e3a5f, #0d6efd)";
              }}
            >
              ← Volver al Panel General
            </button>
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
                Gestión de Vuelo: {activeFlight.flightNumber} - {activeFlight.route}
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
              <FlightControl mediator={mediator} flightStatus={flightStatus} flightId={activeFlight.id} />

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

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Vuelo:</span>
                  <select
                    value={selectedFlightId}
                    onChange={(e) => setSelectedFlightId(e.target.value)}
                    style={{
                      background: "#0a0e1a", border: "1px solid #1e3a5f",
                      borderRadius: "6px", color: "#94a3b8", padding: "8px",
                      fontSize: "12px", fontFamily: "inherit", cursor: "pointer",
                      minWidth: "170px",
                    }}
                  >
                    {flights.map((flight) => (
                      <option key={flight.id} value={flight.id}>
                        {flight.flightNumber} · {flight.route}
                      </option>
                    ))}
                  </select>
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
                    <option value="tripulacion">🧑‍✈️ Tripulación</option>
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
                      key={`${activeFlight.id}-${p.name}`}
                      passenger={p}
                      selectedStrategy={selectedStrategy}
                      flightStatus={flightStatus}
                      mediator={mediator}
                      flightId={activeFlight.id}
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
            <span><span style={{ color: "#4ade80" }}>●</span> FACTORY: Crea pasajeros tipificados (Regular/VIP/Tripulación)</span>
            <span><span style={{ color: "#f472b6" }}>●</span> MEDIATOR: Desacopla la comunicación entre módulos</span>
            <span><span style={{ color: "#22c55e" }}>●</span> STATE: El vuelo cambia de estado con objetos dedicados</span>
            <span><span style={{ color: "#f472b6" }}>●</span> CHAIN: Validaciones de check-in encadenadas</span>
          </div>
        </>
      )}
    </div>
  );
}
