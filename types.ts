export enum EquipmentStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  PINGING = 'Pinging...',
}

export enum EquipmentType {
  PRINTER = 'Printer',
  PHONE = 'Phone',
  TIME_CLOCK = 'Time Clock',
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  status: EquipmentStatus;
  ipAddress: string;
  lastSeen: string;
  department?: string;
}

export enum EventType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface EventLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: EventType;
}
