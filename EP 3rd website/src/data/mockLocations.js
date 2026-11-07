// EcoPredict Geographic Database & Reverse Geocoding Utility
// Clean, modular mock data layer ready for future Google Maps / OpenStreetMap Geocoding API swap.

export const KNOWN_LOCATIONS = [
  {
    name: "Coimbatore",
    region: "Tamil Nadu",
    country: "India",
    latitude: 11.0168,
    longitude: 76.9558,
    climateZone: "Semi-Arid Tropical",
    elevation: 411,
    baseTemp: 28.5,
    baseRainfall: 680,
    baseAirQuality: 52,
    renewableSuitability: 78,
    primaryEnergy: "Solar & Wind",
    dominantRisks: ["Summer Heat Waves", "Groundwater Depletion"]
  },
  {
    name: "Bengaluru",
    region: "Karnataka",
    country: "India",
    latitude: 12.9716,
    longitude: 77.5946,
    climateZone: "Tropical Savanna",
    elevation: 920,
    baseTemp: 24.2,
    baseRainfall: 970,
    baseAirQuality: 68,
    renewableSuitability: 82,
    primaryEnergy: "Solar & Biomass",
    dominantRisks: ["Urban Heat Island", "Flash Waterlogging"]
  },
  {
    name: "Chennai",
    region: "Tamil Nadu",
    country: "India",
    latitude: 13.0827,
    longitude: 80.2707,
    climateZone: "Tropical Wet and Dry",
    elevation: 6,
    baseTemp: 30.1,
    baseRainfall: 1400,
    baseAirQuality: 74,
    renewableSuitability: 74,
    primaryEnergy: "Solar & Offshore Wind",
    dominantRisks: ["Coastal Inundation", "Cyclone Rainfall", "Heat Stress"]
  },
  {
    name: "Mumbai",
    region: "Maharashtra",
    country: "India",
    latitude: 19.0760,
    longitude: 72.8777,
    climateZone: "Tropical Monsoonal",
    elevation: 14,
    baseTemp: 27.8,
    baseRainfall: 2420,
    baseAirQuality: 115,
    renewableSuitability: 69,
    primaryEnergy: "Solar & Rooftop Hybrid",
    dominantRisks: ["Monsoon Flooding", "Coastal Surge", "High Humidity"]
  },
  {
    name: "Delhi",
    region: "National Capital Region",
    country: "India",
    latitude: 28.6139,
    longitude: 77.2090,
    climateZone: "Hot Semi-Arid",
    elevation: 216,
    baseTemp: 25.6,
    baseRainfall: 790,
    baseAirQuality: 165,
    renewableSuitability: 76,
    primaryEnergy: "Solar & Waste-to-Energy",
    dominantRisks: ["Severe Air Quality", "Extreme Summer Heat", "Groundwater Stress"]
  },
  {
    name: "San Francisco",
    region: "California",
    country: "United States",
    latitude: 37.7749,
    longitude: -122.4194,
    climateZone: "Warm-Summer Mediterranean",
    elevation: 16,
    baseTemp: 14.8,
    baseRainfall: 600,
    baseAirQuality: 38,
    renewableSuitability: 85,
    primaryEnergy: "Wind & Solar",
    dominantRisks: ["Wildfire Smoke Drift", "Coastal Fog Variation"]
  },
  {
    name: "London",
    region: "Greater London",
    country: "United Kingdom",
    latitude: 51.5074,
    longitude: -0.1278,
    climateZone: "Temperate Oceanic",
    elevation: 25,
    baseTemp: 11.3,
    baseRainfall: 615,
    baseAirQuality: 42,
    renewableSuitability: 71,
    primaryEnergy: "Wind & Heat Pump Hybrid",
    dominantRisks: ["Riverine Flooding", "Summer Heat Spikes"]
  },
  {
    name: "Tokyo",
    region: "Kanto",
    country: "Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    climateZone: "Humid Subtropical",
    elevation: 40,
    baseTemp: 16.2,
    baseRainfall: 1530,
    baseAirQuality: 35,
    renewableSuitability: 73,
    primaryEnergy: "Solar & Geothermal",
    dominantRisks: ["Typhoon Precipitation", "Urban Heat"]
  },
  {
    name: "Singapore",
    region: "Central Region",
    country: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    climateZone: "Tropical Rainforest",
    elevation: 15,
    baseTemp: 27.6,
    baseRainfall: 2340,
    baseAirQuality: 45,
    renewableSuitability: 68,
    primaryEnergy: "Rooftop & Floating Solar",
    dominantRisks: ["Extreme Rainfall", "High Humidity", "Sea Level Rise"]
  },
  {
    name: "Sydney",
    region: "New South Wales",
    country: "Australia",
    latitude: -33.8688,
    longitude: 151.2093,
    climateZone: "Humid Subtropical",
    elevation: 39,
    baseTemp: 18.5,
    baseRainfall: 1215,
    baseAirQuality: 32,
    renewableSuitability: 88,
    primaryEnergy: "Solar & Wind",
    dominantRisks: ["Bushfire Proximity Risk", "Coastal Erosion"]
  },
  {
    name: "Berlin",
    region: "Berlin",
    country: "Germany",
    latitude: 52.5200,
    longitude: 13.4050,
    climateZone: "Oceanic",
    elevation: 34,
    baseTemp: 10.3,
    baseRainfall: 570,
    baseAirQuality: 36,
    renewableSuitability: 79,
    primaryEnergy: "Wind, Solar & Biomass",
    dominantRisks: ["Extended Dry Spells", "Summer Heat Waves"]
  },
  {
    name: "Cairo",
    region: "Cairo Governorate",
    country: "Egypt",
    latitude: 30.0444,
    longitude: 31.2357,
    climateZone: "Hot Desert",
    elevation: 23,
    baseTemp: 22.8,
    baseRainfall: 25,
    baseAirQuality: 98,
    renewableSuitability: 94,
    primaryEnergy: "Concentrated Solar & Wind",
    dominantRisks: ["Severe Water Scarcity", "Extreme Heat Events", "Dust Storms"]
  },
  {
    name: "Nairobi",
    region: "Nairobi County",
    country: "Kenya",
    latitude: -1.2921,
    longitude: 36.8219,
    climateZone: "Subtropical Highland",
    elevation: 1795,
    baseTemp: 19.4,
    baseRainfall: 1020,
    baseAirQuality: 48,
    renewableSuitability: 89,
    primaryEnergy: "Geothermal, Solar & Hydro",
    dominantRisks: ["Seasonal Flood Risk", "Rainfall Variability"]
  },
  {
    name: "Sao Paulo",
    region: "State of Sao Paulo",
    country: "Brazil",
    latitude: -23.5505,
    longitude: -46.6333,
    climateZone: "Humid Subtropical",
    elevation: 760,
    baseTemp: 20.1,
    baseRainfall: 1450,
    baseAirQuality: 58,
    renewableSuitability: 84,
    primaryEnergy: "Hydro, Biomass & Solar",
    dominantRisks: ["Intense Storm Runoff", "Seasonal Drought"]
  }
];

