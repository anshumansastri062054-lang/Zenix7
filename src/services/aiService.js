// AI Service - Handles both Demo and API modes
// IMPORTANT: In production, API calls should go through a backend proxy
// to avoid exposing API keys in the frontend

const AI_MODE = "demo"; // Change to "api" to enable live LLM calls

// API Configuration - In production, this should be environment variables
// and calls should be made through a backend proxy
const API_CONFIG = {
  endpoint: "https://api.openai.com/v1/chat/completions",
  model: "gpt-4",
  // API key should NEVER be hardcoded in frontend for production
  // This is for prototype testing only
  apiKey: import.meta.env.VITE_AI_API_KEY || ""
};

const SYSTEM_PROMPT = `You are LocalBiz AI, an advisory assistant for entrepreneurs.

Analyze only the structured information provided to you.

Do not invent statistics, competitors, government schemes, financial values or eligibility requirements.

Do not change the numerical scores calculated by the application.

Explain what the provided data means.

Clearly distinguish:
* calculated values
* estimates
* assumptions
* missing information

Provide:
1. Business summary
2. Why the business may be suitable
3. Important risks
4. Financial observations
5. Market observations
6. Relevant scheme observations
7. Recommended validation steps

Do not guarantee business success.

Your role is to help the entrepreneur understand the available evidence.`;

/**
 * Build structured payload for AI
 * Only sends necessary structured information
 * Does NOT send passwords or sensitive auth data
 */
export function buildAIPayload(userProfile, business, marketData, scores, financial, schemes) {
  return {
    user: {
      age: userProfile.age,
      skills: userProfile.skills,
      experience: userProfile.experience,
      investment: userProfile.investment,
      loanRequired: userProfile.loanRequired
    },
    location: {
      state: userProfile.state,
      district: userProfile.district,
      city: userProfile.city,
      pin: userProfile.pinCode
    },
    business: {
      name: business.name,
      category: business.category,
      investment: business.investment
    },
    market: {
      population: marketData.population,
      targetPopulation: marketData.targetPopulation,
      reachablePopulation: marketData.reachablePopulation,
      competitorsWithin1km: marketData.competitorsWithin1km,
      competitorsWithin3km: marketData.competitorsWithin3km
    },
    scores: {
      demand: scores.demand,
      competition: scores.competition,
      marketReach: scores.marketReach,
      demographicFit: scores.demographicFit,
      marketAccess: scores.marketAccess,
      financialViability: scores.financialViability,
      overall: scores.overall
    },
    financial: {
      investment: financial.investment,
      monthlyRevenue: financial.monthlyRevenue,
      monthlyExpenses: financial.monthlyExpenses,
      monthlyProfit: financial.monthlyProfit,
      breakEvenMonths: financial.breakEvenMonths
    },
    schemes: schemes.map(s => ({
      name: s.name,
      match: s.match
    }))
  };
}

/**
 * Get demo AI response based on business and scores
 */
function getDemoResponse(payload) {
  const { business, scores, financial, market, schemes } = payload;
  const schemeNames = schemes.map(s => s.name).join(", ");

  return {
    mode: "demo",
    summary: `Based on the available sample data, the selected locality shows ${scores.overall >= 70 ? "relatively strong" : scores.overall >= 50 ? "moderate" : "concerning"} potential for a ${business.name.toLowerCase()}. The estimated target customer base is ${market.targetPopulation >= 8000 ? "significant" : "moderate"} and the required investment of ₹${financial.investment.toLocaleString('en-IN')} ${financial.investment <= payload.user.investment ? "falls within" : "exceeds"} the user's budget.`,
    whyItMayWork: [
      `The demand score of ${scores.demand}/100 indicates ${scores.demand >= 70 ? "strong" : scores.demand >= 50 ? "moderate" : "weak"} customer interest in this category.`,
      `Market reach score of ${scores.marketReach}/100 suggests ${scores.marketReach >= 70 ? "good" : "limited"} accessibility to target customers.`,
      `Financial viability score of ${scores.financialViability}/100 indicates ${scores.financialViability >= 70 ? "healthy" : "concerning"} profit potential.`,
      `Demographic fit of ${scores.demographicFit}/100 shows ${scores.demographicFit >= 70 ? "strong" : "moderate"} alignment with user skills.`
    ],
    risks: [
      `Competition score of ${scores.competition}/100 indicates ${scores.competition >= 70 ? "manageable" : "high"} competitive pressure in the area.`,
      `${market.competitorsWithin1km} competitors within 1 km may affect customer acquisition.`,
      `Market access score of ${scores.marketAccess}/100 suggests ${scores.marketAccess >= 70 ? "good" : "challenging"} location accessibility.`,
      "All scores are estimates based on sample data and may not reflect actual market conditions."
    ],
    financialObservations: [
      `Estimated monthly profit: ₹${financial.monthlyProfit.toLocaleString('en-IN')}`,
      `Break-even period: ${financial.breakEvenMonths} months`,
      `Investment of ₹${financial.investment.toLocaleString('en-IN')} is ${financial.investment <= payload.user.investment ? "within" : "above"} available budget`,
      `Monthly revenue potential of ₹${financial.monthlyRevenue.toLocaleString('en-IN')} against expenses of ₹${financial.monthlyExpenses.toLocaleString('en-IN')}`
    ],
    marketObservations: [
      `Target population of ${market.targetPopulation.toLocaleString('en-IN')} in the service area`,
      `Reachable population estimated at ${market.reachablePopulation.toLocaleString('en-IN')}`,
      `${market.competitorsWithin3km} competitors within 3 km radius`,
      `Competition density is ${market.competitorsWithin1km > 5 ? "high" : market.competitorsWithin1km > 2 ? "moderate" : "low"}`
    ],
    schemeObservations: [
      `Relevant schemes: ${schemeNames}`,
      "Scheme information is sample data - verify from official sources before applying",
      "Eligibility criteria may change - check current requirements"
    ],
    nextSteps: [
      "Validate actual customer demand through surveys or pilot testing",
      "Analyze competitor pricing and service quality",
      "Calculate exact rental and operational costs",
      "Verify government scheme eligibility from official portals",
      "Create a detailed business plan with conservative estimates",
      "Consider starting small and scaling based on results"
    ]
  };
}

