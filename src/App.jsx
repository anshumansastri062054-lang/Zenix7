import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import AnalyzeBusiness from './pages/AnalyzeBusiness';
import BusinessAnalysis from './pages/BusinessAnalysis';
import BusinessIdeas from './pages/BusinessIdeas';
import Comparison from './pages/Comparison';
import MarketAnalysis from './pages/MarketAnalysis';
import FinancialAnalysis from './pages/FinancialAnalysis';
import Schemes from './pages/Schemes';
import SchemeDetails from './pages/SchemeDetails';
import AIAdvisorPage from './pages/AIAdvisorPage';
import SavedBusinesses from './pages/SavedBusinesses';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function AppLayout({ children, user, profile, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    const profileData = localStorage.getItem('userProfile');
    if (userData) setUser(JSON.parse(userData));
    if (profileData) setProfile(JSON.parse(profileData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    setProfile(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout user={user} profile={profile} onLogout={handleLogout}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analyze" element={<AnalyzeBusiness />} />
                  <Route path="/analysis" element={<BusinessAnalysis />} />
                  <Route path="/ideas" element={<BusinessIdeas />} />
                  <Route path="/comparison" element={<Comparison />} />
                  <Route path="/market" element={<MarketAnalysis />} />
                  <Route path="/financial" element={<FinancialAnalysis />} />
                  <Route path="/schemes" element={<Schemes />} />
                  <Route path="/schemes/:id" element={<SchemeDetails />} />
                  <Route path="/ai-advisor" element={<AIAdvisorPage />} />
                  <Route path="/saved" element={<SavedBusinesses />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
