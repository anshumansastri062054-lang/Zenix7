import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schemes, schemeDisclaimer } from '../data/schemes';

export default function SchemeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const scheme = schemes.find(s => s.id === parseInt(id));

  if (!scheme) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Scheme not found</p>
        <button
          onClick={() => navigate('/schemes')}
          className="mt-4 text-blue-600 font-medium hover:text-blue-700"
        >
          Back to Schemes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/schemes')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Schemes
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{scheme.name}</h1>
            <p className="text-gray-500">{scheme.fullName}</p>
          </div>
          <div className="flex gap-2">
            <span className={`text-xs px-3 py-1 rounded-full ${scheme.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {scheme.status}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full ${
              scheme.match === 'High' ? 'bg-green-100 text-green-700' :
              scheme.match === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {scheme.match} Match
            </span>
          </div>
        </div>
        <p className="text-gray-700">{scheme.description}</p>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Scheme Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Eligibility</p>
            <p className="text-gray-800">{scheme.eligibility}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Loan/Support</p>
            <p className="text-gray-800 font-medium">{scheme.loanSupport}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {scheme.category.map(cat => (
                <span key={cat} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{cat}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Implementing Agency</p>
            <p className="text-gray-800">{scheme.agency}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Source</p>
            <p className="text-gray-800">{scheme.source}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Verified</p>
            <p className="text-gray-800">{new Date(scheme.verifiedDate).toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Key Benefits</h3>
        <div className="space-y-3">
          {scheme.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Application Process */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">How to Apply</h3>
        <p className="text-gray-700 mb-4">{scheme.applicationProcess}</p>
        <div>
          <p className="text-sm text-gray-500 mb-2">Documents Required:</p>
          <div className="flex flex-wrap gap-2">
            {scheme.documentsRequired.map((doc, idx) => (
              <span key={idx} className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full">{doc}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
        <p className="text-sm text-yellow-700">
          <strong>Disclaimer:</strong> {schemeDisclaimer}
        </p>
      </div>
    </div>
  );
}
