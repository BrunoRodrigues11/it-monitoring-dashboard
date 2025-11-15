import { EquipmentStatus } from '../types';

/**
 * Simulates pinging a device at a given IP address.
 * In a real-world scenario, this would be a network request.
 * Here, we simulate a delay and a random success/failure outcome.
 * @param ipAddress The IP address to "ping".
 * @returns A promise that resolves to the new status (UP or DOWN).
 */
export const pingDevice = (ipAddress: string): Promise<EquipmentStatus.UP | EquipmentStatus.DOWN> => {
  console.log(`Pinging ${ipAddress}...`);
  
  return new Promise((resolve) => {
    // Simulate network delay between 500ms and 2000ms
    const delay = 500 + Math.random() * 1500;
    
    setTimeout(() => {
      // 80% chance of success (UP), 20% chance of failure (DOWN)
      const isSuccess = Math.random() < 0.8;
      const newStatus = isSuccess ? EquipmentStatus.UP : EquipmentStatus.DOWN;
      console.log(`Ping to ${ipAddress} finished with status: ${newStatus}`);
      resolve(newStatus);
    }, delay);
  });
};
