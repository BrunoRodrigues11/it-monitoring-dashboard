
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">IT Monitoring Dashboard</h1>
          <p className="text-slate-400">Live status of all network equipment</p>
        </div>
      </div>
    </header>
  );
};
