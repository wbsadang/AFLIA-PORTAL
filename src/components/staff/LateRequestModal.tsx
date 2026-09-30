import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock, AlertTriangle, Info } from 'lucide-react';

interface LateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LateRequestModal: React.FC<LateRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { fileLateRequest, currentDate, rules } = useApp();

  const [date, setDate] = useState(currentDate);
  const [expectedArrivalTime] = useState(`${rules.workStartTime} AM`);
  const [actualArrivalExpected, setActualArrivalExpected] = useState('09:15 AM');
  const [reason, setReason] = useState('Severe transit & vehicular traffic along highway');
  const [additionalRemarks, setAdditionalRemarks] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Please specify the reason for expected late arrival.');
      return;
    }
    if (!actualArrivalExpected.trim()) {
      setErrorMsg('Please provide your estimated time of arrival.');
      return;
    }

    fileLateRequest({
      date,
      expectedArrivalTime,
      actualArrivalExpected,
      reason,
      additionalRemarks: additionalRemarks || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0f2b5c] text-white flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10 text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Submit Late Notification / Request
              </h3>
              <p className="text-xs text-amber-200/90">
                Official Agency Tardiness Justification Slip
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Transparent Record Keeping Notice */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Transparent Attendance Policy:</span>
              <p className="mt-0.5 text-amber-800 text-[11px] leading-relaxed">
                Approving this notification notes valid justification but does not erase or falsify your actual biometric time-in. Both actual time and manager approval remain transparently recorded.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Incident Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Shift Start
              </label>
              <input
                type="text"
                value={expectedArrivalTime}
                disabled
                className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-100 rounded-xl text-slate-600 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Expected / Actual Arrival Time
            </label>
            <input
              type="text"
              value={actualArrivalExpected}
              onChange={(e) => {
                setActualArrivalExpected(e.target.value);
                setErrorMsg('');
              }}
              placeholder="e.g. 09:15 AM"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none font-semibold text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Primary Reason for Tardiness
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none bg-white mb-2"
            >
              <option value="Severe transit & vehicular traffic along highway">
                Severe transit & vehicular traffic along highway
              </option>
              <option value="Public transportation breakdown / LRT/MRT line delay">
                Public transportation breakdown / LRT/MRT line delay
              </option>
              <option value="District power outage / internet connectivity disruption (WFH)">
                District power outage / internet connectivity disruption (WFH)
              </option>
              <option value="Emergency family assistance / medical concern">
                Emergency family assistance / medical concern
              </option>
              <option value="Client early emergency meeting outside office">
                Client early emergency meeting outside office
              </option>
              <option value="Severe weather / flooding advisory">
                Severe weather / flooding advisory
              </option>
              <option value="Other unforeseen circumstances">Other unforeseen circumstances</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Additional Circumstances / Remarks
            </label>
            <textarea
              rows={2}
              value={additionalRemarks}
              onChange={(e) => setAdditionalRemarks(e.target.value)}
              placeholder="Brief details for supervisor review..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none resize-none"
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
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0f2b5c] hover:bg-[#153a7a] rounded-xl shadow-md transition-all cursor-pointer"
            >
              SUBMIT LATE NOTIFICATION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
