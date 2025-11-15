
import React from 'react';
import { Equipment } from '../types';

interface ExportButtonProps {
  data: Equipment[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ data }) => {
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Type', 'Status', 'IP Address', 'Last Seen'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => 
        [
          item.id,
          `"${item.name.replace(/"/g, '""')}"`,
          item.type,
          item.status,
          item.ipAddress,
          `"${new Date(item.lastSeen).toISOString()}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'it_monitor_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors duration-200 flex items-center gap-2 disabled:bg-slate-500 disabled:cursor-not-allowed"
      disabled={data.length === 0}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export CSV
    </button>
  );
};