// Calculate Haversine distance in kilometers
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Reverse Geocode: Find nearest known city, or dynamically interpolate realistic environmental metadata
export function reverseGeocodeCoordinates(lat, lng) {
  let closest = KNOWN_LOCATIONS[0];
  let minDistance = Infinity;

  for (const loc of KNOWN_LOCATIONS) {
    const dist = getHaversineDistance(lat, lng, loc.latitude, loc.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  // If reasonably close to a known city (< 850 km), return the matched place
  if (minDistance < 850) {
    return {
      name: closest.name,
      region: closest.region,
      country: closest.country,
      latitude: Number(lat.toFixed(4)),
      longitude: Number(lng.toFixed(4)),
      climateZone: closest.climateZone,
      elevation: closest.elevation,
      baseTemp: closest.baseTemp,
      baseRainfall: closest.baseRainfall,
      baseAirQuality: closest.baseAirQuality,
      renewableSuitability: closest.renewableSuitability,
      primaryEnergy: closest.primaryEnergy,
      dominantRisks: closest.dominantRisks,
      distanceToCatalogCityKm: Math.round(minDistance)
    };
  }

  // Otherwise synthesize clean geographical descriptors based on latitude / longitude quadrants
  const isNorthern = lat >= 0;
  const hemisphere = isNorthern ? 'Northern' : 'Southern';
  const latAbs = Math.abs(lat);

  let inferredZone = 'Temperate Continental';
  let estimatedTemp = 18;
  if (latAbs < 23.5) {
    inferredZone = 'Tropical / Subtropical Zone';
    estimatedTemp = 27;
  } else if (latAbs > 60) {
    inferredZone = 'Subpolar / Boreal Zone';
    estimatedTemp = 4;
  } else {
    estimatedTemp = 16;
  }

  return {
    name: `${Math.abs(lat).toFixed(2)}°${isNorthern ? 'N' : 'S'}, ${Math.abs(lng).toFixed(2)}°${lng >= 0 ? 'E' : 'W'}`,
    region: `${hemisphere} Coordinates Sector`,
    country: "Global Coordinate",
    latitude: Number(lat.toFixed(4)),
    longitude: Number(lng.toFixed(4)),
    climateZone: inferredZone,
    elevation: 250,
    baseTemp: estimatedTemp,
    baseRainfall: 850,
    baseAirQuality: 40,
    renewableSuitability: 75,
    primaryEnergy: "Solar & Wind",
    dominantRisks: ["Seasonal Weather Variation", "Temperature Fluctuation"],
    distanceToCatalogCityKm: Math.round(minDistance)
  };
}

export const DEFAULT_LOCATION = KNOWN_LOCATIONS[0]; // Coimbatore, Tamil Nadu, India
