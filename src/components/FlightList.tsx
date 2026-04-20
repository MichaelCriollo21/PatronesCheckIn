import type { ReactNode } from "react";

interface FlightListProps {
  children: ReactNode;
}

export function FlightList({ children }: FlightListProps) {
  return <div style={{ display: "grid", gap: "14px" }}>{children}</div>;
}