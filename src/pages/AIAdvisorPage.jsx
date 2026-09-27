import React, { useState, useEffect } from 'react';
import AIChat from '../components/AIChat';
import { buildAIPayload } from '../services/aiService';
import { marketData } from '../data/marketData';
import { schemes } from '../data/schemes';

export default function AIAdvisorPage() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    const analysis = localStorage.getItem('currentAnalysis');
    const profile = localStorage.getItem('userProfile');

    if (analysis && profile) {
      const analysisData = JSON.parse(analysis);
      const profileData = JSON.parse(profile);

      const payload = buildAIPayload(
        profileData,
        analysisData.business,
        marketData,
        analysisData.scores,
        analysisData.financial,
        schemes
      );

      setContext(payload);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">AI Advisor</h1>
        <p className="text-gray-500 mt-1">Ask questions about your business analysis</p>
      </div>

      {context ? (
        <AIChat context={context} />
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🤖</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Analysis Available</h3>
          <p className="text-gray-500 text-sm mb-4">
            Run a business analysis first to get AI-powered insights and chat with the advisor.
          </p>
          <a href="/analyze" className="text-blue-600 font-medium hover:text-blue-700">
            Go to Analysis
          </a>
        </div>
      )}
    </div>
  );
}
