import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreCard from '../components/ScoreCard';
import { ScoreRadarChart, RevenueExpenseChart } from '../components/ChartCard';
import AIAdvisor from '../components/AIAdvisor';
import AIChat from '../components/AIChat';
import { buildAIPayload, getAIAnalysis } from '../services/aiService';
import { schemes } from '../data/schemes';
import { marketData } from '../data/marketData';
import { getCoordinates } from '../data/locations';
import { formatCurrency } from '../utils/calculations';

export default function BusinessAnalysis() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatContext, setChatContext] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('currentAnalysis');
    if (!data) {
      navigate('/analyze');
      return;
    }
    setAnalysis(JSON.parse(data));
  }, [navigate]);

  useEffect(() => {
    if (analysis) {
      loadAIAnalysis();
      buildChatContext();
    }
  }, [analysis]);

  const buildChatContext = () => {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const ctx = {
      user: {
        skills: profile.skills || [],
        investment: profile.investment || 500000,
        experience: profile.experience || 'beginner'
      },
      location: {
        state: profile.state || 'Odisha',
        district: profile.district || 'Sambalpur',
        city: profile.city || 'Sambalpur'
      },
      business: {
        name: analysis.business.name,
        category: analysis.business.category
      },
      market: {
        population: marketData.population,
        targetPopulation: marketData.targetPopulation,
        reachablePopulation: marketData.reachablePopulation,
        competitorsWithin1km: marketData.competitorsWithin1km,
        competitorsWithin3km: marketData.competitorsWithin3km
      },
      scores: analysis.scores,
      financial: analysis.financial
    };
    setChatContext(ctx);
  };

  const loadAIAnalysis = async () => {
    setIsLoadingAI(true);
    try {
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const payload = buildAIPayload(
        profile,
        analysis.business,
        marketData,
        analysis.scores,
        analysis.financial,
        schemes
      );
      const response = await getAIAnalysis(payload);
      setAiResponse(response);
    } catch (error) {
      console.error("AI analysis error:", error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAskQuestion = (question) => {
    setChatMessages(prev => [...prev, { role: 'user', content: question }]);
    // In a real implementation, this would call the AI service
    // For now, just add a placeholder response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm analyzing your question based on the available data. This is a demo response."
      }]);
    }, 1000);
  };

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading analysis...</p>
        </div>
      </div>
    );
  }

  const { scores, financial, business } = analysis;
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const coords = getCoordinates(profile.city, profile.district);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{business.name}</h1>
            <p className="text-gray-500 mt-1">{profile.city || 'Sambalpur'}, {profile.state || 'Odisha'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Overall Feasibility</p>
            <p className={`text-4xl font-bold ${scores.overall >= 70 ? 'text-green-600' : scores.overall >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {scores.overall}<span className="text-lg text-gray-400">/100</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Estimated Advisory Score</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
          <p className="text-xs text-yellow-700">
            <strong>Disclaimer:</strong> This score is an estimate based on available/sample data and does not guarantee business success.
          </p>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <ScoreCard title="Demand" score={scores.demand} icon="📈" color="blue" />
        <ScoreCard title="Competition" score={scores.competition} icon="⚔️" color="orange" />
        <ScoreCard title="Market Reach" score={scores.marketReach} icon="🎯" color="green" />
        <ScoreCard title="Demographic Fit" score={scores.demographicFit} icon="👥" color="purple" />
        <ScoreCard title="Market Access" score={scores.marketAccess} icon="📍" color="cyan" />
        <ScoreCard title="Financial Viability" score={scores.financialViability} icon="💰" color="red" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ScoreRadarChart scores={scores} />
        <RevenueExpenseChart revenue={financial.monthlyRevenue} expenses={financial.monthlyExpenses} />
      </div>

      {/* Financial Summary */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Financial Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Initial Investment</p>
            <p className="text-lg font-bold text-gray-800">{formatCurrency(financial.investment)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Monthly Revenue</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(financial.monthlyRevenue)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Monthly Expenses</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(financial.monthlyExpenses)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Est. Monthly Profit</p>
            <p className={`text-lg font-bold ${financial.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(financial.monthlyProfit)}
            </p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Break-even:</strong> Approximately {financial.breakEvenMonths} months
          </p>
        </div>
      </div>

      {/* AI Advisor */}
      {isLoadingAI ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-600">AI is analyzing your business...</p>
          </div>
        </div>
      ) : aiResponse ? (
        <AIAdvisor
          analysis={aiResponse}
          payload={null}
          onAskQuestion={handleAskQuestion}
        />
      ) : null}

      {/* Ask AI Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Have questions about this analysis?</h3>
            <p className="text-sm text-gray-600 mt-1">Ask Vyapar Mitra to explain your results.</p>
          </div>
          <button
            onClick={() => {
              const chatBtn = document.querySelector('[title="Ask Vyapar Mitra"]');
              if (chatBtn) chatBtn.click();
            }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ask AI
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/market')}
          className="flex-1 py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Market Analysis
        </button>
        <button
          onClick={() => navigate('/financial')}
          className="flex-1 py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Financial Analysis
        </button>
        <button
          onClick={() => navigate('/schemes')}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View Government Schemes
        </button>
      </div>

      {/* Floating AI Chat */}
      {chatContext && (
        <AIChat
          context={chatContext}
          initialMessage={`I've loaded your ${analysis.business.name} analysis. You can ask me about demand, competition, financial feasibility, market access or risks.`}
        />
      )}
    </div>
  );
}
