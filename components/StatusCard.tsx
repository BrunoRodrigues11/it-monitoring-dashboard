import React from 'react';
import { Equipment, EquipmentStatus } from '../types';
import { Icon } from './Icon';

interface StatusCardProps {
  item: Equipment;
  onPing: (id: string) => void;
}

const StatusIndicator: React.FC<{ status: EquipmentStatus }> = ({ status }) => {
  const isUp = status === EquipmentStatus.UP;
  const isDown = status === EquipmentStatus.DOWN;
  const isPinging = status === EquipmentStatus.PINGING;

  const bgColor = isUp ? 'bg-green-500' : isDown ? 'bg-red-500' : 'bg-yellow-500';
  const textColor = isUp ? 'text-green-300' : isDown ? 'text-red-300' : 'text-yellow-300';
  const pulseClass = isPinging ? 'animate-pulse' : '';

  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${bgColor} ${pulseClass}`}></span>
      <span className={`font-semibold ${textColor}`}>{status}</span>
    </div>
  );
};

export const StatusCard: React.FC<StatusCardProps> = ({ item, onPing }) => {
  const lastSeenDate = new Date(item.lastSeen);
  const isPinging = item.status === EquipmentStatus.PINGING;

  const handleCardClick = () => {
    if (!isPinging) {
      onPing(item.id);
    }
  };
  
  return (
    <div 
      className={`bg-slate-800 rounded-lg p-4 shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500 border border-transparent transition-all duration-300 flex flex-col justify-between h-full hover:scale-105 ${isPinging ? 'cursor-wait' : 'cursor-pointer'}`}
      onClick={handleCardClick}
      aria-label={`Ping ${item.name}`}
      role="button"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-slate-700 p-2 rounded-md">
              <Icon type={item.type} className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">{item.name}</h3>
              <p className="text-sm text-slate-400">{item.type}</p>
            </div>
          </div>
          <StatusIndicator status={item.status} />
        </div>
        <div className="text-sm text-slate-300 space-y-1">
          <p><span className="font-semibold text-slate-400">IP Address:</span> {item.ipAddress}</p>
          <p><span className="font-semibold text-slate-400">Department:</span> {item.department || 'N/A'}</p>
          <p><span className="font-semibold text-slate-400">Last Seen:</span> {lastSeenDate.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};