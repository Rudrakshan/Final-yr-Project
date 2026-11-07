// EcoPredict Mock Services Data & Intelligence Engine
// Modular business logic ready for ML model APIs and backend microservices.

// -------------------------------------------------------------
// SERVICE 1: RENEWABLE ENERGY DECISION ADVISOR
// -------------------------------------------------------------

export function calculateRenewableEnergyPotential(location, powerTarget = 'Home', priority = 'Maximum renewable generation') {
  // Base potential derived from solar irradiation by latitude and regional factors
  const latAbs = Math.abs(location.latitude || 11);
  const isTropical = latAbs < 25;
  const isCoastal = ['Chennai', 'Mumbai', 'San Francisco', 'Sydney', 'Singapore'].includes(location.name);
  const isHighElevation = (location.elevation || 100) > 600;

  // Solar suitability
  let solarScore = Math.min(96, Math.max(50, Math.round(92 - (latAbs * 0.5) + ((location.baseTemp || 25) > 26 ? 6 : 0))));
  // Wind suitability
  let windScore = Math.min(94, Math.max(42, Math.round(isCoastal ? 88 : (isHighElevation ? 82 : 62))));
  // Hydro suitability
  let hydroScore = Math.min(92, Math.max(25, Math.round(((location.baseRainfall || 700) / 2500) * 85)));
  // Biomass suitability
  let biomassScore = Math.min(88, Math.max(30, Math.round(isTropical ? 76 : 58)));

  // Adjust by user priority
  if (priority === 'Lower cost') {
    solarScore += 3;
    windScore -= 2;
  } else if (priority === 'Energy independence') {
    solarScore += 2;
    windScore += 4;
  } else if (priority === 'Reliability') {
    biomassScore += 6;
  }

  // Calculate weighted overall score
  const overallSuitability = Math.round((solarScore * 0.38) + (windScore * 0.32) + (biomassScore * 0.18) + (hydroScore * 0.12));

  return {
    locationName: `${location.name}, ${location.country}`,
    overallSuitability,
    recommendedTechnology: solarScore >= windScore ? 'Solar & Energy Storage Hybrid' : 'Wind & Solar Hybrid Microgrid',
    technologies: [
      {
        id: 'solar',
        name: 'Solar Photovoltaic',
        suitability: solarScore,
        availability: solarScore > 75 ? 'High (5.4 - 6.2 kWh/m²/day)' : 'Moderate (3.8 - 4.5 kWh/m²/day)',
        keyFactors: [
          'Strong global horizontal solar irradiance',
          'High clear-sky day ratio across peak seasons',
          'Modular rooftop or ground-mount deployment'
        ],
        limitations: [
          'Output drop during heavy monsoon overcast',
          'Requires intelligent battery storage for night baseload'
        ],
        idealFor: ['Rooftops', 'Commercial Sheds', 'Off-grid Systems']
      },
      {
        id: 'wind',
        name: 'Wind Energy',
        suitability: windScore,
        availability: windScore > 75 ? 'Optimal (6.2 - 8.1 m/s average)' : 'Moderate (3.5 - 5.0 m/s average)',
        keyFactors: [
          'Consistent wind corridors and diurnal thermals',
          'Complements solar generation during night hours',
          'High capacity factor during monsoon/storm fronts'
        ],
        limitations: [
          'Turbine height restrictions in urban zones',
          'Seasonal turbulence variability'
        ],
        idealFor: ['Open Terrains', 'Coastal Belts', 'Elevated Ridges']
      },
      {
        id: 'biomass',
        name: 'Biomass & Organic Waste',
        suitability: biomassScore,
        availability: biomassScore > 70 ? 'Plentiful Agro-Feedstock Supply' : 'Limited Local Waste Stream',
        keyFactors: [
          'Dispatchable on-demand power generation',
          'Utilizes agricultural residue and organic urban waste',
          'Not dependent on weather conditions'
        ],
        limitations: [
          'Feedstock transportation logistics and storage cost',
          'Higher initial capital cost for small-scale plants'
        ],
        idealFor: ['Agri-Clusters', 'Dairy & Food Processing', 'Continuous Baseload']
      },
      {
        id: 'hydro',
        name: 'Micro-Hydro Systems',
        suitability: hydroScore,
        availability: hydroScore > 65 ? 'Perennial Stream Flow / Head' : 'Seasonal / Low Run-of-River Potential',
        keyFactors: [
          'Extremely low operating and maintenance overhead',
          'High continuous generation efficiency where head exists',
          'Decades-long equipment operational lifespan'
        ],
        limitations: [
          'Strict topographic head & river gradient requirement',
          'Monsoon surge risk vs dry-season flow depletion'
        ],
        idealFor: ['Hilly Terrains', 'Canal Drops', 'Riverbanks']
      }
    ],
    whyExplanation: `Based on ${location.name}'s geographic location in the ${location.climateZone || 'tropical'} zone with an elevation of ${location.elevation || 350}m and annual baseline rainfall of ${location.baseRainfall || 750}mm, Solar PV yields the most predictable yield profile. Coupling solar with ${windScore > 65 ? 'wind micro-turbines' : 'battery storage'} provides the strongest year-round energy availability for ${powerTarget.toLowerCase()} requirements.`,
    scenarioTip: 'You can test how rising temperatures or changing seasonal cloud cover affect solar panel efficiency in the EcoPredict Scenario Lab.'
  };
}

