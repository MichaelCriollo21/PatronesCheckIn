import { Route, Routes } from "react-router";
import { FlightManager } from "./pages/FlightManager";
import { LogPanel } from "./components/LoggePanel";
import { FlightPage } from "./pages/Flight";

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      width: "100svw",
      background: "#0a0e1a",
      fontFamily: "'Courier New', monospace",
      color: "#e0e8f0",
      padding: "24px",
      boxSizing: "border-box",

    }}>
      <Routes>
        <Route path="/" element={<FlightManager />} />
        <Route path=":flightId" element={<FlightPage />} />
      </Routes>
      <LogPanel />
    </div>
  );
}