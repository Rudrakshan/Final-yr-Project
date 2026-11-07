/**
 * EcoPredict Renewable Energy Analysis Service (Frontend Mock Boundary)
 * 
 * IMPORTANT:
 * - This is FRONTEND ONLY.
 * - Do NOT implement the ML model here.
 * - Do NOT implement backend or connect real environmental APIs here.
 * - This establishes the clean frontend-to-analysis boundary for future ML/backend models.
 */

export async function analyzeRenewableEnergy(assessmentData) {
  // Simulate network/pipeline processing delay (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { location, useCase, installation, grid, priorities, electricity } = assessmentData || {};

  // Intelligent mock recommendation based on assessment inputs
  const hasFrequentOutages = grid?.reliability === 'Frequent outages' || grid?.backupRequired?.includes('Yes');
  const space = installation?.spaceType || '';
  const isSolarDominant = space.toLowerCase().includes('roof') || !space.toLowerCase().includes('land');
  const userPriorities = priorities || [];
  
  let primaryTech = 'Solar PV';
  let primaryDesc = 'Solar Photovoltaic system configured for high self-consumption and long-term energy yield.';

  if (hasFrequentOutages || userPriorities.includes('Keep power available during outages') || userPriorities.includes('Reduce dependence on the grid')) {
    primaryTech = 'Solar & Battery Storage Hybrid';
    primaryDesc = 'Hybrid Solar PV combined with an intelligent energy storage battery system for seamless backup and peak shaving.';
  } else if (space === 'Open land' && (useCase === 'Industry' || useCase === 'Agriculture')) {
    primaryTech = 'Ground-Mounted Solar & Wind Hybrid';
    primaryDesc = 'Dual-generation clean hybrid utilizing ground array solar alongside micro-wind turbines for day-and-night generation.';
  }

  const locationLabel = location?.name 
    ? `${location.name}${location.region ? `, ${location.region}` : ''}`
    : 'Selected Location';

  const mockRenewableResult = {
    locationName: locationLabel,
    country: location?.country || 'India',
    timestamp: new Date().toISOString(),
    primaryRecommendation: {
      technology: primaryTech,
      suitabilityRating: 'High suitability',
      suitabilityScore: 88,
      description: primaryDesc,
      disclaimer: 'Example result — real environmental and ML analysis will be connected later.',
      keyFactors: [
        {
          title: 'Strong solar potential',
          detail: 'Geographic location features favorable clear-sky irradiance and solar exposure.'
        },
        {
          title: 'Suitable energy-use pattern',
          detail: assessmentData.usagePattern 
            ? `Aligns with your peak consumption pattern (${assessmentData.usagePattern.toLowerCase()}).` 
            : 'Favorable alignment between daytime generation and operational load.'
        },
        {
          title: 'Suitable installation space',
          detail: space 
            ? `Optimized for ${space.toLowerCase()} deployment.` 
            : 'Sufficient physical footprint for modular panel deployment.'
        },
        {
          title: hasFrequentOutages ? 'Reliable backup protection' : 'Potential to reduce grid dependence',
          detail: hasFrequentOutages 
            ? 'Protects critical equipment during grid disruptions and voltage drops.' 
            : 'Substantially reduces monthly utility expenditure and tariff volatility.'
        }
      ]
    },
    alternativeOptions: [
      {
        technology: 'Solar PV (Standard Grid-Tied)',
        suitability: 'High suitability',
        score: 84,
        description: 'Direct grid-tied solar photovoltaic installation for immediate utility offset without dedicated battery banks.'
      },
      {
        technology: 'Wind Energy (Micro-Turbine)',
        suitability: 'Moderate suitability',
        score: 64,
        description: 'Complementary aerodynamic wind generation, effective during monsoon seasons and nocturnal breeze cycles.'
      },
      {
        technology: 'Solar & Biomass Hybrid',
        suitability: 'Moderate suitability',
        score: 58,
        description: 'Combines diurnal solar yield with dispatchable organic feedstock or agro-waste power generation.'
      }
    ],
    estimatedMetrics: {
      annualOffsetEstimateKWh: electricity?.monthlyConsumptionKWh 
        ? Math.round(Number(electricity.monthlyConsumptionKWh) * 12 * 0.85)
        : 6800,
      estimatedPaybackYears: '4.2 – 5.5 years',
      carbonReductionTonnesPerYear: '4.8 – 6.2 tonnes'
    }
  };

  return mockRenewableResult;
}
