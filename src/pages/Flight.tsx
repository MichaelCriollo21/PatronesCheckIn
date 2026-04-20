import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CheckInStrategyKey } from "../application/CheckInStrategies";
import { Logger } from "../application/Logger/Logger";
import { FlightStateName } from "../application/FlightState";
import { Passenger } from "../domain/Passenger/Passenger";
import { decodeFlightId } from "../util/FlightIdCodec";
import { useFlights } from "../store/FlightStore.ts";
import { useFlightMediators } from "../store/FlightMediatorStore.ts";
import { PassengerCreationForm } from "../components/PassengerCreationForm";
import { PassengerCard } from "../components/PassengerCard";

const STATE_LABELS: Record<FlightStateName, string> = {
  New: "Nuevo",
  Delayed: "Retrasado",
  Boarding: "Abordando",
  Cancelled: "Cancelado",
  Takeoff: "Despegado",
};

const STATE_COLORS: Record<
  FlightStateName,
  { border: string; background: string; text: string }
> = {
  New: { border: "#1d4ed8", background: "#172554", text: "#bfdbfe" },
  Delayed: { border: "#ea580c", background: "#431407", text: "#fdba74" },
  Boarding: { border: "#16a34a", background: "#052e16", text: "#86efac" },
  Cancelled: { border: "#dc2626", background: "#450a0a", text: "#fca5a5" },
  Takeoff: { border: "#475569", background: "#1e293b", text: "#cbd5e1" },
};

