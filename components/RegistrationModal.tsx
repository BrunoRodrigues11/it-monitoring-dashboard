import React, { useState, useEffect } from 'react';
import { Equipment, EquipmentType } from '../types';

type NewEquipmentData = Omit<Equipment, 'id' | 'status' | 'lastSeen'>;

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: NewEquipmentData) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<EquipmentType>(EquipmentType.PRINTER);
  const [ipAddress, setIpAddress] = useState('');
  const [department, setDepartment] = useState('');
  const [errors, setErrors] = useState<{ name?: string, ipAddress?: string }>({});

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setName('');
      setType(EquipmentType.PRINTER);
      setIpAddress('');
      setDepartment('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { name?: string, ipAddress?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipAddress.trim()) {
      newErrors.ipAddress = 'IP Address is required.';
    } else if (!ipRegex.test(ipAddress)) {
      newErrors.ipAddress = 'Please enter a valid IP address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({ name, type, ipAddress, department });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-100">Register New Equipment</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-slate-700 border ${errors.name ? 'border-red-500' : 'border-slate-600'} text-slate-100 rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500`}
                required
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* IP Address */}
            <div>
              <label htmlFor="ipAddress" className="block text-sm font-medium text-slate-300 mb-1">IP Address</label>
              <input
                type="text"
                id="ipAddress"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className={`w-full bg-slate-700 border ${errors.ipAddress ? 'border-red-500' : 'border-slate-600'} text-slate-100 rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500`}
                placeholder="e.g., 192.168.1.100"
                required
              />
               {errors.ipAddress && <p className="text-red-400 text-sm mt-1">{errors.ipAddress}</p>}
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-1">Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as EquipmentType)}
                className="w-full bg-slate-700 border-slate-600 text-slate-100 rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                {Object.values(EquipmentType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-slate-300 mb-1">Department (Optional)</label>
              <input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors duration-200"
            >
              Save Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
