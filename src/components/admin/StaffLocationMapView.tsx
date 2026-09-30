import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffLocationRecord } from '../../types';
import {
  MapPin,
  Laptop,
  Wifi,
  Battery,
  BatteryCharging,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Layers,
  Crosshair,
  ExternalLink,
  ChevronRight,
  Info,
  Sliders,
  Radio,
} from 'lucide-react';
import { AFLIA_HQ_GEOFENCE, AFLIA_LOCATION_PRESETS, formatDistance } from '../../utils/locationUtils';
import { OfficialLogo } from '../common/OfficialLogo';

export const StaffLocationMapView: React.FC = () => {
  const {
    staffLocations,
    currentUser,
    pingMacBookLocation,
    updateUserMacBookLocation,
    geofenceSettings,
    updateGeofenceSettings,
  } = useApp();

  const [filterType, setFilterType] = useState<'ALL' | 'ON_LOCATION' | 'REMOTE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffLocationRecord | null>(
    staffLocations[0] || null
  );
  const [isScanning, setIsScanning] = useState(false);
  const [mapZoom, setMapZoom] = useState<'makati_hq' | 'metro_manila'>('makati_hq');
  const [showGeofenceSettings, setShowGeofenceSettings] = useState(false);
  const [customRadius, setCustomRadius] = useState(geofenceSettings.radiusMeters);
  const [scanNotification, setScanNotification] = useState<string | null>(null);

  // Filtered staff list
  const filteredStaff = staffLocations.filter((staff) => {
    if (filterType === 'ON_LOCATION' && !staff.isOnLocation) return false;
    if (filterType === 'REMOTE' && staff.isOnLocation) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        staff.fullName.toLowerCase().includes(q) ||
        staff.staffId.toLowerCase().includes(q) ||
        staff.deviceModel.toLowerCase().includes(q) ||
        staff.locationLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const onLocationCount = staffLocations.filter((s) => s.isOnLocation).length;
  const remoteCount = staffLocations.filter((s) => !s.isOnLocation).length;

  const handlePingAll = async () => {
    setIsScanning(true);
    setScanNotification('Scanning all staff MacBooks via CoreLocation & AFLIA Secure Wi-Fi...');
    setTimeout(() => {
      // Simulate refreshed ping times
      staffLocations.forEach((s) => {
        updateUserMacBookLocation(s.userId, {
          lastPingTime: 'Just now (Live)',
          lastPingRaw: new Date().toISOString(),
        });
      });
      setIsScanning(false);
      setScanNotification(`Active telemetry received from ${staffLocations.length} MacBook devices.`);
      setTimeout(() => setScanNotification(null), 4000);
    }, 1200);
  };

  const handleUpdateRadius = () => {
    updateGeofenceSettings({ radiusMeters: customRadius });
    setShowGeofenceSettings(false);
    setScanNotification(`Office geofence radius updated to ${customRadius} meters.`);
    setTimeout(() => setScanNotification(null), 3000);
  };

  // Convert Lat/Lng to SVG Map Coordinates
  // Makati HQ Center: 14.5547, 121.0244 -> (x: 400, y: 300)
  const getMapCoordinates = (lat: number, lon: number) => {
    if (mapZoom === 'makati_hq') {
      // Scale: 0.001 deg lat/lon ~ 111 meters
      // Center at HQ (14.5547, 121.0244)
      const deltaX = (lon - AFLIA_HQ_GEOFENCE.longitude) * 28000;
      const deltaY = (AFLIA_HQ_GEOFENCE.latitude - lat) * 28000;
      const x = Math.min(Math.max(400 + deltaX, 30), 770);
      const y = Math.min(Math.max(300 + deltaY, 30), 570);
      return { x, y };
    } else {
      // Metro Manila regional overview (covers Quezon City, Pasig, Taguig, Makati)
      // Center at 14.5800, 121.0400
      const centerLat = 14.58;
      const centerLon = 121.04;
      const deltaX = (lon - centerLon) * 1600;
      const deltaY = (centerLat - lat) * 1600;
      const x = Math.min(Math.max(400 + deltaX, 40), 760);
      const y = Math.min(Math.max(300 + deltaY, 40), 560);
      return { x, y };
    }
  };

  const hqCoords = getMapCoordinates(AFLIA_HQ_GEOFENCE.latitude, AFLIA_HQ_GEOFENCE.longitude);
  // Radius in pixels on SVG map: 200m in makati_hq mode is approx 50px
  const geofencePixelRadius =
    mapZoom === 'makati_hq'
      ? Math.max(25, (geofenceSettings.radiusMeters / 200) * 55)
      : Math.max(12, (geofenceSettings.radiusMeters / 200) * 14);

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {scanNotification && (
        <div className="p-3.5 rounded-2xl bg-[#0f2b5c] text-white shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{scanNotification}</span>
          </div>
          <button
            onClick={() => setScanNotification(null)}
            className="text-white hover:text-amber-300 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Telemetry Summary */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <Laptop className="w-4 h-4 text-amber-600" />
              <span>Real-Time Staff Location &amp; MacBook Telemetry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0f2b5c] tracking-tight mt-1">
              Live Office Geofence &amp; MacBook Tracking Radar
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Monitors company-issued Apple MacBooks across the AFLIA Makati Branch Headquarters
              geofence (Ayala Avenue) and remote telecommuting locations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* On Location Badge */}
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="text-[10px] text-emerald-700 uppercase font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>On Location (Office)</span>
              </div>
              <div className="text-base font-extrabold text-emerald-900 mt-0.5">
                {onLocationCount} Staff MacBooks
              </div>
            </div>

            {/* Remote WFH Badge */}
            <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
              <div className="text-[10px] text-amber-700 uppercase font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Remote / WFH</span>
              </div>
              <div className="text-base font-extrabold text-amber-900 mt-0.5">
                {remoteCount} Staff MacBooks
              </div>
            </div>

            {/* Ping All Button */}
            <button
              onClick={handlePingAll}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-2xl bg-[#0f2b5c] hover:bg-[#153a7a] text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Pinging Devices...' : 'Ping All MacBooks'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Staff Telemetry List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Vector Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col">
          {/* Map Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#0f2b5c]" />
              <span className="text-xs font-bold text-[#0f2b5c] uppercase tracking-wider">
                {mapZoom === 'makati_hq'
                  ? 'AFLIA Makati CBD High-Accuracy Radar'
                  : 'Metro Manila Regional Overview'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-slate-100 rounded-xl p-1 flex items-center text-[11px] font-bold">
                <button
                  onClick={() => setMapZoom('makati_hq')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    mapZoom === 'makati_hq'
                      ? 'bg-white text-[#0f2b5c] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Makati HQ Geofence
                </button>
                <button
                  onClick={() => setMapZoom('metro_manila')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    mapZoom === 'metro_manila'
                      ? 'bg-white text-[#0f2b5c] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Metro Manila View
                </button>
              </div>

              <button
                onClick={() => setShowGeofenceSettings(!showGeofenceSettings)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#0f2b5c] hover:bg-slate-50 transition-colors cursor-pointer"
                title="Geofence Boundary Settings"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Optional Geofence Settings Drawer */}
          {showGeofenceSettings && (
            <div className="p-4 mb-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-3">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Geofence Boundary Radius: {customRadius} meters</span>
                </span>
                <span className="text-[10px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                  HQ Center: 14.5547° N, 121.0244° E
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={customRadius}
                  onChange={(e) => setCustomRadius(Number(e.target.value))}
                  className="flex-1 accent-amber-600 cursor-pointer"
                />
                <button
                  onClick={handleUpdateRadius}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                >
                  Save Radius
                </button>
              </div>
            </div>
          )}

          {/* Interactive SVG Radar Map Canvas */}
          <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-800 select-none">
            {/* Background Grid Lines & Circular Range Rings */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#0f172a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
                </radialGradient>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                  />
                </pattern>
                {/* Geofence Pulse Animation */}
                <radialGradient id="geofenceGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#10b981" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Map Background */}
              <rect width="800" height="600" fill="url(#radarGlow)" />
              <rect width="800" height="600" fill="url(#grid)" />

              {/* Roads & City Grid Lines (Styled for Metro Manila / Makati CBD) */}
              {mapZoom === 'makati_hq' ? (
                <g opacity="0.3" stroke="#475569" strokeWidth="2">
                  {/* Ayala Avenue */}
                  <line x1="120" y1="100" x2="680" y2="500" stroke="#fbbf24" strokeWidth="3.5" />
                  {/* Paseo de Roxas */}
                  <line x1="280" y1="80" x2="520" y2="520" stroke="#94a3b8" strokeWidth="2.5" />
                  {/* Makati Avenue */}
                  <line x1="480" y1="60" x2="720" y2="480" stroke="#94a3b8" strokeWidth="2" />
                  {/* Dela Rosa Street */}
                  <line x1="200" y1="360" x2="600" y2="240" stroke="#64748b" strokeWidth="1.5" />
                  {/* Legazpi Street */}
                  <line x1="260" y1="420" x2="660" y2="300" stroke="#64748b" strokeWidth="1.5" />

                  {/* Ayala Triangle Park outline */}
                  <polygon
                    points="420,160 550,230 460,320"
                    fill="#065f46"
                    fillOpacity="0.35"
                    stroke="#10b981"
                    strokeWidth="1"
                  />
                  <text x="470" y="235" fill="#34d399" fontSize="10" fontWeight="bold">
                    Ayala Triangle
                  </text>
                  <text x="320" y="240" fill="#fbbf24" fontSize="11" fontWeight="bold">
                    AYALA AVENUE
                  </text>
                </g>
              ) : (
                <g opacity="0.35" stroke="#475569" strokeWidth="2">
                  {/* EDSA Highway */}
                  <path
                    d="M 620,60 Q 560,250 480,360 T 360,540"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3.5"
                  />
                  {/* C5 Road */}
                  <path
                    d="M 720,80 Q 680,280 620,400 T 520,560"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2.5"
                  />
                  {/* Pasig River */}
                  <path
                    d="M 780,240 Q 600,220 480,270 T 180,250"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="4"
                  />
                  <text x="540" y="160" fill="#cbd5e1" fontSize="11" fontWeight="bold">
                    Quezon City
                  </text>
                  <text x="640" y="320" fill="#cbd5e1" fontSize="11" fontWeight="bold">
                    Pasig City
                  </text>
                  <text x="530" y="440" fill="#cbd5e1" fontSize="11" fontWeight="bold">
                    BGC Taguig
                  </text>
                  <text x="340" y="340" fill="#fbbf24" fontSize="12" fontWeight="bold">
                    MAKATI CBD
                  </text>
                </g>
              )}

              {/* Radar Rings Centered on AFLIA HQ */}
              <circle
                cx={hqCoords.x}
                cy={hqCoords.y}
                r="60"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <circle
                cx={hqCoords.x}
                cy={hqCoords.y}
                r="130"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <circle
                cx={hqCoords.x}
                cy={hqCoords.y}
                r="220"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="1"
                strokeDasharray="4,4"
              />

              {/* AFLIA Official Geofence Boundary (Glowing Green Circle) */}
              <circle
                cx={hqCoords.x}
                cy={hqCoords.y}
                r={geofencePixelRadius}
                fill="url(#geofenceGlow)"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray={mapZoom === 'makati_hq' ? 'none' : '3,3'}
              />

              {/* Geofence animated pulsating outer ring */}
              <circle
                cx={hqCoords.x}
                cy={hqCoords.y}
                r={geofencePixelRadius + 6}
                fill="none"
                stroke="#34d399"
                strokeWidth="1"
                opacity="0.6"
              />

              {/* AFLIA HQ Center Marker */}
              <g transform={`translate(${hqCoords.x}, ${hqCoords.y})`}>
                <circle r="14" fill="#0f2b5c" stroke="#fbbf24" strokeWidth="2.5" />
                <circle r="4" fill="#fbbf24" />
                <text
                  x="0"
                  y="-18"
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="11"
                  fontWeight="bold"
                >
                  AFLIA HQ TOWER
                </text>
                <text
                  x="0"
                  y="26"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontWeight="600"
                >
                  {geofenceSettings.radiusMeters}m Geofence
                </text>
              </g>

              {/* Staff MacBook Location Pins */}
              {staffLocations.map((staff) => {
                const pos = getMapCoordinates(staff.latitude, staff.longitude);
                const isSelected = selectedStaff?.userId === staff.userId;

                return (
                  <g
                    key={staff.userId}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer transition-transform duration-300 hover:scale-125"
                    onClick={() => setSelectedStaff(staff)}
                  >
                    {/* Pulsing indicator ring */}
                    <circle
                      r={isSelected ? '20' : '15'}
                      fill={staff.isOnLocation ? '#10b981' : '#f59e0b'}
                      opacity={isSelected ? '0.4' : '0.2'}
                      className="animate-ping"
                    />

                    {/* Outer Circle */}
                    <circle
                      r={isSelected ? '14' : '11'}
                      fill={staff.isOnLocation ? '#059669' : '#d97706'}
                      stroke={isSelected ? '#ffffff' : staff.isOnLocation ? '#34d399' : '#fbbf24'}
                      strokeWidth={isSelected ? '3' : '2'}
                    />

                    {/* Initials */}
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={isSelected ? '10' : '8'}
                      fontWeight="bold"
                    >
                      {staff.avatarInitials}
                    </text>

                    {/* Small MacBook Indicator Icon Badge */}
                    <rect
                      x="6"
                      y="-12"
                      width="12"
                      height="10"
                      rx="2"
                      fill="#0f2b5c"
                      stroke="#fbbf24"
                      strokeWidth="1"
                    />
                    <text x="12" y="-4" textAnchor="middle" fill="#fbbf24" fontSize="7">
                      💻
                    </text>

                    {/* Staff Label */}
                    <rect
                      x="-45"
                      y={isSelected ? '-32' : '-26'}
                      width="90"
                      height="16"
                      rx="4"
                      fill="#0f172a"
                      opacity="0.85"
                    />
                    <text
                      x="0"
                      y={isSelected ? '-20' : '-14'}
                      textAnchor="middle"
                      fill={staff.isOnLocation ? '#34d399' : '#fbbf24'}
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {staff.fullName.split(' ')[0]} {staff.isOnLocation ? '· ON-SITE' : '· WFH'}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Radar Scanline Animation when isScanning */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#fbbf24] animate-bounce" />
              </div>
            )}

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700 text-[10px] text-slate-300 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-400/40" />
                <span className="font-semibold text-white">Inside Office Geofence (On Location)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-400/40" />
                <span className="font-semibold text-white">Remote Telecommuting (WFH)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 pt-0.5 border-t border-slate-800">
                <Laptop className="w-3 h-3 text-amber-300" />
                <span>Verified Apple MacBook Workstation</span>
              </div>
            </div>

            {/* Live GPS Coordinates Widget */}
            <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[10px] font-mono text-amber-300">
              AFLIA HQ: 14.5547°N, 121.0244°E
            </div>
          </div>
        </div>

        {/* Right Column: Selected Staff Telemetry & List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Staff Hardware & Location Card */}
          {selectedStaff ? (
            <div className="bg-gradient-to-br from-[#0f2b5c] to-[#153a7a] text-white rounded-3xl p-5 shadow-md border border-amber-500/40 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow-md">
                    {selectedStaff.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-white">{selectedStaff.fullName}</h3>
                      {selectedStaff.isOnLocation ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px]">
                          ON LOCATION
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
                          REMOTE / WFH
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-200 mt-0.5">
                      {selectedStaff.position} · {selectedStaff.staffId}
                    </p>
                  </div>
                </div>

                {/* MacBook Icon */}
                <div className="p-2.5 rounded-xl bg-white/10 text-amber-300 border border-white/20">
                  <Laptop className="w-5 h-5" />
                </div>
              </div>

              {/* Hardware & Location Details Grid */}
              <div className="space-y-2.5 text-xs bg-slate-900/50 p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Device Model:</span>
                  <span className="font-bold text-white text-right">
                    {selectedStaff.deviceModel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Operating System:</span>
                  <span className="font-mono text-amber-300">
                    {selectedStaff.macOSVersion} · {selectedStaff.browser}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Station / Vicinity:</span>
                  <span className="font-bold text-white truncate max-w-[200px]" title={selectedStaff.locationLabel}>
                    {selectedStaff.locationLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Distance to Makati HQ:</span>
                  <span
                    className={`font-black ${
                      selectedStaff.isOnLocation ? 'text-emerald-400' : 'text-amber-300'
                    }`}
                  >
                    {formatDistance(selectedStaff.distanceFromHQMeters)} (
                    {selectedStaff.isOnLocation ? 'Inside Geofence' : 'Off-Site'})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Connected Wi-Fi:</span>
                  <span className="font-mono text-slate-200 flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedStaff.wifiSSID}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Battery Status:</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    {selectedStaff.isCharging ? (
                      <BatteryCharging className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Battery className="w-4 h-4 text-amber-300" />
                    )}
                    <span>
                      {selectedStaff.batteryLevel}% {selectedStaff.isCharging ? '(Charging)' : ''}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px]">
                  <span className="text-slate-400">Last Telemetry Ping:</span>
                  <span className="text-amber-200 font-semibold">{selectedStaff.lastPingTime}</span>
                </div>
              </div>

              {/* Quick Simulation Buttons for testing & demonstration */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">
                  Test Location Switch:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      updateUserMacBookLocation(selectedStaff.userId, {
                        isOnLocation: true,
                        distanceFromHQMeters: 18,
                        locationLabel: 'AFLIA Makati Branch HQ - Level 12 Executive Station',
                        latitude: 14.55474,
                        longitude: 121.02442,
                        wifiSSID: 'AFLIA-MAKATI-CORP-WIFI-5G',
                        isOfficeWifi: true,
                        status: 'ON_LOCATION',
                        lastPingTime: 'Just now',
                      });
                    }}
                    className="px-2 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[10px] font-bold cursor-pointer"
                  >
                    Move to Office
                  </button>
                  <button
                    onClick={() => {
                      updateUserMacBookLocation(selectedStaff.userId, {
                        isOnLocation: false,
                        distanceFromHQMeters: 13800,
                        locationLabel: 'Authorized Telecommuting Residence - Quezon City',
                        latitude: 14.6538,
                        longitude: 121.0685,
                        wifiSSID: 'Home_PLDT_Fiber_5G',
                        isOfficeWifi: false,
                        status: 'REMOTE',
                        lastPingTime: 'Just now',
                      });
                    }}
                    className="px-2 py-1 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white text-[10px] font-bold cursor-pointer"
                  >
                    Move to Remote
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Staff Roster Search & Filter Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-[#0f2b5c] text-sm flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-amber-600" />
                <span>All Staff MacBooks ({staffLocations.length})</span>
              </h3>

              {/* Filter Chips */}
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    filterType === 'ALL'
                      ? 'bg-[#0f2b5c] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({staffLocations.length})
                </button>
                <button
                  onClick={() => setFilterType('ON_LOCATION')}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    filterType === 'ON_LOCATION'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  On Site ({onLocationCount})
                </button>
                <button
                  onClick={() => setFilterType('REMOTE')}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    filterType === 'REMOTE'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Remote ({remoteCount})
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff, position, or MacBook model..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
              />
            </div>

            {/* Staff List */}
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {filteredStaff.map((staff) => {
                const isSelected = selectedStaff?.userId === staff.userId;
                return (
                  <div
                    key={staff.userId}
                    onClick={() => setSelectedStaff(staff)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#0f2b5c] shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                          staff.isOnLocation
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {staff.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-[#0f2b5c] truncate">
                          {staff.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                          <Laptop className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{staff.deviceModel.split('(')[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {staff.isOnLocation ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>On Location</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          <span>Remote</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {formatDistance(staff.distanceFromHQMeters)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