// -------------------------------------------------------------
// SERVICE 2: ENVIRONMENTAL SITE SUITABILITY
// -------------------------------------------------------------

export function calculateSiteSuitability(location, activityType = 'Commercial') {
  // Activity sensitivity weights
  const weights = {
    Residential: { air: 0.25, heat: 0.20, flood: 0.25, water: 0.20, renewable: 0.10 },
    Commercial: { air: 0.15, heat: 0.15, flood: 0.30, water: 0.20, renewable: 0.20 },
    Industrial: { air: 0.10, heat: 0.15, flood: 0.30, water: 0.30, renewable: 0.15 },
    Agriculture: { air: 0.10, heat: 0.25, flood: 0.20, water: 0.35, renewable: 0.10 },
    Infrastructure: { air: 0.10, heat: 0.20, flood: 0.40, water: 0.15, renewable: 0.15 },
    'Renewable Installation': { air: 0.05, heat: 0.15, flood: 0.20, water: 0.10, renewable: 0.50 },
  }[activityType] || { air: 0.2, heat: 0.2, flood: 0.2, water: 0.2, renewable: 0.2 };

  // Individual environmental profile scores (0 to 100, higher is more favorable)
  const airQualityScore = Math.max(30, Math.min(95, 100 - Math.round((location.baseAirQuality || 60) * 0.45)));
  const heatResilienceScore = Math.max(35, Math.min(92, 100 - Math.round(((location.baseTemp || 25) - 15) * 3.2)));
  const floodSafetyScore = Math.min(95, Math.max(40, (location.elevation || 100) > 200 ? 86 : 64));
  const waterAvailabilityScore = Math.min(94, Math.max(45, Math.round(((location.baseRainfall || 700) / 1800) * 75) + 15));
  const renewablePotentialScore = location.renewableSuitability || 78;

  const overallScore = Math.round(
    airQualityScore * weights.air +
    heatResilienceScore * weights.heat +
    floodSafetyScore * weights.flood +
    waterAvailabilityScore * weights.water +
    renewablePotentialScore * weights.renewable
  );

  const strengths = [];
  const concerns = [];

  if (airQualityScore >= 65) strengths.push('Favorable regional air quality index with minimal particulate stagnation.');
  else concerns.push('Elevated seasonal particulate matter; may require high-efficiency indoor filtration.');

  if (floodSafetyScore >= 75) strengths.push('Elevation gradient and natural watershed minimize severe pluvial inundation risk.');
  else concerns.push('Low terrain elevation presents localized waterlogging risks during storm surges.');

  if (renewablePotentialScore >= 75) strengths.push('Excellent on-site renewable energy capture profile (solar & auxiliary).');
  if (waterAvailabilityScore < 60) concerns.push('Groundwater table stress requires rainwater harvesting and water recycling systems.');

  return {
    locationName: `${location.name}, ${location.country}`,
    activityType,
    overallScore,
    profileMetrics: [
      { name: 'Air Quality Quality', score: airQualityScore, status: airQualityScore > 70 ? 'Good' : 'Moderate', icon: 'Wind' },
      { name: 'Thermal Comfort & Heat', score: heatResilienceScore, status: heatResilienceScore > 65 ? 'Moderate Stress' : 'High Heat Exposure', icon: 'Thermometer' },
      { name: 'Flood & Inundation Safety', score: floodSafetyScore, status: floodSafetyScore > 75 ? 'Low Risk' : 'Moderate Inundation Risk', icon: 'CloudRain' },
      { name: 'Water Resource Security', score: waterAvailabilityScore, status: waterAvailabilityScore > 65 ? 'Secure' : 'Needs Conservation', icon: 'Droplets' },
      { name: 'Renewable Integration', score: renewablePotentialScore, status: 'High Feasibility', icon: 'Sparkles' }
    ],
    strengths,
    concerns,
    keyFactors: [
      `Zoning classification alignment with ${location.climateZone || 'regional'} climate benchmarks`,
      'Drainage basin connectivity and stormwater discharge capacity',
      'Microclimate heat retention influenced by surrounding topography'
    ],
    disclaimer: 'Prototype Decision Support: Scores reflect preliminary environmental synthesis for project planning and should be combined with site-specific geological surveys.'
  };
}