/**
 * Get demo chat response based on question - intelligent context-aware responses
 */
function getDemoChatResponse(question, context) {
  const q = question.toLowerCase();
  const biz = context.business;
  const scores = context.scores;
  const financial = context.financial;
  const market = context.market;

  // Demand score questions
  if (q.includes("demand") && (q.includes("score") || q.includes("high") || q.includes("why"))) {
    return `Your demand score is ${scores.demand}/100 in this prototype. The main factors are the estimated target population of ${market.targetPopulation.toLocaleString('en-IN')} and the reachable population of approximately ${market.reachablePopulation.toLocaleString('en-IN')}. These are sample estimates, so actual local demand should be validated before investing.`;
  }

  // Risk questions
  if (q.includes("risk") || q.includes("concern") || q.includes("danger")) {
    return `The main risks visible in the current analysis are competition, uncertainty in estimated demand and operating costs. There are ${market.competitorsWithin1km} similar competitors within the sample 1 km area. You should validate competitor pricing, customer demand, rent and delivery costs locally.`;
  }

  // Affordability questions
  if (q.includes("afford") || q.includes("budget") || q.includes("can i")) {
    return `Your selected investment is ₹${financial.investment.toLocaleString('en-IN')}. The estimated initial investment for ${biz.name} is within that amount in the current prototype. The financial analysis estimates monthly revenue of ₹${financial.monthlyRevenue.toLocaleString('en-IN')} and expenses of ₹${financial.monthlyExpenses.toLocaleString('en-IN')}. These are estimates, not guaranteed results.`;
  }

  // Competition questions
  if (q.includes("competition") || q.includes("competitor")) {
    return `The prototype currently shows ${market.competitorsWithin1km} competitors within 1 km and ${market.competitorsWithin3km} within 3 km. This produces the current competition indicator of ${scores.competition}/100. The actual competitive environment should be verified using current local business data.`;
  }

  // Verification questions
  if (q.includes("verify") || q.includes("before starting") || q.includes("validate") || q.includes("check")) {
    return `Before starting, you should verify: 1) Actual customer demand through surveys or a small pilot. 2) Competitor pricing and service quality. 3) Exact rental costs in your preferred location. 4) Delivery or transportation costs. 5) Government scheme eligibility from official sources. 6) Local licenses and permits required.`;
  }

  // Financial questions
  if (q.includes("financial") || q.includes("profit") || q.includes("revenue") || q.includes("money") || q.includes("earn")) {
    return `Financial analysis shows: Monthly revenue estimate: ₹${financial.monthlyRevenue.toLocaleString('en-IN')}, Monthly expenses: ₹${financial.monthlyExpenses.toLocaleString('en-IN')}, Estimated profit: ₹${financial.monthlyProfit.toLocaleString('en-IN')}, Break-even: ${financial.breakEvenMonths} months. These are estimates based on sample data and actual results may vary.`;
  }

  // Loan questions
  if (q.includes("loan") || q.includes("how much") || q.includes("finance")) {
    return `Based on your profile, you may need a loan of ₹${financial.investment.toLocaleString('en-IN')} for ${biz.name}. Your available investment is ₹${context.user.investment.toLocaleString('en-IN')}. Consider MUDRA loans (up to ₹10 lakh) or PMEGP scheme for collateral-free financing. The exact loan amount should be calculated after finalizing your business plan.`;
  }

  // Scheme questions
  if (q.includes("scheme") || q.includes("government") || q.includes("subsidy")) {
    return `Relevant government schemes include: PMEGP (up to ₹50 lakh with subsidy), MUDRA (up to ₹10 lakh collateral-free), and state MSME schemes. Your eligibility depends on your category, location, and business type. Always verify current scheme status from official government portals before applying.`;
  }

  // Market reach questions
  if (q.includes("reach") || q.includes("market") || q.includes("customer")) {
    return `Your market reach score is ${scores.marketReach}/100. The estimated reachable population is ${market.reachablePopulation.toLocaleString('en-IN')} out of a total population of ${market.population.toLocaleString('en-IN')}. This suggests ${scores.marketReach >= 70 ? 'good' : 'moderate'} accessibility to target customers in your area.`;
  }

  // Overall/feasibility questions
  if (q.includes("overall") || q.includes("feasibility") || q.includes("score") || q.includes("worth")) {
    return `The overall feasibility score for ${biz.name} is ${scores.overall}/100. This is calculated from demand (${scores.demand}), competition (${scores.competition}), market reach (${scores.marketReach}), demographic fit (${scores.demographicFit}), market access (${scores.marketAccess}), and financial viability (${scores.financialViability}). This is an estimate based on sample data.`;
  }

  // Skill fit questions
  if (q.includes("skill") || q.includes("fit") || q.includes("experience")) {
    return `Your demographic fit score is ${scores.demographicFit}/100. This is based on your skills (${(context.user.skills || []).join(', ')}) and experience level (${context.user.experience}). ${scores.demographicFit >= 70 ? 'Your profile shows strong alignment with this business.' : 'Consider developing additional skills for this business type.'}`;
  }

  // Default response
  return `Based on the available sample data for ${biz.name} in ${context.location.city}, I can provide general guidance. The overall feasibility score is ${scores.overall}/100. For specific questions about demand, competition, finances, or schemes, please ask and I'll provide relevant insights from the structured data.`;
}

