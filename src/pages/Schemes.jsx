import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SchemeCard from '../components/SchemeCard';
import { schemes, schemeDisclaimer } from '../data/schemes';

export default function Schemes() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filteredSchemes = filter === 'All'
    ? schemes
    : schemes.filter(s => s.match === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Government Schemes</h1>
        <p className="text-gray-500 mt-1">Explore schemes that may support your business</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['All', 'High', 'Medium', 'Low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f} Match
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map(scheme => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            onViewDetails={(s) => navigate(`/schemes/${s.id}`)}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
        <p className="text-sm text-yellow-700">
          <strong>Disclaimer:</strong> {schemeDisclaimer}
        </p>
      </div>
    </div>
  );
}
