import React, { useState, useEffect } from 'react';
import { AI_MODE } from '../services/aiService';

export default function AIAdvisor({ analysis, payload, onAskQuestion }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [question, setQuestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    onAskQuestion(question);
    setQuestion('');
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. You can use text input instead.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      onAskQuestion(transcript);
    };

    recognition.start();
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: '📊' },
    { id: 'why', label: 'Why It May Work', icon: '✅' },
    { id: 'risks', label: 'Risks', icon: '⚠️' },
    { id: 'financial', label: 'Financial', icon: '💰' },
    { id: 'market', label: 'Market', icon: '🏪' },
    { id: 'schemes', label: 'Schemes', icon: '🏛️' },
    { id: 'next', label: 'Next Steps', icon: '📋' }
  ];

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🤖</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Advisor</h3>
          <p className="text-gray-500 text-sm">Run an analysis to get AI-powered insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold">Vyapar Mitra Advisor</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${AI_MODE === 'demo' ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'}`}>
                  {AI_MODE === 'demo' ? 'DEMO AI RESPONSE' : 'AI GENERATED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100 overflow-x-auto">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {activeTab === 'summary' && (
          <div>
            <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
          </div>
        )}

        {activeTab === 'why' && (
          <div className="space-y-3">
            {analysis.whyItMayWork.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-3">
            {analysis.risks.map((risk, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-gray-700">{risk}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-3">
            {analysis.financialObservations.map((obs, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs">₹</span>
                </div>
                <p className="text-gray-700">{obs}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-3">
            {analysis.marketObservations.map((obs, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-700">{obs}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="space-y-3">
            {analysis.schemeObservations.map((obs, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-700">{obs}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'next' && (
          <div className="space-y-3">
            {analysis.nextSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 font-bold text-xs">{idx + 1}</span>
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ask Question */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <form onSubmit={handleSubmitQuestion} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Vyapar Mitra..."
              className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={startVoiceInput}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600'
              }`}
              title="Voice input"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            disabled={!question.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
