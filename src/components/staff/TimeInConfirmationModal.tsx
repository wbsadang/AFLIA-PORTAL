import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock, MapPin, CheckCircle2, Building2, Home, Laptop, Wifi } from 'lucide-react';
import { formatTime12, formatDateFriendly } from '../../utils/dateUtils';
import { formatDistance } from '../../utils/locationUtils';

interface TimeInConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const TimeInConfirmationModal: React.FC<TimeInConfirmationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, currentDate, timeIn, rules, staffLocations } = useApp();

  const myLocation = staffLocations.find((s) => s.userId === currentUser?.id);

  const initialNote = myLocation
    ? myLocation.isOnLocation
      ? `AFLIA Makati Branch HQ - Level 12 (MacBook Verified · ${formatDistance(myLocation.distanceFromHQMeters)} away)`
      : `Authorized Telecommuting Station (MacBook Remote · ${formatDistance(myLocation.distanceFromHQMeters)} away)`
    : currentUser?.currentArrangement === 'ON_SITE'
    ? 'AFLIA Makati Branch HQ - Level 12'
    : 'Authorized Telecommuting Residence / Remote';

  const [locationNote, setLocationNote] = useState(initialNote);

  if (!isOpen || !currentUser) return null;

  const handleConfirm = () => {
    const res = timeIn(locationNote);
    if (res.success) {
      onSuccess(res.message);
      onClose();
    } else {
      alert(res.message);
      onClose();
    }
  };

  const currentTime = formatTime12(new Date());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between border-b-2 border-emerald-500">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/15 text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Confirm Daily Time In</h3>
              <p className="text-xs text-emerald-100">AFLIA Attendance Biometric Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Time & Date Display */}
          <div className="text-center p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {formatDateFriendly(currentDate)}
            </div>
            <div className="font-mono text-3xl font-extrabold text-[#0f2b5c] my-1">
              {currentTime}
            </div>
            <div className="text-[11px] text-slate-500">
              Official Shift Start: {rules.workStartTime} AM (Grace period: {rules.gracePeriodMinutes} mins)
            </div>
          </div>

          {/* Employee & Arrangement Detail */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Employee Name:</span>
              <span className="font-bold text-slate-800">{currentUser.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Staff ID / Position:</span>
              <span className="font-mono text-slate-700">{currentUser.staffId} · {currentUser.position}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Active Work Arrangement:</span>
              <span className="font-bold text-[#0f2b5c] flex items-center gap-1.5">
                {currentUser.currentArrangement === 'ON_SITE' ? (
                  <>
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>ON-SITE (Office)</span>
                  </>
                ) : (
                  <>
                    <Home className="w-3.5 h-3.5 text-amber-600" />
                    <span>WFH (Remote)</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* MacBook Telemetry & Location Verification Box */}
          {myLocation && (
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                myLocation.isOnLocation
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between font-extrabold uppercase text-[10px] tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5" />
                  <span>MacBook Location Telemetry</span>
                </span>
                {myLocation.isOnLocation ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[9px]">
                    ON LOCATION (OFFICE)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white font-extrabold text-[9px]">
                    REMOTE / WFH
                  </span>
                )}
              </div>

              <div className="font-bold text-[#0f2b5c] flex items-center justify-between pt-0.5">
                <span className="truncate">{myLocation.deviceModel.split('(')[0]}</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {formatDistance(myLocation.distanceFromHQMeters)} to HQ
                </span>
              </div>

              <div className="text-[11px] text-slate-600 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-slate-500" />
                  <span className="font-mono">{myLocation.wifiSSID}</span>
                </span>
                <span>·</span>
                <span>{myLocation.batteryLevel}% Battery</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Location / Station Note</span>
            </label>
            <input
              type="text"
              value={locationNote}
              onChange={(e) => setLocationNote(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
              placeholder="e.g. Makati Office Floor 12 or Home Office Pasig"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>CONFIRM TIME IN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
