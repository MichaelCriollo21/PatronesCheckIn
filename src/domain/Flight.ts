/**
 * PATRÓN: BUILDER
 * 
 * Propósito:
 * Construir un objeto Flight de forma segura con validaciones
 * - Capacidad de pasajeros obligatoria
 * - Fecha de salida mayor a la actual
 * - Propiedades opcionales
 */

export interface FlightData {
  id: string;
  number: string;
  route: string;
  capacity: number;
  departureDate: Date;
  delayMinutes: number;
}

export class Flight {
  private id: string;
  private number: string;
  private route: string;
  private capacity: number;
  private departureDate: Date;
  private delayMinutes: number;
  private boardedPassengers: number;

  constructor(
    id: string,
    number: string,
    route: string,
    capacity: number,
    departureDate: Date,
    delayMinutes: number = 0
  ) {
    this.id = id;
    this.number = number;
    this.route = route;
    this.capacity = capacity;
    this.departureDate = departureDate;
    this.delayMinutes = delayMinutes;
    this.boardedPassengers = 0;
  }

  getData(): FlightData {
    return {
      id: this.id,
      number: this.number,
      route: this.route,
      capacity: this.capacity,
      departureDate: this.departureDate,
      delayMinutes: this.delayMinutes,
    };
  }

  delay(minutes: number): this {
    if (minutes < 0) {
      throw new Error("Los minutos de retraso no pueden ser negativos");
    }
    this.delayMinutes += minutes;
    return this;
  }

  getDepartureTime(): Date {
    const adjustedDate = new Date(this.departureDate);
    adjustedDate.setMinutes(adjustedDate.getMinutes() + this.delayMinutes);
    return adjustedDate;
  }

  isDelayed(): boolean {
    return this.delayMinutes > 0;
  }

  getDelayMinutes(): number {
    return this.delayMinutes;
  }

  getAvailableSeats(): number {
    return this.capacity - this.boardedPassengers;
  }

  boardPassenger(): boolean {
    if (this.boardedPassengers < this.capacity) {
      this.boardedPassengers++;
      return true;
    }
    return false;
  }

  getBoardedPassengers(): number {
    return this.boardedPassengers;
  }

  getCapacity(): number {
    return this.capacity;
  }

  getId(): string {
    return this.id;
  }

  getNumber(): string {
    return this.number;
  }

  getRoute(): string {
    return this.route;
  }

  getDepartureDate(): Date {
    return new Date(this.departureDate);
  }
}

export class FlightBuilder {
  private id: string = "";
  private number: string = "";
  private route: string = "";
  private capacity: number = 0;
  private departureDate: Date | null = null;
  private delayMinutes: number = 0;

  withId(id: string): this {
    if (!id || id.trim().length === 0) {
      throw new Error("El ID del vuelo no puede estar vacío");
    }
    this.id = id;
    return this;
  }

  withNumber(number: string): this {
    if (!number || number.trim().length === 0) {
      throw new Error("El número de vuelo no puede estar vacío");
    }
    this.number = number;
    return this;
  }

  withRoute(route: string): this {
    if (!route || route.trim().length === 0) {
      throw new Error("La ruta del vuelo no puede estar vacía");
    }
    this.route = route;
    return this;
  }

  withCapacity(capacity: number): this {
    if (capacity <= 0) {
      throw new Error("La capacidad debe ser mayor a 0");
    }
    if (!Number.isInteger(capacity)) {
      throw new Error("La capacidad debe ser un número entero");
    }
    this.capacity = capacity;
    return this;
  }

  withDepartureDate(date: Date): this {
    const now = new Date();

    if (date <= now) {
      throw new Error(
        `La fecha de salida (${date.toLocaleString()}) debe ser mayor a la fecha actual (${now.toLocaleString()})`
      );
    }

    this.departureDate = new Date(date);
    return this;
  }

  withDelay(minutes: number): this {
    if (minutes < 0) {
      throw new Error("El retraso no puede ser negativo");
    }
    this.delayMinutes = minutes;
    return this;
  }

  build(): Flight {
    if (!this.id) {
      throw new Error("El ID del vuelo es obligatorio");
    }
    if (!this.number) {
      throw new Error("El número de vuelo es obligatorio");
    }
    if (!this.route) {
      throw new Error("La ruta del vuelo es obligatoria");
    }
    if (this.capacity === 0) {
      throw new Error("La capacidad es obligatoria");
    }
    if (!this.departureDate) {
      throw new Error("La fecha de salida es obligatoria");
    }

    return new Flight(
      this.id,
      this.number,
      this.route,
      this.capacity,
      this.departureDate,
      this.delayMinutes
    );
  }
}

