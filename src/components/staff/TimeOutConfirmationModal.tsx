import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatTime12, calculateWorkingHours, calculateUndertimeMinutes } from '../../utils/dateUtils';

interface TimeOutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const TimeOutConfirmationModal: React.FC<TimeOutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { todayRecord, timeOut, rules } = useApp();

  if (!isOpen || !todayRecord) return null;

  const currentTime = formatTime12(new Date());
  const hoursWorked = todayRecord.timeIn
    ? calculateWorkingHours(todayRecord.timeIn, currentTime, rules.lunchBreakMinutes)
    : 0;
  const undertime = calculateUndertimeMinutes(currentTime, rules.workEndTime);

  const handleConfirm = () => {
    const res = timeOut();
    if (res.success) {
      onSuccess(res.message);
      onClose();
    } else {
      alert(res.message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-rose-700 text-white flex items-center justify-between border-b-2 border-rose-500">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/15 text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Confirm Daily Time Out</h3>
              <p className="text-xs text-rose-100">End of Shift Record Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center p-4 bg-rose-50/70 border border-rose-200 rounded-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Time Out Timestamp
            </div>
            <div className="font-mono text-3xl font-extrabold text-[#0f2b5c] my-1">
              {currentTime}
            </div>
            <div className="text-[11px] text-slate-500">
              Shift End Schedule: {rules.workEndTime} PM
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Recorded Time In:</span>
              <span className="font-bold text-slate-800">{todayRecord.timeIn || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Computed Working Hours:</span>
              <span className="font-extrabold text-[#0f2b5c]">{hoursWorked} hours (less 1hr lunch)</span>
            </div>
            {undertime > 0 && (
              <div className="flex items-center justify-between text-amber-700 font-bold bg-amber-50 p-2 rounded-lg">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Early Out / Undertime:</span>
                </span>
                <span>{undertime} minutes</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500">
            Note: Once confirmed, duplicate time-out is blocked for today. Please ensure all policy endorsements and client records for the day are saved.
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
              className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>CONFIRM TIME OUT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
