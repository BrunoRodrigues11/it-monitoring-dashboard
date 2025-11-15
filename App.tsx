import React, { useState, useMemo } from 'react';
import { MOCK_EQUIPMENT } from './constants';
import { Header } from './components/Header';
import { FilterControls } from './components/FilterControls';
import { SummaryCharts } from './components/SummaryCharts';
import { StatusCard } from './components/StatusCard';
import { Equipment, EquipmentStatus } from './types';
import { RegistrationModal } from './components/RegistrationModal';
import { pingDevice } from './services/pingService';
import { SummaryIndicators } from './components/SummaryIndicators';

type NewEquipmentData = Omit<Equipment, 'id' | 'status' | 'lastSeen'>;

function App() {
  const [equipment, setEquipment] = useState<Equipment[]>(MOCK_EQUIPMENT);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPingingAll, setIsPingingAll] = useState(false);

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

  const handleAddEquipment = (newEquipmentData: NewEquipmentData) => {
    const newEquipment: Equipment = {
      ...newEquipmentData,
      id: `eq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: EquipmentStatus.UP,
      lastSeen: new Date().toISOString(),
    };
    setEquipment(prev => [...prev, newEquipment]);
    setIsModalOpen(false); // Close modal on save
  };

  const handlePing = async (id: string) => {
    const currentItem = equipment.find(e => e.id === id);
    if (!currentItem || currentItem.status === EquipmentStatus.PINGING) {
      return; 
    }

    setEquipment(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: EquipmentStatus.PINGING } : item
      )
    );

    try {
      const newStatus = await pingDevice(currentItem.ipAddress);
      setEquipment(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, status: newStatus, lastSeen: new Date().toISOString() }
            : item
        )
      );
    } catch (error) {
      console.error("Ping failed:", error);
      // Revert to original status on error
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
    
    // Keep a snapshot of the state before mass-updating to "Pinging"
    const originalEquipmentState = [...equipment];

    // 1. Set all to PINGING for immediate UI feedback
    setEquipment(prev =>
      prev.map(item => ({ ...item, status: EquipmentStatus.PINGING }))
    );

    // 2. Create and run all ping operations concurrently
    const pingPromises = originalEquipmentState.map(async (item) => {
      try {
        const newStatus = await pingDevice(item.ipAddress);
        // 3. Update each device's status as its promise resolves
        setEquipment(prev =>
          prev.map(e =>
            e.id === item.id
              ? { ...e, status: newStatus, lastSeen: new Date().toISOString() }
              : e
          )
        );
      } catch (error) {
        console.error(`Ping failed for ${item.name}:`, error);
        // Revert to original status on error for this specific device
        setEquipment(prev =>
          prev.map(e =>
            (e.id === item.id ? { ...e, status: item.status } : e)
          )
        );
      }
    });

    // 4. Wait for all pings to complete, then re-enable the button
    await Promise.allSettled(pingPromises);
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

            {filteredEquipment.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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