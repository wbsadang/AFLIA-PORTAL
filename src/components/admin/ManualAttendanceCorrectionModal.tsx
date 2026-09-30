import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, AttendanceStatus, WorkArrangement } from '../../types';
import { X, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ManualAttendanceCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  onSuccess: (msg: string) => void;
}

export const ManualAttendanceCorrectionModal: React.FC<ManualAttendanceCorrectionModalProps> = ({
  isOpen,
  onClose,
  record,
  onSuccess,
}) => {
  const { correctAttendanceRecord } = useApp();

  const [timeIn, setTimeIn] = useState(record?.timeIn || '');
  const [timeOut, setTimeOut] = useState(record?.timeOut || '');
  const [status, setStatus] = useState<AttendanceStatus>(record?.status || 'PRESENT');
  const [arrangement, setArrangement] = useState<WorkArrangement>(
    record?.arrangement || 'ON_SITE'
  );
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Mandatory audit justification is required to adjust biometric attendance.');
      return;
    }

    const res = correctAttendanceRecord(
      record.id,
      {
        timeIn: timeIn.trim() || null,
        timeOut: timeOut.trim() || null,
        status,
        arrangement,
      },
      reason
    );

    if (res.success) {
      onSuccess(res.message);
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0f2b5c] text-white flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Manual Attendance Correction
              </h3>
              <p className="text-xs text-amber-200/90">
                Audited Administrative Override
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Compliance Regulation:</span>
              <p className="mt-0.5 text-amber-800 text-[11px]">
                Attendance records are permanent corporate legal documents. Every adjustment requires a mandatory business justification and is permanently stamped into the Admin Audit Trail.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
            <div>
              <div className="font-bold text-[#0f2b5c]">{record.userName}</div>
              <div className="text-[11px] text-slate-500">{record.userStaffId} · {record.userPosition}</div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-slate-800">{record.date}</div>
              <div className="text-[10px] text-slate-500">Record ID: {record.id}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Time In (e.g. 08:05 AM)
              </label>
              <input
                type="text"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
                placeholder="08:00 AM"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Time Out (e.g. 05:00 PM)
              </label>
              <input
                type="text"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
                placeholder="05:00 PM"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Attendance Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none bg-white font-semibold"
              >
                <option value="PRESENT">PRESENT</option>
                <option value="LATE">LATE</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
                <option value="ABSENT">ABSENT</option>
                <option value="NOT_LOGGED_IN">NOT_LOGGED_IN</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Arrangement
              </label>
              <select
                value={arrangement}
                onChange={(e) => setArrangement(e.target.value as WorkArrangement)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none bg-white font-semibold"
              >
                <option value="ON_SITE">ON_SITE (Makati Office)</option>
                <option value="WFH">WFH (Remote)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>* Mandatory Reason for Adjustment</span>
              <span className="text-[10px] text-slate-400 font-normal">Audit-Logged</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMsg('');
              }}
              placeholder="State verified reason: e.g., Biometric reader sync failure, verified client emergency call at 8:00 AM by Branch Manager..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none resize-none"
              required
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0f2b5c] hover:bg-[#153a7a] rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>SAVE & AUDIT LOG</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