export function FlightPage() {
  const logger = Logger.getInstance();
  const navigate = useNavigate();
  const { flightId: encodedFlightId } = useParams();
  const flights = useFlights((state) => state.flights);
  const getOrCreateMediator = useFlightMediators(
    (state) => state.getOrCreateMediator,
  );

  const decodedFlightId = useMemo(() => {
    if (!encodedFlightId) {
      return undefined;
    }

    try {
      return decodeFlightId(encodedFlightId);
    } catch {
      return undefined;
    }
  }, [encodedFlightId]);

  const flight = useMemo(
    () => flights.find((entry) => entry.getId() === decodedFlightId),
    [flights, decodedFlightId],
  );

  const mediator = useMemo(() => {
    if (!flight) {
      return undefined;
    }
    return getOrCreateMediator(flight);
  }, [flight, getOrCreateMediator]);

  const [selectedStrategy, setSelectedStrategy] =
    useState<CheckInStrategyKey>("online");
  const [passangerOptions, setPassangerOptions] = useState<{
    vip?: boolean;
    baggageInHold?: boolean;
    priorityBoarding?: boolean;
    name: string;
  }>();
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const passengers = useMemo(
    () => mediator?.getPassengers() ?? [],
    [mediator, refreshKey],
  );
  const checkedInNames = useMemo(
    () =>
      new Set(
        (mediator?.getCheckedInPassengers() ?? []).map((passenger) =>
          passenger.getName(),
        ),
      ),
    [mediator, refreshKey],
  );
  const enabledStates = useMemo(
    () => mediator?.getEnabledStates() ?? [],
    [mediator, refreshKey],
  );

  const refresh = () => setRefreshKey((value) => value + 1);

  const handleCreatePassenger = () => {
    if (!mediator || !passangerOptions) {
      return;
    }

    const name = passangerOptions?.name.trim();
    if (!name) {
      setError("Debes ingresar el nombre del pasajero.");
      return;
    }

    try {
      const passenger = mediator.addPassenger(name, {
        vip: passangerOptions?.vip,
        baggageInHold: passangerOptions?.baggageInHold,
        priorityBoarding: passangerOptions?.priorityBoarding,
      });

      logger.log(
        `[PASSENGER] ${passenger.getName()} agregado al vuelo ${mediator.getFlight().getNumber()} (${
          passenger.getFeatures().join(", ") || "regular"
        })`,
      );

      setPassangerOptions(undefined);
      setError(null);
      refresh();
    } catch (creationError) {
      setError(
        creationError instanceof Error
          ? creationError.message
          : "No se pudo crear el pasajero",
      );
    }
  };

  const handleCheckIn = (passenger: Passenger) => {
    if (!mediator) {
      return;
    }

    try {
      const result = mediator.checkInPassenger(
        passenger.getName(),
        selectedStrategy,
      );
      logger.log(result);
      setError(null);
      refresh();
    } catch (checkInError) {
      setError(
        checkInError instanceof Error
          ? checkInError.message
          : "No se pudo registrar el check-in",
      );
    }
  };

  const handleStateChange = (nextState: FlightStateName) => {
    if (!mediator) {
      return;
    }

    try {
      mediator.changeState(nextState, { delayMinutes });
      logger.log(
        `[STATE] ${mediator.getFlight().getNumber()} cambio a ${nextState}${
          nextState === "Delayed" ? ` (${delayMinutes} min)` : ""
        }`,
      );
      setError(null);
      refresh();
    } catch (stateError) {
      setError(
        stateError instanceof Error
          ? stateError.message
          : "No se pudo cambiar el estado",
      );
    }
  };

  if (!flight || !mediator) {
    return (
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e3a5f",
          borderRadius: "12px",
          padding: "20px",
          color: "#94a3b8",
        }}
      >
        <div
          style={{ marginBottom: "12px", fontSize: "14px", color: "#fca5a5" }}
        >
          No se encontró el vuelo para esta URL.
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "linear-gradient(135deg, #1e3a5f, #0d6efd)",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            color: "#7dd3fc",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Volver al panel general
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <div
        style={{
          borderBottom: "2px solid #1e3a5f",
          paddingBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div>
          <div
            style={{ fontSize: "11px", color: "#64748b", letterSpacing: "2px" }}
          >
            GESTIÓN DE VUELO
          </div>
          <div style={{ fontSize: "15px", color: "#94a3b8" }}>
            {flight.getNumber()} · {flight.getRoute()}
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "linear-gradient(135deg, #1e3a5f, #0d6efd)",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            color: "#7dd3fc",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ← Volver
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
          alignItems: "start",
        }}
      >
        <aside
          style={{
            background: "#0f172a",
            border: "1px solid #1e3a5f",
            borderRadius: "12px",
            padding: "20px",
            display: "grid",
            gap: "14px",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#7dd3fc",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            ESTADO DEL VUELO
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Estado actual:
            </span>
            <span
              style={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                width: "fit-content",
                fontSize: "12px",
                fontWeight: 700,
                color: STATE_COLORS[mediator.getState()].text,
                background: STATE_COLORS[mediator.getState()].background,
                border: `1px solid ${STATE_COLORS[mediator.getState()].border}`,
                borderRadius: "999px",
                padding: "5px 12px",
                letterSpacing: "0.4px",
              }}
            >
              {STATE_LABELS[mediator.getState()]}
            </span>
          </div>

          {enabledStates.includes("Delayed") ? (
            <div
              style={{
                border: "1px solid #1e3a5f",
                borderRadius: "10px",
                background: "#0a0e1a",
                padding: "12px",
                display: "grid",
                gap: "8px",
              }}
            >
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                Minutos de retraso: {delayMinutes} min
              </div>
              <input
                type="range"
                min={5}
                max={180}
                step={5}
                value={delayMinutes}
                onChange={(event) =>
                  setDelayMinutes(Number(event.target.value))
                }
              />
            </div>
          ) : null}

          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Cambiar a:</div>
            {enabledStates.length === 0 ? (
              <span style={{ color: "#64748b", fontSize: "12px" }}>
                No hay transiciones habilitadas.
              </span>
            ) : (
              <div style={{ display: "grid", gap: "8px" }}>
                {enabledStates.map((state) => (
                  <button
                    key={state}
                    onClick={() => handleStateChange(state)}
                    style={{
                      ...buttonStyle,
                      border: `1px solid ${STATE_COLORS[state].border}`,
                      background: STATE_COLORS[state].background,
                      color: STATE_COLORS[state].text,
                    }}
                  >
                    {STATE_LABELS[state]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e3a5f",
            borderRadius: "12px",
            padding: "20px",
            display: "grid",
            gap: "14px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#7dd3fc",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            PASAJEROS
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            <PassengerCreationForm
              selectedStrategy={selectedStrategy}
              onStrategyChange={setSelectedStrategy}
              onCreatePassenger={handleCreatePassenger}
              passangerOptions={passangerOptions}
              onUpdatePassangerOptions={(options) =>
                setPassangerOptions((current) => ({ ...current, ...options }))
              }
            />

            {error ? (
              <div
                style={{
                  borderRadius: "8px",
                  border: "1px solid #7f1d1d",
                  background: "#450a0a",
                  color: "#fca5a5",
                  fontSize: "12px",
                  padding: "8px 10px",
                }}
              >
                {error}
              </div>
            ) : null}
          </div>

          <div style={{ display: "grid", gap: "10px", marginTop: "8px" }}>
            {passengers.length === 0 ? (
              <div style={{ color: "#64748b", fontSize: "12px" }}>
                No hay pasajeros agregados.
              </div>
            ) : (
              passengers.map((passenger) => (
                <PassengerCard
                  key={passenger.getName()}
                  passenger={passenger}
                  checkedIn={checkedInNames.has(passenger.getName())}
                  selectedStrategy={selectedStrategy}
                  onCheckIn={handleCheckIn}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  background: "#1e3a5f",
  border: "1px solid #1e3a5f",
  borderRadius: "8px",
  padding: "8px 14px",
  color: "#93c5fd",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "12px",
  fontWeight: 700,
  textAlign: "left",
};
