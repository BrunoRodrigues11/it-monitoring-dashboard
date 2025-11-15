import React from 'react';
import { EventLogEntry, EventType } from '../types';

const EventTypeIndicator: React.FC<{ type: EventType }> = ({ type }) => {
  const baseClasses = "w-2.5 h-2.5 rounded-full";
  let colorClass = '';

  switch (type) {
    case EventType.SUCCESS:
      colorClass = 'bg-green-500';
      break;
    case EventType.ERROR:
      colorClass = 'bg-red-500';
      break;
    case EventType.INFO:
    default:
      colorClass = 'bg-cyan-500';
      break;
  }

  return <span className={`${baseClasses} ${colorClass}`} aria-label={`Event type: ${type}`}></span>;
};

interface EventLogProps {
  logs: EventLogEntry[];
}

export const EventLog: React.FC<EventLogProps> = ({ logs }) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Events</h3>
      <div className="overflow-y-auto relative" style={{ maxHeight: '400px' }}>
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-slate-400">No recent events to display.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800 sticky top-0 shadow-sm shadow-slate-900/50">
              <tr>
                <th scope="col" className="px-4 py-3 w-16 text-center">Status</th>
                <th scope="col" className="px-4 py-3">Message</th>
                <th scope="col" className="px-4 py-3 w-32 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-700/50 transition-colors duration-150">
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center">
                      <EventTypeIndicator type={log.type} />
                    </div>
                  </td>
                  <td className="px-4 py-2">{log.message}</td>
                  <td className="px-4 py-2 text-slate-400 text-right font-mono">{new Date(log.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
