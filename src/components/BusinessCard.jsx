import React from 'react';
import { sectorColors } from '../data/businesses';
import { formatCurrency } from '../utils/calculations';

export default function BusinessCard({ business, onAnalyze, onSave, isSaved, showCompare = false, isSelected, onToggleCompare }) {
  const sectorColor = sectorColors[business.category] || "bg-gray-100 text-gray-700";

  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border transition-all hover:shadow-md ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{business.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${sectorColor}`}>{business.category}</span>
        </div>
        <div className="flex gap-2">
          {showCompare && (
            <button
              onClick={() => onToggleCompare(business)}
              className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
              title="Select for comparison"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onSave(business)}
            className={`p-2 rounded-lg transition-colors ${isSaved ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
            title={isSaved ? "Remove from saved" : "Save business"}
          >
            <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">{business.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Investment</p>
          <p className="font-semibold text-gray-800">{formatCurrency(business.investment.min)} - {formatCurrency(business.investment.max)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Break-even</p>
          <p className="font-semibold text-gray-800">{business.breakEven}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <ScoreBar label="Demand" score={business.demand} />
        <ScoreBar label="Competition" score={business.competition} />
        <ScoreBar label="Financial Fit" score={business.financialFit} />
        <ScoreBar label="Skill Fit" score={business.skillFit} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Overall:</span>
          <span className={`text-lg font-bold ${business.overall >= 70 ? 'text-green-600' : business.overall >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {business.overall}/100
          </span>
        </div>
        <button
          onClick={() => onAnalyze(business)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Analyze
        </button>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-24">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-600 w-8">{score}</span>
    </div>
  );
}
