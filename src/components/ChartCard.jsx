import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function BarChartCard({ title, data, dataKey = "value", xKey = "name", color = "#3B82F6", height = 250 }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h4 className="font-semibold text-gray-800 mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`]}
          />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChartCard({ title, data, height = 250 }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h4 className="font-semibold text-gray-800 mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChartCard({ title, data, lines, xKey = "month", height = 250 }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h4 className="font-semibold text-gray-800 mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`]}
          />
          <Legend />
          {lines.map((line, idx) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color || COLORS[idx % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              name={line.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueExpenseChart({ revenue, expenses, height = 250 }) {
  const data = [
    { month: "Jan", revenue: revenue * 0.8, expenses: expenses * 0.9 },
    { month: "Feb", revenue: revenue * 0.85, expenses: expenses * 0.92 },
    { month: "Mar", revenue: revenue * 0.9, expenses: expenses * 0.95 },
    { month: "Apr", revenue: revenue * 0.95, expenses: expenses * 0.97 },
    { month: "May", revenue: revenue * 1.0, expenses: expenses * 1.0 },
    { month: "Jun", revenue: revenue * 1.05, expenses: expenses * 1.02 },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h4 className="font-semibold text-gray-800 mb-4">Revenue vs Expenses (6-Month Projection)</h4>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`]}
          />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} name="Revenue" />
          <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} name="Expenses" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScoreRadarChart({ scores, height = 300 }) {
  const data = [
    { subject: 'Demand', score: scores.demand, fullMark: 100 },
    { subject: 'Competition', score: scores.competition, fullMark: 100 },
    { subject: 'Market Reach', score: scores.marketReach, fullMark: 100 },
    { subject: 'Demographic', score: scores.demographicFit, fullMark: 100 },
    { subject: 'Market Access', score: scores.marketAccess, fullMark: 100 },
    { subject: 'Financial', score: scores.financialViability, fullMark: 100 },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h4 className="font-semibold text-gray-800 mb-4">Score Overview</h4>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <YAxis dataKey="subject" type="category" tick={{ fontSize: 12 }} width={80} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          <Bar dataKey="score" fill="#3B82F6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
