import { Equipment, EquipmentStatus, EquipmentType } from './types';

export const MOCK_EQUIPMENT: Equipment[] = [
  { id: 'p001', name: 'Lobby Printer', type: EquipmentType.PRINTER, status: EquipmentStatus.UP, ipAddress: '192.168.1.10', lastSeen: '2023-10-27T10:00:00Z', department: 'Lobby' },
  { id: 'p002', name: 'HR Office Printer', type: EquipmentType.PRINTER, status: EquipmentStatus.UP, ipAddress: '192.168.1.11', lastSeen: '2023-10-27T10:01:00Z', department: 'HR' },
  { id: 'p003', name: 'Warehouse Printer', type: EquipmentType.PRINTER, status: EquipmentStatus.DOWN, ipAddress: '192.168.1.12', lastSeen: '2023-10-26T08:30:00Z', department: 'Warehouse' },
  { id: 'ph001', name: 'Reception Phone', type: EquipmentType.PHONE, status: EquipmentStatus.UP, ipAddress: '192.168.2.20', lastSeen: '2023-10-27T10:02:00Z', department: 'Lobby' },
  { id: 'ph002', name: 'CEO Office Phone', type: EquipmentType.PHONE, status: EquipmentStatus.UP, ipAddress: '192.168.2.21', lastSeen: '2023-10-27T10:02:15Z', department: 'Executive' },
  { id: 'ph003', name: 'Conference Room Phone', type: EquipmentType.PHONE, status: EquipmentStatus.UP, ipAddress: '192.168.2.22', lastSeen: '2023-10-27T10:02:30Z', department: 'Conference' },
  { id: 'ph004', name: 'Sales Floor Phone 1', type: EquipmentType.PHONE, status: EquipmentStatus.DOWN, ipAddress: '192.168.2.23', lastSeen: '2023-10-27T01:15:00Z', department: 'Sales' },
  { id: 'ph005', name: 'Sales Floor Phone 2', type: EquipmentType.PHONE, status: EquipmentStatus.UP, ipAddress: '192.168.2.24', lastSeen: '2023-10-27T10:02:45Z', department: 'Sales' },
  { id: 'tc001', name: 'Main Entrance Time Clock', type: EquipmentType.TIME_CLOCK, status: EquipmentStatus.UP, ipAddress: '192.168.3.30', lastSeen: '2023-10-27T09:59:00Z', department: 'Lobby' },
  { id: 'tc002', name: 'Warehouse Time Clock', type: EquipmentType.TIME_CLOCK, status: EquipmentStatus.UP, ipAddress: '192.168.3.31', lastSeen: '2023-10-27T09:59:30Z', department: 'Warehouse' },
  { id: 'tc003', name: 'Loading Dock Time Clock', type: EquipmentType.TIME_CLOCK, status: EquipmentStatus.DOWN, ipAddress: '192.168.3.32', lastSeen: '2023-10-25T17:00:00Z', department: 'Warehouse' },
  { id: 'p004', name: 'Marketing Printer', type: EquipmentType.PRINTER, status: EquipmentStatus.UP, ipAddress: '192.168.1.13', lastSeen: '2023-10-27T10:01:30Z', department: 'Marketing' },
  { id: 'ph006', name: 'Support Desk Phone', type: EquipmentType.PHONE, status: EquipmentStatus.UP, ipAddress: '192.168.2.25', lastSeen: '2023-10-27T10:03:00Z', department: 'Support' },
];
