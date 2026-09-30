import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Upload, AlertCircle, FileText } from 'lucide-react';

interface FileLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileLeaveModal: React.FC<FileLeaveModalProps> = ({ isOpen, onClose }) => {
  const { fileLeave, currentDate } = useApp();

  const [leaveType, setLeaveType] = useState<'Vacation Leave' | 'Sick Leave' | 'Emergency Leave' | 'Other'>('Vacation Leave');
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [reason, setReason] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Calculate day difference
  const calculateDays = () => {
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diffTime = e.getTime() - s.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const daysCount = calculateDays();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Please specify the reason for filing leave.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setErrorMsg('End date cannot precede the start date.');
      return;
    }

    fileLeave({
      leaveType,
      startDate,
      endDate,
      numberOfDays: daysCount,
      reason,
      documentName: documentName || undefined,
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
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">File Official Leave</h3>
              <p className="text-xs text-amber-200/90">AFLIA Employee Leave Application</p>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Leave Classification
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Vacation Leave', 'Sick Leave', 'Emergency Leave', 'Other'] as const).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setLeaveType(type)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                    leaveType === type
                      ? 'bg-blue-50 border-[#0f2b5c] text-[#0f2b5c] ring-1 ring-[#0f2b5c]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">Computed Duration:</span>
            <span className="font-extrabold text-[#0f2b5c] text-sm">
              {daysCount} {daysCount === 1 ? 'Working Day' : 'Working Days'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reason / Endorsement Notes
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Provide reason for absence and endorse urgent insurance policy tasks..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Supporting Document / Attachment (Optional)
            </label>
            <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setDocumentName(file.name);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                <Upload className="w-4 h-4 text-amber-600" />
                {documentName ? (
                  <span className="font-semibold text-[#0f2b5c] flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    {documentName}
                  </span>
                ) : (
                  <span>Attach Medical Certificate, Itinerary or Travel Memo (PDF/PNG)</span>
                )}
              </div>
            </div>
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
              SUBMIT LEAVE REQUEST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
