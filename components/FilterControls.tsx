import React from 'react';
import { EquipmentStatus, EquipmentType, Equipment } from '../types';
import { ExportButton } from './ExportButton';

interface FilterControlsProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  departments: string[];
  filteredData: Equipment[];
  onOpenModal: () => void;
  onPingAll: () => void;
  isPingingAll: boolean;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ 
  statusFilter, setStatusFilter, 
  typeFilter, setTypeFilter, 
  departmentFilter, setDepartmentFilter,
  departments,
  filteredData,
  onOpenModal,
  onPingAll,
  isPingingAll
}) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        {/* Status Filter */}
        <div className="flex-1">
          <label htmlFor="status-filter" className="block text-sm font-medium text-slate-300 mb-1">Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-700 border-slate-600 text-slate-100 rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="">All Statuses</option>
            {Object.values(EquipmentStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex-1">
          <label htmlFor="type-filter" className="block text-sm font-medium text-slate-300 mb-1">Type</label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-700 border-slate-600 text-slate-100 rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="">All Types</option>
            {Object.values(EquipmentType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex-1">
          <label htmlFor="department-filter" className="block text-sm font-medium text-slate-300 mb-1">Department</label>
          <select
            id="department-filter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full bg-slate-700 border-slate-600 text-slate-100 rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="">All Departments</option>
            {departments.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full lg:w-auto mt-2 lg:mt-0 flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={onPingAll}
          disabled={isPingingAll}
          className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-slate-500 disabled:cursor-not-allowed"
        >
          {isPingingAll ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.394 8.536a15 15 0 0121.212 0" />
            </svg>
          )}
          {isPingingAll ? 'Pinging...' : 'Ping All'}
        </button>
        <button
          onClick={onOpenModal}
          className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Register Equipment
        </button>
        <ExportButton data={filteredData} />
      </div>
    </div>
  );
};