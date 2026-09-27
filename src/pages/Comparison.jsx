import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessIdeas } from '../data/businesses';

export default function Comparison() {
  const navigate = useNavigate();
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);
  const [savedBusinesses, setSavedBusinesses] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedBusinesses');
    if (saved) setSavedBusinesses(JSON.parse(saved));
  }, []);

  const allBusinesses = [...businessIdeas, ...savedBusinesses.filter(sb => !businessIdeas.find(bi => bi.id === sb.id))];

  const toggleSelection = (business) => {
    if (selectedBusinesses.find(b => b.id === business.id)) {
      setSelectedBusinesses(prev => prev.filter(b => b.id !== business.id));
    } else if (selectedBusinesses.length < 3) {
      setSelectedBusinesses(prev => [...prev, business]);
    }
  };

  const comparisonMetrics = [
    { key: 'demand', label: 'Demand', icon: '📈' },
    { key: 'competition', label: 'Competition', icon: '⚔️' },
    { key: 'marketReach', label: 'Market Reach', icon: '🎯' },
    { key: 'financialFit', label: 'Financial Fit', icon: '💰' },
    { key: 'skillFit', label: 'Skill Fit', icon: '🛠️' },
    { key: 'overall', label: 'Overall', icon: '⭐' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Compare Businesses</h1>
        <p className="text-gray-500 mt-1">Select up to 3 businesses to compare side by side</p>
      </div>

      {/* Selection Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>{selectedBusinesses.length}/3</strong> businesses selected. 
          {selectedBusinesses.length < 3 && " Click on businesses below to add them."}
        </p>
      </div>

      {/* Business Selection */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allBusinesses.map(business => {
          const isSelected = selectedBusinesses.find(b => b.id === business.id);
          return (
            <button
              key={business.id}
              onClick={() => toggleSelection(business)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{business.name}</h3>
                  <p className="text-sm text-gray-500">{business.category}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Comparison Table */}
      {selectedBusinesses.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Comparison Results</h3>
            <p className="text-sm text-gray-500 mt-1">Compare these indicators based on your own priorities.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Metric</th>
                  {selectedBusinesses.map(biz => (
                    <th key={biz.id} className="text-center p-4 text-sm font-medium text-gray-600">
                      {biz.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonMetrics.map(metric => (
                  <tr key={metric.key} className="border-t border-gray-100">
                    <td className="p-4 text-sm text-gray-700">
                      <span className="mr-2">{metric.icon}</span>
                      {metric.label}
                    </td>
                    {selectedBusinesses.map(biz => {
                      const score = biz[metric.key];
                      return (
                        <td key={biz.id} className="p-4 text-center">
                          <span className={`text-lg font-bold ${score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {score}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
