import React from 'react';

export default function SchemeCard({ scheme, onViewDetails }) {
  const matchColors = {
    High: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-red-100 text-red-700"
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{scheme.name}</h3>
          <p className="text-sm text-gray-500">{scheme.fullName}</p>
        </div>
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${scheme.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {scheme.status}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${matchColors[scheme.match] || 'bg-gray-100 text-gray-600'}`}>
            {scheme.match} Match
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Eligibility</p>
          <p className="text-sm text-gray-700">{scheme.eligibility}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Loan/Support</p>
          <p className="text-sm text-gray-700 font-medium">{scheme.loanSupport}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Category</p>
          <div className="flex flex-wrap gap-1">
            {scheme.category.map(cat => (
              <span key={cat} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{cat}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Implementing Agency</p>
          <p className="text-sm text-gray-700">{scheme.agency}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Source: {scheme.source}</span>
          <span>•</span>
          <span>Verified: {new Date(scheme.verifiedDate).toLocaleDateString('en-IN')}</span>
        </div>
      </div>

      <button
        onClick={() => onViewDetails(scheme)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        View Details
      </button>
    </div>
  );
}
