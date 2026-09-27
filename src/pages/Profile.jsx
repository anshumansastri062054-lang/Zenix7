import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/calculations';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    const profileData = localStorage.getItem('userProfile');
    if (userData) setUser(JSON.parse(userData));
    if (profileData) {
      const p = JSON.parse(profileData);
      setProfile(p);
      setFormData(p);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updated = {
      ...formData,
      age: parseInt(formData.age) || 24,
      investment: parseInt(formData.investment) || 500000,
      maxBudget: parseInt(formData.maxBudget) || 700000,
      loanRequired: parseInt(formData.loanRequired) || 0,
      existingEMI: parseInt(formData.existingEMI) || 0
    };
    localStorage.setItem('userProfile', JSON.stringify(updated));
    setProfile(updated);
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal and financial information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 font-medium">{user?.name || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email</label>
            <p className="text-gray-800 font-medium">{user?.email || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Age</label>
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 font-medium">{profile.age || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Education</label>
            {isEditing ? (
              <input
                type="text"
                name="education"
                value={formData.education || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 font-medium">{profile.education || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Skills</label>
            <div className="flex flex-wrap gap-1">
              {(profile.skills || []).map(skill => (
                <span key={skill} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full capitalize">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Experience</label>
            <p className="text-gray-800 font-medium capitalize">{profile.experience || 'Not set'}</p>
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Financial Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Available Investment</label>
            {isEditing ? (
              <input
                type="number"
                name="investment"
                value={formData.investment || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 font-medium">{formatCurrency(profile.investment || 0)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Maximum Budget</label>
            {isEditing ? (
              <input
                type="number"
                name="maxBudget"
                value={formData.maxBudget || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 font-medium">{formatCurrency(profile.maxBudget || 0)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Expected Loan Requirement</label>
            {isEditing ? (
              <input
                type="number"
                name="loanRequired"
                value={formData.loanRequired || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 font-medium">{formatCurrency(profile.loanRequired || 0)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Existing Monthly EMI</label>
            {isEditing ? (
              <input
                type="number"
                name="existingEMI"
                value={formData.existingEMI || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 font-medium">{formatCurrency(profile.existingEMI || 0)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Risk Preference</label>
            {isEditing ? (
              <select
                name="riskPreference"
                value={formData.riskPreference || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            ) : (
              <p className="text-gray-800 font-medium">{profile.riskPreference || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Location</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">State</label>
            {isEditing ? (
              <input
                type="text"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 font-medium">{profile.state || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">District</label>
            {isEditing ? (
              <input
                type="text"
                name="district"
                value={formData.district || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 font-medium">{profile.district || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">City/Town</label>
            {isEditing ? (
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 font-medium">{profile.city || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">PIN Code</label>
            {isEditing ? (
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode || ''}
                onChange={handleChange}
                maxLength={6}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 font-medium">{profile.pinCode || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Preferences */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Business Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-2">Preferred Sectors</label>
            <div className="flex flex-wrap gap-2">
              {(profile.preferredSectors || []).map(sector => (
                <span key={sector} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">{sector}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Business Format</label>
            <p className="text-gray-800 font-medium">{profile.businessFormat || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
