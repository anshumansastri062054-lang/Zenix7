import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { demoUser } from '../data/users';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Simulate login - store in localStorage
    const user = { ...demoUser, email, isDemo: false };
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');

    // Check if profile exists
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    localStorage.setItem('isLoggedIn', 'true');

    // Set default profile for demo user
    const defaultProfile = {
      age: 24,
      education: "Graduate",
      skills: ["cooking", "management"],
      experience: "beginner",
      investment: 500000,
      maxBudget: 700000,
      loanRequired: 200000,
      existingEMI: 0,
      riskPreference: "Medium",
      state: "Odisha",
      district: "Sambalpur",
      city: "Sambalpur",
      pinCode: "768001",
      preferredSectors: ["Food", "Retail"],
      businessFormat: "Home-based"
    };
    localStorage.setItem('userProfile', JSON.stringify(defaultProfile));

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Tagline */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">LB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Vyapar Mitra</h1>
          <p className="text-gray-500 text-sm mt-1">Make smarter business decisions with your local market.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              className="w-full mt-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Continue as Demo User
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">Prototype Login - No real authentication</p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-700">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          SIH 2026 • Hyperlocal Business Advisory Platform
        </p>
      </div>
    </div>
  );
}
