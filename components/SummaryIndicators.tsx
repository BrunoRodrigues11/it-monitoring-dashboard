
import React from 'react';
import { Equipment, EquipmentStatus } from '../types';

// SVG Icons
const TotalDevicesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
        <line x1="6" x2="6.01" y1="6" y2="6" />
        <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
);

const OnlineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a8 8 0 0 1 14 0" />
        <path d="M2 8.82a15 15 0 0 1 20 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
);

const OfflineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a8 8 0 0 1 14 0" />
        <path d="M2 8.82a15 15 0 0 1 20 0" />
        <path d="M12 20h.01" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);


const UptimeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

interface SummaryIndicatorCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple';
}

const colorSchemes = {
  blue: {
    iconBg: 'bg-blue-500 bg-opacity-20',
    iconColor: 'text-blue-400',
    glow: 'bg-blue-500',
  },
  green: {
    iconBg: 'bg-green-500 bg-opacity-20',
    iconColor: 'text-green-400',
    glow: 'bg-green-500',
  },
  red: {
    iconBg: 'bg-red-500 bg-opacity-20',
    iconColor: 'text-red-400',
    glow: 'bg-red-500',
  },
  purple: {
    iconBg: 'bg-purple-500 bg-opacity-20',
    iconColor: 'text-purple-400',
    glow: 'bg-purple-500',
  },
};

const SummaryIndicatorCard: React.FC<SummaryIndicatorCardProps> = ({ title, value, icon, color }) => {
  const scheme = colorSchemes[color];

  return (
    <div className="bg-slate-800 rounded-lg p-5 shadow-lg flex justify-between items-center relative overflow-hidden">
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${scheme.glow} opacity-10`}></div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-100 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${scheme.iconBg}`}>
        <div className={`w-7 h-7 ${scheme.iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};


interface SummaryIndicatorsProps {
    equipment: Equipment[];
}

export const SummaryIndicators: React.FC<SummaryIndicatorsProps> = ({ equipment }) => {
    const totalDevices = equipment.length;
    const onlineDevices = equipment.filter(e => e.status === EquipmentStatus.UP).length;
    const offlineDevices = equipment.filter(e => e.status === EquipmentStatus.DOWN).length;
    const uptime = totalDevices > 0 ? ((onlineDevices / totalDevices) * 100).toFixed(1) + '%' : '0.0%';

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <SummaryIndicatorCard title="Total Devices" value={totalDevices} icon={<TotalDevicesIcon />} color="blue" />
            <SummaryIndicatorCard title="Online" value={onlineDevices} icon={<OnlineIcon />} color="green" />
            <SummaryIndicatorCard title="Offline" value={offlineDevices} icon={<OfflineIcon />} color="red" />
            <SummaryIndicatorCard title="Uptime" value={uptime} icon={<UptimeIcon />} color="purple" />
        </div>
    );
};
