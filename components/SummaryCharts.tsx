import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Equipment, EquipmentStatus, EquipmentType } from '../types';

interface SummaryChartsProps {
  data: Equipment[];
}

const statusColors = {
  [EquipmentStatus.UP]: '#22c55e', // green-500
  [EquipmentStatus.DOWN]: '#ef4444', // red-500
};

export const SummaryCharts: React.FC<SummaryChartsProps> = ({ data }) => {
  // Filter out items that are currently being pinged
  const confirmedData = data.filter(item => item.status !== EquipmentStatus.PINGING);

  const statusSummary = confirmedData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<EquipmentStatus, number>);

  const pieData = Object.entries(statusSummary).map(([name, value]) => ({ name, value }));
  const COLORS = pieData.map(entry => statusColors[entry.name as EquipmentStatus]);

  const typeSummary = confirmedData.reduce((acc, item) => {
    if (!acc[item.type]) {
      // FIX: Initialize with all EquipmentStatus properties to match the accumulator type.
      acc[item.type] = {
        [EquipmentStatus.UP]: 0,
        [EquipmentStatus.DOWN]: 0,
        [EquipmentStatus.PINGING]: 0,
      };
    }
    acc[item.type][item.status]++;
    return acc;
  }, {} as Record<EquipmentType, { [key in EquipmentStatus]: number }>);

  const barData = Object.entries(typeSummary).map(([name, values]) => ({
    name,
    ...values,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Pie Chart: Overall Status */}
      <div className="bg-slate-800 p-4 rounded-lg shadow-md lg:col-span-1">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 text-center">Overall Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#334155', border: '1px solid #475569', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart: Status by Type */}
      <div className="bg-slate-800 p-4 rounded-lg shadow-md lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 text-center">Status by Type</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" allowDecimals={false} />
            <Tooltip
               contentStyle={{ backgroundColor: '#334155', border: '1px solid #475569', borderRadius: '0.5rem' }}
               labelStyle={{ color: '#cbd5e1' }}
               cursor={{fill: 'rgba(71, 85, 105, 0.5)'}}
            />
            <Legend />
            <Bar dataKey="UP" fill={statusColors.UP} />
            <Bar dataKey="DOWN" fill={statusColors.DOWN} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};