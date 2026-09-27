// Frontend Calculation Engine
// All scores are calculated deterministically from mock data
// The LLM does NOT calculate or invent these scores

/**
 * Calculate monthly profit
 */
export function calculateProfit(monthlyRevenue, monthlyExpenses) {
  return monthlyRevenue - monthlyExpenses;
}

/**
 * Calculate break-even period in months
 */
export function calculateBreakEven(investment, monthlyProfit) {
  if (monthlyProfit <= 0) return Infinity;
  return Math.ceil(investment / monthlyProfit);
}

/**
 * Calculate EMI using standard formula
 * EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
 */
export function calculateEMI(principal, annualRate, years) {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  if (monthlyRate === 0) return principal / months;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}

/**
 * Calculate total interest paid over loan tenure
 */
export function calculateTotalInterest(principal, annualRate, years) {
  const emi = calculateEMI(principal, annualRate, years);
  const totalPayment = emi * years * 12;
  return totalPayment - principal;
}

/**
 * Calculate market reach score (0-100)
 * Based on reachable population and competition
 */
export function calculateMarketReach(reachablePopulation, competitorsWithin3km) {
  const popScore = Math.min(reachablePopulation / 150, 100);
  const compPenalty = Math.min(competitorsWithin3km * 2, 30);
  return Math.max(0, Math.min(100, Math.round(popScore - compPenalty + 40)));
}

/**
 * Calculate competition density score (0-100)
 * Higher score = less competition = better
 */
export function calculateCompetitionDensity(competitorsWithin1km, competitorsWithin3km) {
  const nearbyPenalty = competitorsWithin1km * 8;
  const areaPenalty = competitorsWithin3km * 2;
  const score = 100 - nearbyPenalty - areaPenalty;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate demand score (0-100)
 * Based on target population and market trends
 */
export function calculateDemandScore(targetPopulation, marketTrend) {
  const popScore = Math.min(targetPopulation / 100, 80);
  const trendBonus = marketTrend === "Growing" ? 15 : marketTrend === "Stable" ? 10 : 5;
  return Math.max(0, Math.min(100, Math.round(popScore + trendBonus)));
}

/**
 * Calculate demographic fit score (0-100)
 * Based on user skills and business category alignment
 */
export function calculateDemographicScore(userSkills, businessCategory, experience) {
  const experienceBonus = experience === "experienced" ? 20 : experience === "intermediate" ? 15 : experience === "some" ? 10 : 5;
  const skillRelevance = Math.min(userSkills.length * 10, 30);
  const categoryBonus = ["Food Service", "Retail", "Services"].includes(businessCategory) ? 25 : 20;
  return Math.max(0, Math.min(100, experienceBonus + skillRelevance + categoryBonus + 15));
}

/**
 * Calculate market access score (0-100)
 * Based on location amenities and accessibility
 */
export function calculateMarketAccessScore(nearbyAmenities) {
  const schoolScore = Math.min(nearbyAmenities.schools * 8, 25);
  const marketScore = Math.min(nearbyAmenities.markets * 6, 20);
  const residentialScore = Math.min(nearbyAmenities.residentialAreas * 3, 25);
  const hospitalScore = Math.min(nearbyAmenities.hospitals * 5, 15);
  const officeScore = Math.min(nearbyAmenities.offices * 4, 15);
  return Math.max(0, Math.min(100, schoolScore + marketScore + residentialScore + hospitalScore + officeScore));
}

/**
 * Calculate financial viability score (0-100)
 * Based on investment capacity and expected returns
 */
export function calculateFinancialScore(investment, monthlyProfit, userInvestment, loanRequired) {
  const affordabilityRatio = userInvestment / investment;
  const affordabilityScore = Math.min(affordabilityRatio * 40, 40);
  const profitMargin = monthlyProfit / (monthlyProfit + 50000) * 30;
  const loanBurden = loanRequired > 0 ? Math.max(0, 30 - (loanRequired / 100000) * 5) : 30;
  return Math.max(0, Math.min(100, Math.round(affordabilityScore + profitMargin + loanBurden)));
}

/**
 * Calculate overall feasibility score (0-100)
 * Weighted average of all component scores
 */
export function calculateOverallScore(scores) {
  const weights = {
    demand: 0.20,
    competition: 0.15,
    marketReach: 0.15,
    demographicFit: 0.15,
    marketAccess: 0.15,
    financialViability: 0.20
  };

  let total = 0;
  for (const [key, weight] of Object.entries(weights)) {
    total += (scores[key] || 0) * weight;
  }
  return Math.round(total);
}

/**
 * Run complete analysis for a business
 */
export function runCompleteAnalysis(business, userProfile, marketData, nearbyAmenities) {
  const monthlyProfit = calculateProfit(business.monthlyRevenue, business.monthlyExpenses);
  const breakEven = calculateBreakEven(business.investment, monthlyProfit);

  const scores = {
    demand: calculateDemandScore(marketData.targetPopulation, marketData.marketTrend),
    competition: calculateCompetitionDensity(marketData.competitorsWithin1km, marketData.competitorsWithin3km),
    marketReach: calculateMarketReach(marketData.reachablePopulation, marketData.competitorsWithin3km),
    demographicFit: calculateDemographicScore(userProfile.skills, business.category, userProfile.experience),
    marketAccess: calculateMarketAccessScore(nearbyAmenities),
    financialViability: calculateFinancialScore(business.investment, monthlyProfit, userProfile.investment, business.loanRequired)
  };

  scores.overall = calculateOverallScore(scores);

  return {
    scores,
    financial: {
      investment: business.investment,
      monthlyRevenue: business.monthlyRevenue,
      monthlyExpenses: business.monthlyExpenses,
      monthlyProfit,
      breakEvenMonths: breakEven === Infinity ? "N/A" : breakEven
    }
  };
}

/**
 * Format currency in Indian format
 */
export function formatCurrency(amount) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Format number in Indian format
 */
export function formatNumber(num) {
  return num.toLocaleString('en-IN');
}
