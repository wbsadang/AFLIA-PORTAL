import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Home, Building2, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { WorkArrangement } from '../../types';

interface WorkArrangementModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetTarget?: WorkArrangement;
}

export const WorkArrangementModal: React.FC<WorkArrangementModalProps> = ({
  isOpen,
  onClose,
  presetTarget,
}) => {
  const { currentUser, fileArrangement, currentDate } = useApp();

  const currentArrangement = currentUser?.currentArrangement || 'ON_SITE';
  const defaultTarget =
    presetTarget || (currentArrangement === 'ON_SITE' ? 'WFH' : 'ON_SITE');

  const [requestedArrangement, setRequestedArrangement] =
    useState<WorkArrangement>(defaultTarget);
  const [effectiveDate, setEffectiveDate] = useState(currentDate);
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Please state the operational or personal reason for this arrangement request.');
      return;
    }
    if (requestedArrangement === currentArrangement) {
      setErrorMsg(`Your current arrangement is already ${currentArrangement}. Please choose a different target arrangement.`);
      return;
    }

    fileArrangement({
      currentArrangement,
      requestedArrangement,
      effectiveDate,
      reason,
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
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Work Arrangement Request
              </h3>
              <p className="text-xs text-amber-200/90">
                AFLIA Flexible Working & Telecommuting Protocol
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
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Current vs Requested Arrangement Card */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="border-r border-slate-200 pr-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Current Arrangement
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                {currentArrangement === 'ON_SITE' ? (
                  <Building2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <Home className="w-4 h-4 text-amber-600" />
                )}
                <span>{currentArrangement === 'ON_SITE' ? 'On-Site (Office)' : 'WFH (Remote)'}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Desired Setup
              </div>
              <div className="flex items-center gap-2 font-bold text-[#0f2b5c]">
                {requestedArrangement === 'ON_SITE' ? (
                  <Building2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <Home className="w-4 h-4 text-amber-600" />
                )}
                <span>{requestedArrangement === 'ON_SITE' ? 'On-Site (Office)' : 'WFH (Remote)'}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Requested Arrangement
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRequestedArrangement('WFH')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  requestedArrangement === 'WFH'
                    ? 'bg-amber-50/80 border-amber-500 text-[#0f2b5c] ring-1 ring-amber-500 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">WFH (Work From Home)</div>
                  <div className="text-[10px] text-slate-500 font-normal">Remote telecommuting</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRequestedArrangement('ON_SITE')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  requestedArrangement === 'ON_SITE'
                    ? 'bg-blue-50 border-[#0f2b5c] text-[#0f2b5c] ring-1 ring-[#0f2b5c] font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-blue-100 text-[#0f2b5c]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">On-Site (Head Office)</div>
                  <div className="text-[10px] text-slate-500 font-normal">Makati Branch HQ</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Effective Date
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => {
                setEffectiveDate(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reason / Justification
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMsg('');
              }}
              placeholder="e.g., Client physical presentation, policy vault audit, scheduled home broadband service, etc."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none resize-none"
              required
            />
          </div>

          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-[11px] text-slate-600 leading-relaxed">
            Note: Once approved by the Branch Administrator, your scheduled arrangement will automatically reflect on your dashboard and attendance logs.
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
              SUBMIT ARRANGEMENT REQUEST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
