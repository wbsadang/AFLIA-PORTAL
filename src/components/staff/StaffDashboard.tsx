import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Home,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Briefcase,
  History,
  ShieldCheck,
  ChevronRight,
  Info,
  MessageSquare,
  Laptop,
  MapPin,
} from 'lucide-react';
import { formatDateFriendly, formatDateWithDay } from '../../utils/dateUtils';
import { formatDistance } from '../../utils/locationUtils';
import { FileLeaveModal } from './FileLeaveModal';
import { WorkArrangementModal } from './WorkArrangementModal';
import { LateRequestModal } from './LateRequestModal';
import { TimeInConfirmationModal } from './TimeInConfirmationModal';
import { TimeOutConfirmationModal } from './TimeOutConfirmationModal';
import { StaffMacBookLocationCard } from './StaffMacBookLocationCard';
import { WorkArrangement } from '../../types';

interface StaffDashboardProps {
  onOpenChat?: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onOpenChat }) => {
  const {
    currentUser,
    currentDate,
    todayRecord,
    leaveRequests,
    arrangementRequests,
    lateRequests,
    attendanceRecords,
    rules,
    totalUnreadChatCount,
    staffLocations,
  } = useApp();

  const myLocation = staffLocations.find((s) => s.userId === currentUser?.id);

  // Modals state
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [arrangementModalOpen, setArrangementModalOpen] = useState(false);
  const [targetArrangement, setTargetArrangement] = useState<WorkArrangement>('WFH');
  const [lateModalOpen, setLateModalOpen] = useState(false);
  const [timeInModalOpen, setTimeInModalOpen] = useState(false);
  const [timeOutModalOpen, setTimeOutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active view tab in dashboard
  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'history' | 'schedule'>('requests');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!currentUser) return null;

  // Filter current user's requests & history
  const userLeaves = leaveRequests.filter((l) => l.userId === currentUser.id);
  const userArrangements = arrangementRequests.filter((a) => a.userId === currentUser.id);
  const userLateRequests = lateRequests.filter((l) => l.userId === currentUser.id);
  const userAttendanceHistory = attendanceRecords
    .filter((r) => r.userId === currentUser.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Determine today's badge colors and status text
  const getAttendanceStatusBadge = () => {
    if (!todayRecord || !todayRecord.timeIn) {
      if (todayRecord?.status === 'ON_LEAVE') {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>On Leave</span>
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Not Yet Timed In</span>
        </span>
      );
    }

    if (todayRecord.status === 'LATE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          <span>Late ({todayRecord.lateMinutes} mins)</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Present</span>
      </span>
    );
  };

  const hasTimedInToday = !!todayRecord?.timeIn;
  const hasTimedOutToday = !!todayRecord?.timeOut;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white shadow-xl flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white hover:text-emerald-200 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-[#0f2b5c] via-[#163870] to-[#1e3a8a] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 relative overflow-hidden">
        {/* Subtle background crest accent */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-5 pointer-events-none flex items-center justify-end pr-4">
          <Building2 className="w-64 h-64 text-amber-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Alpine Falcon Life Insurance Agency · Employee Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good day, {currentUser.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
              {currentUser.position} · {currentUser.department}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
              <div className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">
                Staff ID Code
              </div>
              <div className="font-mono font-bold text-white text-sm">
                {currentUser.staffId}
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
              <div className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">
                Approved Arrangement
              </div>
              <div className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                {currentUser.currentArrangement === 'ON_SITE' ? (
                  <>
                    <Building2 className="w-4 h-4" />
                    <span>ON-SITE (Office)</span>
                  </>
                ) : (
                  <>
                    <Home className="w-4 h-4" />
                    <span>WFH (Remote)</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S STATUS & ATTENDANCE CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-3">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Today's Official Status</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0f2b5c] mt-0.5">
              {formatDateFriendly(currentDate)}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {getAttendanceStatusBadge()}
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#0f2b5c] border border-blue-200 flex items-center gap-1.5">
              {currentUser.currentArrangement === 'ON_SITE' ? (
                <>
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Work Arrangement: On-Site</span>
                </>
              ) : (
                <>
                  <Home className="w-3.5 h-3.5 text-amber-600" />
                  <span>Work Arrangement: WFH</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Time In Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Time In</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-extrabold text-[#0f2b5c]">
              {todayRecord?.timeIn || (
                <span className="text-slate-400 text-base font-sans font-medium">
                  Not yet timed in
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Official Shift Start: {rules.workStartTime} AM (Grace: {rules.gracePeriodMinutes}m)
            </div>
          </div>

          {/* Time Out Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Time Out</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-extrabold text-[#0f2b5c]">
              {todayRecord?.timeOut || (
                <span className="text-slate-400 text-base font-sans font-medium">
                  Not yet timed out
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Official Shift End: {rules.workEndTime} PM
            </div>
          </div>

          {/* Working Hours Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Recorded Hours
            </div>
            <div className="mt-2 font-mono text-2xl font-extrabold text-[#0f2b5c]">
              {todayRecord?.totalHours ? `${todayRecord.totalHours} hrs` : '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {todayRecord?.undertimeMinutes
                ? `Undertime: ${todayRecord.undertimeMinutes} mins`
                : 'Full shift coverage'}
            </div>
          </div>

          {/* Station / Location */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>MacBook Station</span>
              {myLocation?.isOnLocation ? (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Inside Makati HQ Geofence" />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" title="Remote WFH" />
              )}
            </div>
            <div className="mt-2 text-sm font-bold text-[#0f2b5c] truncate">
              {myLocation?.isOnLocation
                ? '🟢 On Location · Makati HQ'
                : '🟡 Remote · Authorized WFH'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">
              {myLocation?.deviceModel.split('(')[0] || 'Apple MacBook Pro'} · {myLocation ? formatDistance(myLocation.distanceFromHQMeters) : '18m'} away
            </div>
          </div>
        </div>

        {/* PRIMARY TIME IN / TIME OUT BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <button
            onClick={() => setTimeInModalOpen(true)}
            disabled={hasTimedInToday}
            className={`py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md ${
              hasTimedInToday
                ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300 opacity-80 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white focus:ring-4 focus:ring-emerald-200'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-300 ring-4 ring-emerald-500/30 animate-pulse" />
            <span>
              {hasTimedInToday
                ? `TIMED IN AT ${todayRecord?.timeIn}`
                : '🟢 TIME IN TODAY'}
            </span>
          </button>

          <button
            onClick={() => setTimeOutModalOpen(true)}
            disabled={!hasTimedInToday || hasTimedOutToday}
            className={`py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md ${
              hasTimedOutToday
                ? 'bg-rose-50 text-rose-700 border-2 border-rose-300 opacity-80 cursor-not-allowed'
                : !hasTimedInToday
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white focus:ring-4 focus:ring-rose-200'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-rose-300" />
            <span>
              {hasTimedOutToday
                ? `TIMED OUT AT ${todayRecord?.timeOut}`
                : '🔴 TIME OUT TODAY'}
            </span>
          </button>
        </div>
      </div>

      {/* MACBOOK HARDWARE & GEOFENCE LOCATION TRACKING CARD */}
      <StaffMacBookLocationCard />

      {/* QUICK ACTION BUTTONS */}
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
          Quick Actions & Staff Requests
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* File Leave */}
          <button
            onClick={() => setLeaveModalOpen(true)}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-sm font-extrabold text-[#0f2b5c] flex items-center justify-between">
              <span>📅 FILE LEAVE</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Vacation, sick, or emergency leave
            </p>
          </button>

          {/* Request WFH */}
          <button
            onClick={() => {
              setTargetArrangement('WFH');
              setArrangementModalOpen(true);
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Home className="w-6 h-6 text-blue-700" />
            </div>
            <div className="text-sm font-extrabold text-[#0f2b5c] flex items-center justify-between">
              <span>🏠 REQUEST WFH</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Work from home arrangement
            </p>
          </button>

          {/* Request On-Site */}
          <button
            onClick={() => {
              setTargetArrangement('ON_SITE');
              setArrangementModalOpen(true);
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-indigo-700" />
            </div>
            <div className="text-sm font-extrabold text-[#0f2b5c] flex items-center justify-between">
              <span>🏢 REQUEST ON-SITE</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Reserve Makati Branch desk station
            </p>
          </button>

          {/* Report Late */}
          <button
            onClick={() => setLateModalOpen(true)}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6 text-rose-600" />
            </div>
            <div className="text-sm font-extrabold text-[#0f2b5c] flex items-center justify-between">
              <span>⏰ REPORT LATE</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Traffic or transit delay notice
            </p>
          </button>

          {/* Message Admin / Staff Chat */}
          <button
            onClick={() => {
              if (onOpenChat) onOpenChat();
            }}
            className="p-5 rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-500 hover:shadow-lg transition-all text-left group cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform relative">
              <MessageSquare className="w-6 h-6 text-amber-600" />
              {totalUnreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {totalUnreadChatCount}
                </span>
              )}
            </div>
            <div className="text-sm font-extrabold text-[#0f2b5c] flex items-center justify-between">
              <span>💬 STAFF CHAT</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Communicate with CEO Dulce &amp; Team
            </p>
          </button>
        </div>
      </div>

      {/* LOWER SECTION: TABS FOR MY REQUESTS, HISTORY & SCHEDULE */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Sub-Tabs Header */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('requests')}
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'requests'
                ? 'border-amber-500 text-[#0f2b5c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>MY REQUESTS ({userLeaves.length + userArrangements.length + userLateRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'history'
                ? 'border-amber-500 text-[#0f2b5c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>ATTENDANCE HISTORY ({userAttendanceHistory.length} Days)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'schedule'
                ? 'border-amber-500 text-[#0f2b5c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>OFFICIAL WORK SCHEDULE & POLICY</span>
          </button>
        </div>

        {/* Tab 1: My Requests */}
        {activeSubTab === 'requests' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0f2b5c]">
                  Active & Prior Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Track Branch Administrator review, notes, and approval status
                </p>
              </div>
            </div>

            {userLeaves.length === 0 &&
            userArrangements.length === 0 &&
            userLateRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">No requests filed yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Use the quick action buttons above to submit a request.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Leave Requests */}
                {userLeaves.map((l) => (
                  <div
                    key={l.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-shadow space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {l.leaveType}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            l.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : l.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {l.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0f2b5c]">
                        {l.startDate} to {l.endDate} ({l.numberOfDays} days)
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 italic">
                        "{l.reason}"
                      </p>
                      {l.documentName && (
                        <div className="text-[10px] text-blue-600 flex items-center gap-1 mt-1 font-medium">
                          <FileText className="w-3 h-3" />
                          <span>Attachment: {l.documentName}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <div>Filed: {l.dateFiled}</div>
                      {l.adminRemarks && (
                        <div className="text-slate-700 font-medium mt-1 bg-slate-50 p-1.5 rounded">
                          <span className="font-bold text-[#0f2b5c]">
                            Admin Remark ({l.reviewedBy}):
                          </span>{' '}
                          {l.adminRemarks}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Work Arrangement Requests */}
                {userArrangements.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-shadow space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          Work Arrangement
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            a.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : a.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0f2b5c]">
                        Change to {a.requestedArrangement} on {a.effectiveDate}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 italic">
                        "{a.reason}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <div>Filed: {a.dateFiled}</div>
                      {a.adminRemarks && (
                        <div className="text-slate-700 font-medium mt-1 bg-slate-50 p-1.5 rounded">
                          <span className="font-bold text-[#0f2b5c]">
                            Admin Remark ({a.reviewedBy}):
                          </span>{' '}
                          {a.adminRemarks}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Late Requests */}
                {userLateRequests.map((lt) => (
                  <div
                    key={lt.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-shadow space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          Late Notification
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            lt.status === 'APPROVED' || lt.status === 'NOTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lt.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {lt.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0f2b5c]">
                        Expected Arrival: {lt.actualArrivalExpected} ({lt.date})
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 italic">
                        "{lt.reason}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <div>Filed: {lt.dateFiled}</div>
                      {lt.adminRemarks && (
                        <div className="text-slate-700 font-medium mt-1 bg-slate-50 p-1.5 rounded">
                          <span className="font-bold text-[#0f2b5c]">
                            Admin Remark ({lt.reviewedBy}):
                          </span>{' '}
                          {lt.adminRemarks}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Attendance History */}
        {activeSubTab === 'history' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#0f2b5c]">
                  Attendance History & Log
                </h3>
                <p className="text-xs text-slate-500">
                  Full transparent record of biometric time-ins, time-outs, and work arrangement
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f2b5c] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Time In</th>
                    <th className="py-3 px-4 font-bold">Time Out</th>
                    <th className="py-3 px-4 font-bold">Arrangement</th>
                    <th className="py-3 px-4 font-bold">Total Hours</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Late / Undertime</th>
                    <th className="py-3 px-4 font-bold">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {userAttendanceHistory.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {formatDateWithDay(rec.date)}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {rec.timeIn || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {rec.timeOut || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          {rec.arrangement === 'ON_SITE' ? (
                            <Building2 className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <Home className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>{rec.arrangement}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#0f2b5c]">
                        {rec.totalHours ? `${rec.totalHours} hrs` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.status === 'PRESENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.status === 'LATE'
                              ? 'bg-amber-100 text-amber-900'
                              : rec.status === 'ON_LEAVE'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {rec.lateMinutes > 0 ? (
                          <span className="text-amber-700 font-bold">
                            Late {rec.lateMinutes}m
                          </span>
                        ) : rec.undertimeMinutes > 0 ? (
                          <span className="text-rose-700 font-bold">
                            Undertime {rec.undertimeMinutes}m
                          </span>
                        ) : (
                          <span className="text-emerald-700">On Time</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                        {rec.lateRequestStatus && (
                          <span className="mr-1 text-amber-700 font-semibold">
                            [Late Req: {rec.lateRequestStatus}]
                          </span>
                        )}
                        {rec.locationNote || 'Regular shift'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Schedule & Policy */}
        {activeSubTab === 'schedule' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-[#0f2b5c]">
                Official Work Schedule & Corporate Attendance Rules
              </h3>
              <p className="text-xs text-slate-500">
                AFLIA standard operational shift regulations & holiday roster
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                  Daily Shift Hours
                </div>
                <div className="text-lg font-extrabold text-[#0f2b5c]">
                  {rules.workStartTime} AM – {rules.workEndTime} PM
                </div>
                <div className="text-xs text-slate-600 mt-2 space-y-1">
                  <div>• Grace Period: {rules.gracePeriodMinutes} minutes</div>
                  <div>• 8:00 – 8:10 AM = On Time</div>
                  <div>• 8:11 AM onward = Late</div>
                  <div>• Mandatory 1-hour lunch break</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                  Assigned Work Days
                </div>
                <div className="text-lg font-extrabold text-[#0f2b5c]">
                  Monday to Friday
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  Standard 40-hour regular work week excluding declared company & statutory holidays.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                  My Base Arrangement
                </div>
                <div className="text-lg font-extrabold text-[#0f2b5c] flex items-center gap-2">
                  {currentUser.defaultArrangement === 'ON_SITE' ? (
                    <>
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <span>On-Site Default</span>
                    </>
                  ) : (
                    <>
                      <Home className="w-5 h-5 text-amber-600" />
                      <span>WFH Default</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  Current Approved: <span className="font-bold text-[#0f2b5c]">{currentUser.currentArrangement}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Holidays */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Company & National Holidays
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {rules.holidays.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#0f2b5c]">{h.name}</div>
                      <div className="text-[11px] text-slate-500">{h.date}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      Agency Non-Working
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <FileLeaveModal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
      />

      <WorkArrangementModal
        isOpen={arrangementModalOpen}
        onClose={() => setArrangementModalOpen(false)}
        presetTarget={targetArrangement}
      />

      <LateRequestModal
        isOpen={lateModalOpen}
        onClose={() => setLateModalOpen(false)}
      />

      <TimeInConfirmationModal
        isOpen={timeInModalOpen}
        onClose={() => setTimeInModalOpen(false)}
        onSuccess={showToast}
      />

      <TimeOutConfirmationModal
        isOpen={timeOutModalOpen}
        onClose={() => setTimeOutModalOpen(false)}
        onSuccess={showToast}
      />
    </div>
  );
};
