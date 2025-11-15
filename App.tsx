import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_EQUIPMENT } from './constants';
import { Header } from './components/Header';
import { FilterControls } from './components/FilterControls';
import { SummaryCharts } from './components/SummaryCharts';
import { StatusCard } from './components/StatusCard';
import { Equipment, EquipmentStatus, EventLogEntry, EventType } from './types';
import { RegistrationModal } from './components/RegistrationModal';
import { pingDevice } from './services/pingService';
import { SummaryIndicators } from './components/SummaryIndicators';
import { EventLog } from './components/EventLog';

type NewEquipmentData = Omit<Equipment, 'id' | 'status' | 'lastSeen'>;

const MAX_LOG_ENTRIES = 50;

function App() {
  const [equipment, setEquipment] = useState<Equipment[]>(MOCK_EQUIPMENT);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);

  const addLogEntry = (message: string, type: EventType) => {
    setEventLog(prevLog => {
      const newEntry: EventLogEntry = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        message,
        type,
      };
      const updatedLog = [newEntry, ...prevLog];
      if (updatedLog.length > MAX_LOG_ENTRIES) {
        return updatedLog.slice(0, MAX_LOG_ENTRIES);
      }
      return updatedLog;
    });
  };

  const departments = useMemo(() => {
    const allDepartments = equipment
      .map(e => e.department)
      .filter((d): d is string => !!d);
    return [...new Set(allDepartments)].sort();
  }, [equipment]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter(item => {
      const statusMatch = statusFilter ? item.status === statusFilter : true;
      const typeMatch = typeFilter ? item.type === typeFilter : true;
      const departmentMatch = departmentFilter ? item.department === departmentFilter : true;
      return statusMatch && typeMatch && departmentMatch;
    });
  }, [equipment, statusFilter, typeFilter, departmentFilter]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setEquipment(currentEquipment => {
        if (currentEquipment.length === 0) return currentEquipment;
        
        const availableForPing = currentEquipment.filter(e => e.status !== EquipmentStatus.PINGING);
        if (availableForPing.length === 0) return currentEquipment;

        const deviceToPing = availableForPing[Math.floor(Math.random() * availableForPing.length)];

        addLogEntry(`Auto-pinging ${deviceToPing.name}...`, EventType.INFO);

        (async () => {
          try {
            const newStatus = await pingDevice(deviceToPing.ipAddress);
            if (newStatus === EquipmentStatus.UP) {
              addLogEntry(`${deviceToPing.name} is now UP.`, EventType.SUCCESS);
            } else {
              addLogEntry(`Auto-ping failed for ${deviceToPing.name}. Device is DOWN.`, EventType.ERROR);
            }
            setEquipment(prev =>
              prev.map(item =>
                item.id === deviceToPing.id
                  ? { ...item, status: newStatus, lastSeen: new Date().toISOString() }
                  : item
              )
            );
          } catch (error) {
            console.error(`Auto-ping failed for ${deviceToPing.name}:`, error);
            addLogEntry(`Auto-ping for ${deviceToPing.name} failed. An error occurred.`, EventType.ERROR);
            setEquipment(prev =>
              prev.map(item =>
                item.id === deviceToPing.id ? { ...item, status: deviceToPing.status } : item
              )
            );
          }
        })();

        return currentEquipment.map(item =>
          item.id === deviceToPing.id
            ? { ...item, status: EquipmentStatus.PINGING }
            : item
        );
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);


  const handleAddEquipment = (newEquipmentData: NewEquipmentData) => {
    const newEquipment: Equipment = {
      ...newEquipmentData,
      id: `eq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: EquipmentStatus.UP,
      lastSeen: new Date().toISOString(),
    };
    setEquipment(prev => [...prev, newEquipment]);
    addLogEntry(`Registered new equipment: ${newEquipment.name}`, EventType.INFO);
    setIsModalOpen(false);
  };

  const handlePing = async (id: string) => {
    const currentItem = equipment.find(e => e.id === id);
    if (!currentItem || currentItem.status === EquipmentStatus.PINGING) return;

    addLogEntry(`Pinging ${currentItem.name}...`, EventType.INFO);
    setEquipment(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: EquipmentStatus.PINGING } : item
      )
    );

    try {
      const newStatus = await pingDevice(currentItem.ipAddress);
      if (newStatus === EquipmentStatus.UP) {
        addLogEntry(`${currentItem.name} is now UP.`, EventType.SUCCESS);
      } else {
        addLogEntry(`Ping failed for ${currentItem.name}. Device is DOWN.`, EventType.ERROR);
      }
      setEquipment(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, status: newStatus, lastSeen: new Date().toISOString() }
            : item
        )
      );
    } catch (error) {
      console.error("Ping failed:", error);
      addLogEntry(`Ping for ${currentItem.name} failed. An error occurred.`, EventType.ERROR);
      setEquipment(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: currentItem.status } : item
        )
      );
    }
  };

  const handlePingAll = async () => {
    if (isPingingAll) return;

    setIsPingingAll(true);
    addLogEntry('Pinging all devices...', EventType.INFO);
    
    const originalEquipmentState = [...equipment];
    setEquipment(prev =>
      prev.map(item => ({ ...item, status: EquipmentStatus.PINGING }))
    );

    const pingPromises = originalEquipmentState.map(async (item) => {
      try {
        const newStatus = await pingDevice(item.ipAddress);
        if (newStatus === EquipmentStatus.UP) {
          addLogEntry(`${item.name} is now UP.`, EventType.SUCCESS);
        } else {
          addLogEntry(`Ping failed for ${item.name}. Device is DOWN.`, EventType.ERROR);
        }
        setEquipment(prev =>
          prev.map(e =>
            e.id === item.id
              ? { ...e, status: newStatus, lastSeen: new Date().toISOString() }
              : e
          )
        );
      } catch (error) {
        console.error(`Ping failed for ${item.name}:`, error);
        addLogEntry(`Ping for ${item.name} failed. An error occurred.`, EventType.ERROR);
        setEquipment(prev =>
          prev.map(e =>
            (e.id === item.id ? { ...e, status: item.status } : e)
          )
        );
      }
    });

    await Promise.allSettled(pingPromises);
    addLogEntry('Finished pinging all devices.', EventType.INFO);
    setIsPingingAll(false);
  };

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Header />
          <main>
            <SummaryIndicators equipment={equipment} />
            <SummaryCharts data={equipment} />
            <FilterControls
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              departments={departments}
              filteredData={filteredEquipment}
              onOpenModal={() => setIsModalOpen(true)}
              onPingAll={handlePingAll}
              isPingingAll={isPingingAll}
            />

            <div className="mt-6">
              {filteredEquipment.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEquipment.map(item => (
                    <StatusCard key={item.id} item={item} onPing={handlePing} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-800 rounded-lg">
                  <h3 className="text-xl font-semibold text-slate-300">No Equipment Found</h3>
                  <p className="text-slate-400 mt-2">Adjust your filters or register new equipment.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <EventLog logs={eventLog} />
            </div>
          </main>
        </div>
      </div>
      <RegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEquipment}
      />
    </>
  );
}

export default App;