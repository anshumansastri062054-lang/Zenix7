import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessCard from '../components/BusinessCard';

export default function SavedBusinesses() {
  const navigate = useNavigate();
  const [savedBusinesses, setSavedBusinesses] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedBusinesses');
    if (saved) setSavedBusinesses(JSON.parse(saved));
  }, []);

  const handleRemove = (business) => {
    const updated = savedBusinesses.filter(b => b.id !== business.id);
    setSavedBusinesses(updated);
    localStorage.setItem('savedBusinesses', JSON.stringify(updated));
  };

  const handleAnalyze = (business) => {
    const analysisData = {
      business: {
        name: business.name,
        category: business.category,
        investment: business.investment.max,
        monthlyRevenue: business.monthlyRevenue.max,
        monthlyExpenses: business.monthlyExpenses.max,
        loanRequired: 0
      },
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('selectedBusiness', JSON.stringify(analysisData));
    navigate('/analyze');
  };

  if (savedBusinesses.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Saved Businesses</h1>
          <p className="text-gray-500 mt-1">Your saved business ideas</p>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Saved Businesses</h3>
          <p className="text-gray-500 text-sm mb-4">
            Save business ideas to compare and analyze them later.
          </p>
          <button
            onClick={() => navigate('/ideas')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Explore Ideas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Saved Businesses</h1>
          <p className="text-gray-500 mt-1">{savedBusinesses.length} businesses saved</p>
        </div>
        <button
          onClick={() => navigate('/comparison')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Compare Selected
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedBusinesses.map(business => (
          <BusinessCard
            key={business.id}
            business={business}
            onAnalyze={handleAnalyze}
            onSave={handleRemove}
            isSaved={true}
          />
        ))}
      </div>
    </div>
  );
}
