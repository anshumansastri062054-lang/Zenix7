import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import { BarChartCard, PieChartCard } from '../components/ChartCard';
import { marketData, marketInsights, dataConfidence } from '../data/marketData';
import { competitors, nearbyPlaces, userLocation } from '../data/competitors';
import { getCoordinates } from '../data/locations';
import { formatNumber } from '../utils/calculations';

export default function MarketAnalysis() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) setProfile(JSON.parse(profileData));
  }, []);

  const coords = getCoordinates(profile?.city, profile?.district);

  const populationData = [
    { name: "Total Population", value: marketData.population },
    { name: "Households", value: marketData.households },
    { name: "Target Population", value: marketData.targetPopulation },
    { name: "Reachable", value: marketData.reachablePopulation }
  ];

  const competitionData = [
    { name: "Within 1 km", value: marketData.competitorsWithin1km },
    { name: "Within 3 km", value: marketData.competitorsWithin3km }
  ];

  const amenitiesData = [
    { name: "Schools", value: marketData.nearbyAmenities.schools },
    { name: "Hospitals", value: marketData.nearbyAmenities.hospitals },
    { name: "Markets", value: marketData.nearbyAmenities.markets },
    { name: "Residential", value: marketData.nearbyAmenities.residentialAreas },
    { name: "Offices", value: marketData.nearbyAmenities.offices }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Market Analysis</h1>
        <p className="text-gray-500 mt-1">Understand your local market conditions</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Population</p>
          <p className="text-2xl font-bold text-gray-800">{formatNumber(marketData.population)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Households</p>
          <p className="text-2xl font-bold text-gray-800">{formatNumber(marketData.households)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Target Population</p>
          <p className="text-2xl font-bold text-blue-600">{formatNumber(marketData.targetPopulation)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Reachable Population</p>
          <p className="text-2xl font-bold text-green-600">{formatNumber(marketData.reachablePopulation)}</p>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Location Map</h3>
        <MapView
          center={coords}
          competitors={competitors}
          nearbyPlaces={nearbyPlaces}
          userLocation={userLocation}
          height="400px"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Nearest Competitor</p>
            <p className="font-semibold text-gray-800">350 m</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Competitors within 1 km</p>
            <p className="font-semibold text-gray-800">{marketData.competitorsWithin1km}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Nearest Market</p>
            <p className="font-semibold text-gray-800">800 m</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Nearest School</p>
            <p className="font-semibold text-gray-800">620 m</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <BarChartCard
          title="Population Breakdown"
          data={populationData}
          dataKey="value"
          xKey="name"
          color="#3B82F6"
        />
        <PieChartCard
          title="Competition Distribution"
          data={competitionData}
        />
      </div>

      {/* Why This Matters */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Why This Matters</h3>
        <div className="space-y-3">
          {marketInsights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-lg">{insight.type === 'positive' ? '✓' : '⚠'}</span>
              <p className="text-gray-700">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Confidence */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-2">Data Confidence</h3>
        <p className="text-sm text-gray-500 mb-4">
          Confidence describes the quality/availability of the underlying data. It does not represent business success probability.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(dataConfidence).map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  value.level === 'High' ? 'bg-green-100 text-green-700' :
                  value.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {value.level}
                </span>
              </div>
              <p className="text-xs text-gray-500">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
