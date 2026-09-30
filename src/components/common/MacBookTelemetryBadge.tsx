import React from 'react';
import { StaffLocationRecord } from '../../types';
import { Laptop, Wifi, BatteryCharging, Battery, CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';
import { formatDistance } from '../../utils/locationUtils';

interface MacBookTelemetryBadgeProps {
  location?: StaffLocationRecord;
  compact?: boolean;
  onClick?: () => void;
}

export const MacBookTelemetryBadge: React.FC<MacBookTelemetryBadgeProps> = ({
  location,
  compact = false,
  onClick,
}) => {
  if (!location) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
        <Laptop className="w-3 h-3 text-slate-400" />
        <span>No Device Ping</span>
      </span>
    );
  }

  const { isOnLocation, deviceModel, distanceFromHQMeters, wifiSSID, batteryLevel, isCharging } =
    location;

  if (compact) {
    return (
      <button
        onClick={onClick}
        type="button"
        title={`${deviceModel} · ${isOnLocation ? 'Inside Makati Office Geofence' : 'Remote'} (${formatDistance(distanceFromHQMeters)})`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
          isOnLocation
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
        } ${onClick ? 'cursor-pointer' : ''}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isOnLocation ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
          }`}
        />
        <Laptop className="w-3 h-3" />
        <span>{isOnLocation ? 'On Location' : 'Remote'}</span>
        <span className="text-[10px] opacity-75 font-mono">
          ({formatDistance(distanceFromHQMeters)})
        </span>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col gap-0.5 p-2 rounded-xl text-left transition-all ${
        isOnLocation
          ? 'bg-emerald-50/80 border border-emerald-300 hover:bg-emerald-100/70'
          : 'bg-amber-50/80 border border-amber-300 hover:bg-amber-100/70'
      } ${onClick ? 'cursor-pointer hover:shadow-xs' : ''}`}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            isOnLocation ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
          }`}
        />
        <span
          className={`text-[11px] font-extrabold uppercase tracking-wider ${
            isOnLocation ? 'text-emerald-800' : 'text-amber-900'
          }`}
        >
          {isOnLocation ? '💻 On Location (Office)' : '💻 Remote (WFH)'}
        </span>
      </div>

      <div className="text-[10px] text-slate-600 flex items-center gap-2 mt-0.5">
        <span className="font-semibold truncate max-w-[130px]">{deviceModel.split('(')[0]}</span>
        <span className="text-slate-400">·</span>
        <span className="font-mono text-slate-700 font-bold">
          {formatDistance(distanceFromHQMeters)} away
        </span>
      </div>
    </div>
  );
};
