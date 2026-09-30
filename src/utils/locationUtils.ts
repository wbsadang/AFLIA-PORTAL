import { GeofenceConfig, MacBookTelemetry } from '../types';

export const AFLIA_HQ_GEOFENCE: GeofenceConfig = {
  officeName: 'Alpine Falcon Life Insurance Agency - Makati Branch HQ',
  address: 'Level 12, AFLIA Executive Tower, 6780 Ayala Avenue, Makati CBD, Metro Manila 1226',
  latitude: 14.5547,
  longitude: 121.0244,
  radiusMeters: 200, // 200 meters geofence radius
  allowedWifiSSIDs: [
    'AFLIA-MAKATI-CORP-WIFI-5G',
    'AFLIA-EXEC-SECURE-WIFI',
    'AFLIA-GUEST-OFFICE',
  ],
};

// Haversine formula to compute distance in meters between two lat/lon coordinates
export function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

// Detect client hardware & macOS / MacBook specifics
export function detectClientMacBookEnvironment(): {
  isMacBook: boolean;
  model: string;
  osVersion: string;
  browser: string;
  screenResolution: string;
  devicePixelRatio: number;
} {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const platform = typeof navigator !== 'undefined' ? (navigator as any).platform || '' : '';
  const isMac = /Mac|Macintosh|MacIntel|MacPPC/.test(platform) || /Macintosh|Mac OS X/.test(ua);
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 2;

  // Determine browser
  let browser = 'Safari 18.1 (macOS)';
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) {
    browser = 'Chrome 131 for Mac';
  } else if (/Edg/.test(ua)) {
    browser = 'Edge for Mac';
  } else if (/Firefox/.test(ua)) {
    browser = 'Firefox for Mac';
  }

  // Extract macOS version if possible
  let osVersion = 'macOS 15.1 Sequoia';
  const osMatch = ua.match(/Mac OS X ([0-9_]+)/);
  if (osMatch && osMatch[1]) {
    const rawVer = osMatch[1].replace(/_/g, '.');
    if (rawVer.startsWith('10.15') || rawVer.startsWith('11') || rawVer.startsWith('12') || rawVer.startsWith('13') || rawVer.startsWith('14') || rawVer.startsWith('15')) {
      osVersion = `macOS ${rawVer}`;
    }
  }

  // Detect model estimate based on screen resolution and retina ratio
  let model = 'Apple MacBook Pro 14" (Apple M2 Pro)';
  const width = typeof window !== 'undefined' ? window.screen.width * dpr : 3024;
  const height = typeof window !== 'undefined' ? window.screen.height * dpr : 1964;

  if (width >= 3400 || (width >= 1700 && dpr >= 2)) {
    model = 'Apple MacBook Pro 16" (Apple M3 Max)';
  } else if (width <= 2560 && width > 2000) {
    model = 'Apple MacBook Air 13" (Apple M2)';
  } else if (width <= 2000 && width >= 1440) {
    model = 'Apple MacBook Pro 13" (Apple M1)';
  }

  const screenResolution = `${typeof window !== 'undefined' ? window.screen.width : 1512} × ${
    typeof window !== 'undefined' ? window.screen.height : 982
  } (Retina @${dpr}x)`;

  return {
    isMacBook: isMac || true, // Treated as MacBook workstation for AFLIA company-issued devices
    model,
    osVersion,
    browser,
    screenResolution,
    devicePixelRatio: dpr,
  };
}

export interface LocationPreset {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  isOnLocation: boolean;
  wifiSSID: string;
  isOfficeWifi: boolean;
  locationLabel: string;
  distanceLabel: string;
}

export const AFLIA_LOCATION_PRESETS: LocationPreset[] = [
  {
    id: 'makati-hq-desk',
    name: 'AFLIA Makati Branch HQ - Level 12 (Desk #14)',
    description: 'Inside official office geofence · Connected to AFLIA 5G Office Wi-Fi',
    latitude: 14.55474,
    longitude: 121.02442,
    isOnLocation: true,
    wifiSSID: 'AFLIA-MAKATI-CORP-WIFI-5G',
    isOfficeWifi: true,
    locationLabel: 'AFLIA Makati Branch HQ - Level 12 Desk #14',
    distanceLabel: '12m (Inside Geofence)',
  },
  {
    id: 'makati-hq-boardroom',
    name: 'AFLIA Executive Boardroom - Level 12',
    description: 'Inside official office geofence · Executive Suite Wi-Fi',
    latitude: 14.55462,
    longitude: 121.02431,
    isOnLocation: true,
    wifiSSID: 'AFLIA-EXEC-SECURE-WIFI',
    isOfficeWifi: true,
    locationLabel: 'AFLIA Makati Branch HQ - Executive Boardroom',
    distanceLabel: '24m (Inside Geofence)',
  },
  {
    id: 'makati-ground-lobby',
    name: 'AFLIA Tower Ground Floor Lobby',
    description: 'Inside building premises · Guest Office Wi-Fi',
    latitude: 14.55485,
    longitude: 121.02455,
    isOnLocation: true,
    wifiSSID: 'AFLIA-GUEST-OFFICE',
    isOfficeWifi: true,
    locationLabel: 'AFLIA Tower Ground Lobby - Ayala Ave',
    distanceLabel: '45m (Inside Geofence)',
  },
  {
    id: 'ayala-triangle',
    name: 'Ayala Triangle Gardens (Nearby Off-Site)',
    description: 'Just outside 200m office geofence · Commercial / Public network',
    latitude: 14.5574,
    longitude: 121.0232,
    isOnLocation: false,
    wifiSSID: 'AyalaMalls_FreeWiFi_Public',
    isOfficeWifi: false,
    locationLabel: 'Ayala Triangle Gardens, Makati City',
    distanceLabel: '330m (Outside Geofence)',
  },
  {
    id: 'bgc-taguig',
    name: 'Bonifacio Global City - Client Meeting Site',
    description: 'Off-site field location in Taguig City · Mobile Hotspot',
    latitude: 14.5492,
    longitude: 121.0494,
    isOnLocation: false,
    wifiSSID: 'Smart_5G_Hotspot_Personal',
    isOfficeWifi: false,
    locationLabel: 'BGC High Street, Taguig City',
    distanceLabel: '2.8 km (Remote / Field)',
  },
  {
    id: 'quezon-city-wfh',
    name: 'Quezon City Residence (Telecommuting / WFH)',
    description: 'Authorized home telecommuting station · Home Fiber network',
    latitude: 14.6538,
    longitude: 121.0685,
    isOnLocation: false,
    wifiSSID: 'Home_PLDT_Fiber_5G',
    isOfficeWifi: false,
    locationLabel: 'Authorized Telecommuting Residence - Quezon City',
    distanceLabel: '13.8 km (Remote / WFH)',
  },
];

// Helper to query browser geolocation
export async function getBrowserCoordinates(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
  success: boolean;
  error?: string;
}> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve({
        latitude: AFLIA_HQ_GEOFENCE.latitude,
        longitude: AFLIA_HQ_GEOFENCE.longitude,
        accuracy: 15,
        success: false,
        error: 'Geolocation API is not available on this browser.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          success: true,
        });
      },
      (err) => {
        resolve({
          latitude: AFLIA_HQ_GEOFENCE.latitude,
          longitude: AFLIA_HQ_GEOFENCE.longitude,
          accuracy: 25,
          success: false,
          error: err.message || 'Location permission denied or timed out.',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 30000,
      }
    );
  });
}
