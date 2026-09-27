import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/calculations';
import { schemes } from '../data/schemes';
import AIChat from '../components/AIChat';
import { marketData } from '../data/marketData';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [savedBusinesses, setSavedBusinesses] = useState([]);
  const [chatContext, setChatContext] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    const profileData = localStorage.getItem('userProfile');
    const analyses = localStorage.getItem('recentAnalyses');
    const saved = localStorage.getItem('savedBusinesses');

    if (userData) setUser(JSON.parse(userData));
    if (profileData) setProfile(JSON.parse(profileData));
    if (analyses) setRecentAnalyses(JSON.parse(analyses));
    if (saved) setSavedBusinesses(JSON.parse(saved));

    // Build chat context
    if (profileData) {
      const p = JSON.parse(profileData);
      setChatContext({
        user: {
          skills: p.skills || [],
          investment: p.investment || 500000,
          experience: p.experience || 'beginner'
        },
        location: {
          state: p.state || 'Odisha',
          district: p.district || 'Sambalpur',
          city: p.city || 'Sambalpur'
        },
        business: {
          name: 'General Inquiry',
          category: 'General'
        },
        market: {
          population: marketData.population,
          targetPopulation: marketData.targetPopulation,
          reachablePopulation: marketData.reachablePopulation,
          competitorsWithin1km: marketData.competitorsWithin1km,
          competitorsWithin3km: marketData.competitorsWithin3km
        },
        scores: {
          demand: 75,
          competition: 60,
          marketReach: 78,
          demographicFit: 72,
          marketAccess: 70,
          financialViability: 74,
          overall: 72
        },
        financial: {
          investment: p.investment || 500000,
          monthlyRevenue: 0,
          monthlyExpenses: 0,
          monthlyProfit: 0,
          breakEvenMonths: 0
        }
      });
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const topSchemes = schemes.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">{getGreeting()}, {user?.name || 'User'}</h1>
        <div className="flex items-center gap-2 mt-2 text-blue-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{profile?.city || 'Sambalpur'}, {profile?.state || 'Odisha'}</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-blue-200 text-sm">Available Investment:</span>
          <span className="text-xl font-bold">{formatCurrency(profile?.investment || 500000)}</span>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Analyze My Business */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">ANALYZE MY BUSINESS</h3>
          <p className="text-gray-500 text-sm mt-1 mb-4">I already have a business idea.</p>
          <Link
            to="/analyze"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Analyze Business
          </Link>
        </div>

        {/* Find Business Ideas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">FIND BUSINESS IDEAS</h3>
          <p className="text-gray-500 text-sm mt-1 mb-4">Discover businesses suitable for my profile and locality.</p>
          <Link
            to="/ideas"
            className="inline-block px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Find Ideas
          </Link>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Analysis */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Analysis</h3>
          {recentAnalyses.length > 0 ? (
            <div className="space-y-3">
              {recentAnalyses.slice(0, 3).map((analysis, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{analysis.businessName}</p>
                    <p className="text-xs text-gray-500">{analysis.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${analysis.score >= 70 ? 'text-green-600' : analysis.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {analysis.score}/100
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">No recent analyses</p>
              <Link to="/analyze" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                Start your first analysis
              </Link>
            </div>
          )}
        </div>

        {/* Saved Businesses */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Saved Businesses</h3>
          {savedBusinesses.length > 0 ? (
            <div className="space-y-3">
              {savedBusinesses.slice(0, 3).map((biz, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{biz.name}</p>
                    <p className="text-xs text-gray-500">{biz.category}</p>
                  </div>
                  <span className="text-sm font-bold text-blue-600">{biz.overall}/100</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">No saved businesses</p>
              <Link to="/ideas" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                Explore ideas
              </Link>
            </div>
          )}
        </div>

        {/* Government Schemes */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Potential Government Schemes</h3>
          <div className="space-y-3">
            {topSchemes.map(scheme => (
              <div key={scheme.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{scheme.name}</p>
                  <p className="text-xs text-gray-500">{scheme.match} Match</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${scheme.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {scheme.status}
                </span>
              </div>
            ))}
          </div>
          <Link to="/schemes" className="block text-center text-blue-600 text-sm font-medium hover:text-blue-700 mt-4">
            View all schemes
          </Link>
        </div>
      </div>

      {/* Floating AI Chat */}
      {chatContext && <AIChat context={chatContext} />}
    </div>
  );
}