// -------------------------------------------------------------
// SERVICE 3: ENVIRONMENTAL RISK & FUTURE PREDICTION
// -------------------------------------------------------------

export function calculateRiskAndFuturePredictions(location) {
  const baseT = location.baseTemp || 26;
  const baseR = location.baseRainfall || 750;
  const baseAQ = location.baseAirQuality || 65;

  return {
    locationName: `${location.name}, ${location.country}`,
    riskHeadline: 'What Could Happen Here?',
    timelineProjections: [
      { year: '2024', tempDelta: '+0.0°C', avgTemp: baseT, extremeHeatDays: 24, heavyRainEvents: 6, aqiIndex: baseAQ },
      { year: '2030', tempDelta: '+0.8°C', avgTemp: Number((baseT + 0.8).toFixed(1)), extremeHeatDays: 31, heavyRainEvents: 8, aqiIndex: Math.round(baseAQ * 1.06) },
      { year: '2040', tempDelta: '+1.5°C', avgTemp: Number((baseT + 1.5).toFixed(1)), extremeHeatDays: 42, heavyRainEvents: 11, aqiIndex: Math.round(baseAQ * 1.14) },
      { year: '2050', tempDelta: '+2.3°C', avgTemp: Number((baseT + 2.3).toFixed(1)), extremeHeatDays: 56, heavyRainEvents: 14, aqiIndex: Math.round(baseAQ * 1.22) }
    ],
    riskCategories: [
      {
        id: 'heat',
        title: 'Extreme Heat & Thermal Stress',
        level: baseT > 27 ? 'High' : 'Moderate',
        color: '#f87171',
        trend: '+1.5°C to +2.3°C projected warming by 2050',
        description: 'Rising summer peak temperatures increase cooling energy loads and surface evaporation rates.',
        impactMetric: '32 additional high-heat days per year'
      },
      {
        id: 'rainfall',
        title: 'Heavy Rainfall & Flash Runoff',
        level: baseR > 1200 ? 'High' : 'Moderate',
        color: '#38bdf8',
        trend: '+18% intensity in short-duration downpours',
        description: 'Precipitation is projected to concentrate into fewer, more intense storm bursts rather than gradual showers.',
        impactMetric: 'Potential flash waterlogging in unpaved watersheds'
      },
      {
        id: 'air',
        title: 'Air Quality Deterioration',
        level: baseAQ > 80 ? 'Elevated' : 'Moderate',
        color: '#fbbf24',
        trend: '+12% increase in particulate stagnation windows',
        description: 'Atmospheric boundary layer compression in dry months leads to prolonged particulate accumulation.',
        impactMetric: 'Seasonal AQI spikes during dry transitions'
      },
      {
        id: 'drought',
        title: 'Drought & Soil Moisture Deficit',
        level: baseR < 800 ? 'High' : 'Low',
        color: '#fb923c',
        trend: 'Earlier dry season onset by ~14 days',
        description: 'Higher evaporation coefficients reduce topsoil moisture retention without artificial recharge.',
        impactMetric: 'Increased irrigation & groundwater dependency'
      }
    ],
    historicalVsProjectedSummary: `Historical data over 30 years shows a gradual upward drift in ${location.name}'s ambient temperature (+0.18°C/decade). Forward climate modeling indicates this warming rate will accelerate, with rainfall seasonality becoming more volatile by 2040.`
  };
}

// -------------------------------------------------------------
// SERVICE 4: ECOPREDICT SCENARIO LAB ("WHAT IF?")
// -------------------------------------------------------------