/**
 * Main AI function - gets analysis response
 */
export async function getAIAnalysis(payload) {
  if (AI_MODE === "demo") {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getDemoResponse(payload);
  }

  // API mode - would call actual LLM
  // WARNING: In production, this should go through a backend proxy
  try {
    const response = await fetch(API_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(payload) }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error("API call failed");
    }

    const data = await response.json();
    return {
      mode: "api",
      content: data.choices[0].message.content
    };
  } catch (error) {
    console.error("AI API error:", error);
    // Fallback to demo mode on error
    return getDemoResponse(payload);
  }
}

/**
 * Get AI chat response
 */
export async function getAIChatResponse(question, context) {
  if (AI_MODE === "demo") {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      mode: "demo",
      response: getDemoChatResponse(question, context)
    };
  }

  // API mode
  try {
    const response = await fetch(API_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Context: ${JSON.stringify(context)}\n\nQuestion: ${question}` }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error("API call failed");
    }

    const data = await response.json();
    return {
      mode: "api",
      response: data.choices[0].message.content
    };
  } catch (error) {
    console.error("AI API error:", error);
    return {
      mode: "demo",
      response: getDemoChatResponse(question, context)
    };
  }
}

/**
 * Get voice assistant response
 */
export async function getVoiceResponse(transcript, userProfile) {
  const lower = transcript.toLowerCase();

  if (lower.includes("analyze") || lower.includes("business")) {
    return {
      response: "I can help you analyze a business. Would you like to analyze an existing business idea or discover new ones?",
      action: "navigate",
      target: "/analyze"
    };
  }

  if (lower.includes("idea") || lower.includes("suggest") || lower.includes("find")) {
    return {
      response: "Based on your profile, I can suggest suitable businesses for your locality and budget. Let me take you to the ideas page.",
      action: "navigate",
      target: "/ideas"
    };
  }

  if (lower.includes("scheme") || lower.includes("government")) {
    return {
      response: "I can show you relevant government schemes. Let me navigate you there.",
      action: "navigate",
      target: "/schemes"
    };
  }

  if (lower.includes("financial") || lower.includes("finance") || lower.includes("loan")) {
    return {
      response: "I can help you with financial analysis. Let me take you to the financial section.",
      action: "navigate",
      target: "/financial"
    };
  }

  if (lower.includes("dashboard") || lower.includes("home")) {
    return {
      response: "Taking you to the dashboard.",
      action: "navigate",
      target: "/dashboard"
    };
  }

  if (lower.includes("market") || lower.includes("location")) {
    return {
      response: "I can show you market analysis for your area. Let me navigate you there.",
      action: "navigate",
      target: "/market"
    };
  }

  // Default response
  return {
    response: `Based on your available investment of ₹${userProfile.investment.toLocaleString('en-IN')}, I can analyze suitable businesses in your locality. Would you like me to suggest some?`,
    action: "none"
  };
}

/**
 * Get AI response for chat - main entry point
 * Handles both demo and API modes with graceful fallback
 */
export async function getAIResponse(question, context) {
  if (AI_MODE === "demo") {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      mode: "demo",
      response: getDemoChatResponse(question, context)
    };
  }

  // API mode
  try {
    const response = await fetch(API_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Context: ${JSON.stringify(context)}\n\nQuestion: ${question}` }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error("API call failed");
    }

    const data = await response.json();
    return {
      mode: "api",
      response: data.choices[0].message.content
    };
  } catch (error) {
    console.error("AI API error:", error);
    // Graceful fallback to demo mode
    return {
      mode: "demo",
      response: getDemoChatResponse(question, context)
    };
  }
}

export { AI_MODE, SYSTEM_PROMPT };
