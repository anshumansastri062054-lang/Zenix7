import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessCard from '../components/BusinessCard';
import AIChat from '../components/AIChat';
import { businessIdeas } from '../data/businesses';
import { marketData } from '../data/marketData';

export default function BusinessIdeas() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [savedBusinesses, setSavedBusinesses] = useState([]);
  const [filterSector, setFilterSector] = useState('All');
  const [sortBy, setSortBy] = useState('overall');
  const [chatContext, setChatContext] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    const profileData = localStorage.getItem('userProfile');
    const saved = localStorage.getItem('savedBusinesses');
    if (profileData) setProfile(JSON.parse(profileData));
    if (saved) setSavedBusinesses(JSON.parse(saved));
  }, []);

  const sectors = ['All', ...new Set(businessIdeas.map(b => b.category))];

  const filteredIdeas = businessIdeas
    .filter(idea => filterSector === 'All' || idea.category === filterSector)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const handleAnalyze = (business) => {
    // Store selected business for analysis
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

  const handleAskAI = (business) => {
    setSelectedBusiness(business);
    const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const ctx = {
      user: {
        skills: profileData.skills || [],
        investment: profileData.investment || 500000,
        experience: profileData.experience || 'beginner'
      },
      location: {
        state: profileData.state || 'Odisha',
        district: profileData.district || 'Sambalpur',
        city: profileData.city || 'Sambalpur'
      },
      business: {
        name: business.name,
        category: business.category
      },
      market: {
        population: marketData.population,
        targetPopulation: marketData.targetPopulation,
        reachablePopulation: marketData.reachablePopulation,
        competitorsWithin1km: marketData.competitorsWithin1km,
        competitorsWithin3km: marketData.competitorsWithin3km
      },
      scores: {
        demand: business.demand,
        competition: business.competition,
        marketReach: business.marketReach,
        demographicFit: 70,
        marketAccess: 73,
        financialViability: business.financialFit,
        overall: business.overall
      },
      financial: {
        investment: business.investment.max,
        monthlyRevenue: business.monthlyRevenue.max,
        monthlyExpenses: business.monthlyExpenses.max,
        monthlyProfit: business.monthlyRevenue.max - business.monthlyExpenses.max,
        breakEvenMonths: 6
      }
    };
    setChatContext(ctx);
    // Open chatbox
    setTimeout(() => {
      const chatBtn = document.querySelector('[title="Ask Vyapar Mitra"]');
      if (chatBtn) chatBtn.click();
    }, 100);
  };

  const handleSave = (business) => {
    const isSaved = savedBusinesses.some(b => b.id === business.id);
    let updated;

    if (isSaved) {
      updated = savedBusinesses.filter(b => b.id !== business.id);
    } else {
      updated = [...savedBusinesses, business];
    }

    setSavedBusinesses(updated);
    localStorage.setItem('savedBusinesses', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Find Business Ideas</h1>
          <p className="text-gray-500 mt-1">Discover businesses suitable for your profile and locality</p>
        </div>
        <button
          onClick={() => navigate('/comparison')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Compare Selected
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Filter by Sector</label>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="overall">Overall Score</option>
              <option value="demand">Demand</option>
              <option value="financialFit">Financial Fit</option>
              <option value="skillFit">Skill Fit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Business Ideas Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map(business => (
          <div key={business.id} className="relative">
            <BusinessCard
              business={business}
              onAnalyze={handleAnalyze}
              onSave={handleSave}
              isSaved={savedBusinesses.some(b => b.id === business.id)}
            />
            <button
              onClick={() => handleAskAI(business)}
              className="absolute top-4 right-4 p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              title="Ask AI about this business"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Floating AI Chat */}
      {chatContext && (
        <AIChat
          context={chatContext}
          initialMessage={`I've loaded information about ${selectedBusiness?.name || 'this business'}. You can ask me about demand, competition, financial feasibility, or risks.`}
        />
      )}
    </div>
  );
}
