import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Clock,
  Calendar,
  Coffee,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { AttendanceRules } from '../../types';

export const AttendanceRulesView: React.FC = () => {
  const { rules, updateAttendanceRules } = useApp();

  const [workStartTime, setWorkStartTime] = useState(rules.workStartTime);
  const [workEndTime, setWorkEndTime] = useState(rules.workEndTime);
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState(rules.gracePeriodMinutes);
  const [lunchBreakMinutes, setLunchBreakMinutes] = useState(rules.lunchBreakMinutes);
  const [workingDays, setWorkingDays] = useState<string[]>(rules.workingDays);
  const [holidays, setHolidays] = useState(rules.holidays);

  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('2026-11-20');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const allWeekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      if (workingDays.length <= 1) return; // Must have at least 1 working day
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName.trim() || !newHolidayDate) return;

    setHolidays([
      ...holidays,
      {
        id: `h-${Date.now()}`,
        name: newHolidayName.trim(),
        date: newHolidayDate,
      },
    ]);
    setNewHolidayName('');
  };

  const handleRemoveHoliday = (id: string) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AttendanceRules = {
      workStartTime,
      workEndTime,
      gracePeriodMinutes: Number(gracePeriodMinutes),
      lunchBreakMinutes: Number(lunchBreakMinutes),
      workingDays,
      holidays,
    };
    updateAttendanceRules(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-4 h-4" />
              <span>Agency Operational Policy Configuration</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0f2b5c] mt-0.5">
              Attendance Rules & Shift Schedule
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure agency official working hours, grace periods, lunch deductions, and declared holidays
            </p>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rules updated & logged to audit trail!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveAll} className="mt-6 space-y-6">
          {/* Working Hours & Grace Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0f2b5c]">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Official Agency Working Hours</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Shift Start (e.g. 08:00)
                  </label>
                  <input
                    type="time"
                    value={workStartTime}
                    onChange={(e) => setWorkStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Shift End (e.g. 17:00)
                  </label>
                  <input
                    type="time"
                    value={workEndTime}
                    onChange={(e) => setWorkEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Grace Period (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={gracePeriodMinutes}
                    onChange={(e) => setGracePeriodMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Lunch Break (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={lunchBreakMinutes}
                    onChange={(e) => setLunchBreakMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold"
                    required
                  />
                </div>
              </div>

              {/* Dynamic explanation formula */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Rule Logic:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  With start time at <strong>{workStartTime}</strong> and a <strong>{gracePeriodMinutes}-minute</strong> grace period:
                  <br />
                  • {workStartTime} to {workStartTime.slice(0, 3)}
                  {String(Number(workStartTime.slice(3)) + gracePeriodMinutes).padStart(2, '0')} = <span className="font-bold text-emerald-700">On Time</span>
                  <br />
                  • Beyond that = <span className="font-bold text-rose-700">Late (calculated from {workStartTime})</span>
                </p>
              </div>
            </div>

            {/* Official Working Days */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0f2b5c]">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Designated Agency Working Days</span>
              </div>
              <p className="text-xs text-slate-500">
                Select required shift days. Inactive days are considered non-working days unless overtime is assigned.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {allWeekDays.map((day) => {
                  const isChecked = workingDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#0f2b5c] text-white border-[#0f2b5c]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{day}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Company Holidays Roster */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0f2b5c]">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Declared Corporate & National Holidays</span>
              </div>
              <span className="text-xs text-slate-500">{holidays.length} Declared Holidays</span>
            </div>

            {/* Holiday list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {holidays.map((h) => (
                <div
                  key={h.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#0f2b5c]">{h.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{h.date}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveHoliday(h.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Remove holiday"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Holiday Subform */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs">
              <input
                type="text"
                value={newHolidayName}
                onChange={(e) => setNewHolidayName(e.target.value)}
                placeholder="Holiday name (e.g. Bonifacio Day)..."
                className="flex-1 min-w-[200px] px-3 py-2 border border-slate-300 rounded-xl bg-white"
              />
              <input
                type="date"
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl bg-white"
              />
              <button
                type="button"
                onClick={handleAddHoliday}
                className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1 hover:bg-slate-900 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Holiday</span>
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-3 bg-[#0f2b5c] hover:bg-[#153a7a] text-white rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>SAVE & APPLY ATTENDANCE RULES</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