export function calculateScenarioImpact(location, { tempDelta = 0, rainfallDelta = 0, energyDemandDelta = 0, solarAvailabilityDelta = 0 }) {
  // Baseline values
  const baseTemp = location.baseTemp || 26;
  const baseRainfall = location.baseRainfall || 800;
  const baseRenewableSuitability = location.renewableSuitability || 78;

  // New simulated values
  const simulatedTemp = Number((baseTemp + tempDelta).toFixed(1));
  const simulatedRainfall = Math.round(baseRainfall * (1 + rainfallDelta / 100));

  // Photovoltaic temperature coefficient: panels lose ~0.4% efficiency per degree above 25°C
  const heatEfficiencyPenalty = Math.max(0, (simulatedTemp - 25) * 0.4);
  const solarFactor = (1 + solarAvailabilityDelta / 100) * (1 - heatEfficiencyPenalty / 100);

  // Simulated Renewable Potential
  const simulatedRenewableScore = Math.min(99, Math.max(35, Math.round(baseRenewableSuitability * solarFactor - (energyDemandDelta * 0.12))));

  // Heat Risk Delta
  const heatRiskScore = Math.min(100, Math.max(10, Math.round(45 + tempDelta * 11)));
  // Flood Risk Delta (heavy rainfall increases flood risk)
  const floodRiskScore = Math.min(100, Math.max(10, Math.round(40 + (rainfallDelta > 0 ? rainfallDelta * 0.8 : rainfallDelta * 0.3))));
  // Water Security Index
  const waterSecurityScore = Math.min(100, Math.max(15, Math.round(65 + rainfallDelta * 0.5 - tempDelta * 4)));

  return {
    baseline: {
      temperature: `${baseTemp}°C`,
      rainfall: `${baseRainfall} mm/yr`,
      renewableScore: baseRenewableSuitability,
      gridStrain: 'Normal (Base demand 100%)',
      coolingDegreeDays: 'Moderate baseline'
    },
    scenario: {
      temperature: `${simulatedTemp}°C (${tempDelta >= 0 ? '+' : ''}${tempDelta}°C)`,
      rainfall: `${simulatedRainfall} mm/yr (${rainfallDelta >= 0 ? '+' : ''}${rainfallDelta}%)`,
      renewableScore: simulatedRenewableScore,
      scoreDelta: simulatedRenewableScore - baseRenewableSuitability,
      gridStrain: energyDemandDelta > 0 ? `Elevated (+${energyDemandDelta}% demand peak)` : 'Standard Load',
      heatRiskScore,
      floodRiskScore,
      waterSecurityScore
    },
    insights: [
      tempDelta > 2
        ? `A ${tempDelta}°C warming triggers higher AC power consumption while reducing solar PV cell conversion efficiency by ~${heatEfficiencyPenalty.toFixed(1)}%.`
        : `Thermal conditions remain within manageable bounds for solar and wind equipment.`,
      rainfallDelta < -15
        ? `A ${Math.abs(rainfallDelta)}% reduction in annual precipitation lowers groundwater recharge, increasing cooling tower and agricultural stress.`
        : rainfallDelta > 20
        ? `A +${rainfallDelta}% surge in rainfall demands upgraded stormwater drainage but boosts seasonal hydro and biomass potential.`
        : `Rainfall shifts remain within typical cyclical buffering capacity.`
    ]
  };
}

// -------------------------------------------------------------
// CONTEXTUAL AI ASSISTANT RESPONSES
// -------------------------------------------------------------

export function getAIContextualResponse(query, location, serviceName, serviceData) {
  const q = query.toLowerCase();

  if (q.includes('solar') || q.includes('why solar') || q.includes('recommended')) {
    return `In ${location.name}, solar PV scores highest because of consistent solar irradiation (~5.6 kWh/m²/day) and favorable clear-sky conditions across the region. Even factoring in seasonal cloud cover, solar provides the lowest levelized cost of energy (LCOE) compared to conventional alternatives.`;
  }

  if (q.includes('wind') || q.includes('why wind')) {
    return `Wind energy in ${location.name} is viable primarily in elevated or open terrain corridors where average wind speeds reach 6.2 m/s. However, urban topography or low seasonal winds can create turbulence, making wind a valuable hybrid secondary source rather than a standalone baseload.`;
  }

  if (q.includes('battery') || q.includes('storage')) {
    return `Adding battery energy storage (BESS) increases the self-consumption of your renewable system in ${location.name} from approximately 62% to over 91%, ensuring power continuity during peak evening demand and unexpected grid interruptions.`;
  }

  if (q.includes('monsoon') || q.includes('rain') || q.includes('flood')) {
    return `During the peak monsoon season in ${location.name}, solar generation drops by roughly 25-35% due to dense cloud cover. However, this period often coincides with peak wind velocities and increased biomass availability, validating a multi-source hybrid approach.`;
  }

  if (q.includes('heat') || q.includes('temperature') || q.includes('climate')) {
    return `Forward climate trends indicate that ${location.name} could experience a +1.5°C to +2.3°C increase by 2050, resulting in roughly 30 additional high-heat days annually. Designing buildings with passive cooling and reflective roofing will be critical.`;
  }

  if (q.includes('site') || q.includes('suitability') || q.includes('activity')) {
    return `For the chosen activity in ${location.name}, the environmental profile highlights good terrain drainage and strong solar capture feasibility. The main factor to address is water resource management and heat mitigation during the summer peak.`;
  }

  return `Based on environmental intelligence for ${location.name} (${location.climateZone}), the conditions show high renewable viability alongside the need to build resilience against extreme heat and rainfall variance. Let me know if you would like me to dive deeper into energy options, site factors, or forward climate risks!`;
}
