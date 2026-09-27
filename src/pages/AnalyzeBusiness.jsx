import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessCategories } from '../data/businesses';
import LoadingAnalysis from '../components/LoadingAnalysis';
import { runCompleteAnalysis } from '../utils/calculations';
import { marketData } from '../data/marketData';
import { nearbyPlaces } from '../data/competitors';

export default function AnalyzeBusiness() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Tiffin Service',
    category: 'Food Service',
    investment: 300000,
    monthlyRevenue: 150000,
    monthlyExpenses: 95000,
    loanRequired: 200000,
    location: 'Sambalpur, Odisha'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = () => {
    setIsLoading(true);

    // Run calculations
    const business = {
      name: formData.name,
      category: formData.category,
      investment: parseInt(formData.investment) || 300000,
      monthlyRevenue: parseInt(formData.monthlyRevenue) || 150000,
      monthlyExpenses: parseInt(formData.monthlyExpenses) || 95000,
      loanRequired: parseInt(formData.loanRequired) || 0
    };

    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const amenities = {
      schools: nearbyPlaces.filter(p => p.type === 'school').length,
      hospitals: nearbyPlaces.filter(p => p.type === 'hospital').length,
      markets: nearbyPlaces.filter(p => p.type === 'market').length,
      residentialAreas: nearbyPlaces.filter(p => p.type === 'residential').length,
      offices: 5
    };

    const analysis = runCompleteAnalysis(business, profile, marketData, amenities);

    // Store analysis result
    const analysisResult = {
      business,
      scores: analysis.scores,
      financial: analysis.financial,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('currentAnalysis', JSON.stringify(analysisResult));

    // Add to recent analyses
    const recent = JSON.parse(localStorage.getItem('recentAnalyses') || '[]');
    recent.unshift({
      businessName: business.name,
      score: analysis.scores.overall,
      date: new Date().toLocaleDateString('en-IN'),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('recentAnalyses', JSON.stringify(recent.slice(0, 10)));
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    navigate('/analysis');
  };

  if (isLoading) {
    return <LoadingAnalysis onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Analyze Your Business</h1>
          <p className="text-gray-500 mt-1">Enter your business details to get AI-powered insights</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Tiffin Service"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {businessCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Investment (₹)</label>
              <input
                type="number"
                name="investment"
                value={formData.investment}
                onChange={handleChange}
                placeholder="300000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Monthly Revenue (₹)</label>
              <input
                type="number"
                name="monthlyRevenue"
                value={formData.monthlyRevenue}
                onChange={handleChange}
                placeholder="150000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Monthly Expenses (₹)</label>
              <input
                type="number"
                name="monthlyExpenses"
                value={formData.monthlyExpenses}
                onChange={handleChange}
                placeholder="95000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Required (₹)</label>
              <input
                type="number"
                name="loanRequired"
                value={formData.loanRequired}
                onChange={handleChange}
                placeholder="200000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Sambalpur, Odisha"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Analyze Business
          </button>
        </div>
      </div>
    </div>
  );
}
