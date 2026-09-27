// Market data for the prototype
// This can later be replaced with real API data

export const marketData = {
  population: 45200,
  households: 10800,
  targetPopulation: 8500,
  reachablePopulation: 12400,
  competitorsWithin1km: 7,
  competitorsWithin3km: 18,
  competitionDensity: "Medium",
  avgHouseholdIncome: 28000,
  incomeLevel: "Medium",
  literacyRate: 78,
  urbanizationLevel: "Semi-Urrent",
  growthRate: "3.2% annually",
  marketTrend: "Growing",
  demandTrend: "Stable to Growing",
  seasonality: "Moderate",
  nearbyAmenities: {
    schools: 3,
    hospitals: 2,
    markets: 4,
    residentialAreas: 12,
    offices: 5,
    colleges: 2
  }
};

export const marketInsights = [
  {
    type: "positive",
    text: "Large target customer base"
  },
  {
    type: "positive",
    text: "Suitable residential catchment"
  },
  {
    type: "positive",
    text: "Moderate competition"
  },
  {
    type: "warning",
    text: "Existing competitors nearby"
  },
  {
    type: "warning",
    text: "Demand is estimated"
  }
];

export const dataConfidence = {
  population: { level: "High", description: "Based on census data" },
  competition: { level: "Medium", description: "Based on local survey" },
  demand: { level: "Medium", description: "Estimated from market trends" },
  income: { level: "Low", description: "Limited data available" },
  marketAccess: { level: "High", description: "Based on location analysis" },
  schemeData: { level: "High", description: "From official sources" }
};
