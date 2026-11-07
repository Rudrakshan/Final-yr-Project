import { KNOWN_LOCATIONS, reverseGeocodeCoordinates, DEFAULT_LOCATION } from '../data/mockLocations';

// In-memory cache for reverse geocode & search requests
const geocodeCache = new Map();
const searchCache = new Map();

/**
 * Searches for places matching a text query.
 * First queries the local environmental knowledge catalog,
 * then queries OpenStreetMap Nominatim with a short timeout and caching.
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();

  // 1. Instant local catalog matches
  const localMatches = KNOWN_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(cleanQuery) ||
    loc.region.toLowerCase().includes(cleanQuery) ||
    loc.country.toLowerCase().includes(cleanQuery)
  ).map(loc => ({
    id: `local-${loc.name}`,
    name: loc.name,
    region: loc.region,
    country: loc.country,
    displayName: `${loc.name}, ${loc.region}, ${loc.country}`,
    latitude: loc.latitude,
    longitude: loc.longitude,
    isCatalogLocation: true,
    climateZone: loc.climateZone,
    renewableSuitability: loc.renewableSuitability
  }));

  // Check cache for remote API results
  if (searchCache.has(cleanQuery)) {
    const cached = searchCache.get(cleanQuery);
    return mergeSearchResults(localMatches, cached);
  }

  // 2. Query Nominatim API with 3.5s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const remoteResults = data.map(item => {
        const address = item.address || {};
        const name = address.city || address.town || address.village || address.suburb || address.county || item.name || query;
        const region = address.state || address.region || address.county || '';
        const country = address.country || '';

        return {
          id: `osm-${item.place_id}`,
          name: name,
          region: region,
          country: country,
          displayName: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          isCatalogLocation: false
        };
      });

      searchCache.set(cleanQuery, remoteResults);
      return mergeSearchResults(localMatches, remoteResults);
    }
  } catch (err) {
    // Gracefully degrade to local catalog matches if offline or throttled
    console.debug('Nominatim search skipped or timed out, using catalog results:', err.message);
  }

  return localMatches;
}

/**
 * Merge local curated locations with OSM results, removing duplicates.
 */
function mergeSearchResults(localList, remoteList) {
  const seen = new Set();
  const combined = [];

  for (const item of localList) {
    const key = `${item.name.toLowerCase()}-${item.country.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(item);
    }
  }

  for (const item of remoteList) {
    const key = `${item.name.toLowerCase()}-${item.country.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(item);
    }
  }

  return combined.slice(0, 8);
}

/**
 * Reverse-geocodes coordinates (lat, lng).
 * Tries OpenStreetMap Nominatim for accurate address details,
 * and supplements with EcoPredict environmental baseline data.
 */
export async function reverseGeocode(latitude, longitude) {
  const lat = Number(latitude.toFixed(4));
  const lng = Number(longitude.toFixed(4));
  const cacheKey = `${lat},${lng}`;

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  // Base fallback from EcoPredict environmental catalog
  const catalogFallback = reverseGeocodeCoordinates(lat, lng);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const name = addr.city || addr.town || addr.village || addr.suburb || addr.neighbourhood || addr.county || catalogFallback.name;
        const region = addr.state || addr.region || addr.county || catalogFallback.region;
        const country = addr.country || catalogFallback.country;

        const resolved = {
          ...catalogFallback,
          name: name,
          region: region,
          country: country,
          latitude: lat,
          longitude: lng,
          displayName: data.display_name,
          isReverseGeocoded: true
        };

        geocodeCache.set(cacheKey, resolved);
        return resolved;
      }
    }
  } catch (err) {
    console.debug('Reverse geocoding API unreachable, using catalog interpolation:', err.message);
  }

  geocodeCache.set(cacheKey, catalogFallback);
  return catalogFallback;
}

/**
 * Detects current device location via HTML5 Geolocation API.
 */
export function getCurrentDeviceLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      },
      (err) => {
        let message = 'Unable to retrieve location.';
        if (err.code === 1) {
          message = 'Location access was denied. Please enable location permissions in your browser.';
        } else if (err.code === 2) {
          message = 'Location position is currently unavailable.';
        } else if (err.code === 3) {
          message = 'Location request timed out.';
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}
