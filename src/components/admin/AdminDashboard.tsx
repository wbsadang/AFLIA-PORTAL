import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle2,
  Home,
  Building2,
  Clock,
  Calendar,
  AlertTriangle,
  Filter,
  Search,
  Edit,
  Eye,
  FileText,
  ShieldCheck,
  XCircle,
  Sparkles,
  MessageSquare,
  MapPin,
  Laptop,
} from 'lucide-react';
import { formatDateFriendly, formatDateWithDay } from '../../utils/dateUtils';
import { AttendanceRecord } from '../../types';
import { ManualAttendanceCorrectionModal } from './ManualAttendanceCorrectionModal';
import { PendingRequestsView } from './PendingRequestsView';
import { StaffManagementView } from './StaffManagementView';
import { ReportsView } from './ReportsView';
import { AttendanceRulesView } from './AttendanceRulesView';
import { AuditTrailView } from './AuditTrailView';
import { StaffLocationMapView } from './StaffLocationMapView';
import { MacBookTelemetryBadge } from '../common/MacBookTelemetryBadge';

interface AdminDashboardProps {
  onOpenChat?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenChat }) => {
  const {
    currentUser,
    users,
    currentDate,
    setCurrentDate,
    attendanceRecords,
    leaveRequests,
    arrangementRequests,
    lateRequests,
    reviewLeave,
    reviewArrangement,
    reviewLateRequest,
    totalUnreadChatCount,
    staffLocations,
  } = useApp();

  // Navigation tab
  const [adminTab, setAdminTab] = useState<
    'overview' | 'locations' | 'requests' | 'staff' | 'reports' | 'rules' | 'audit'
  >('overview');

  // Filters for Today's Attendance table
  const [filterDate, setFilterDate] = useState(currentDate);
  const [searchStaff, setSearchStaff] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterArrangement, setFilterArrangement] = useState('ALL');

  // Manual correction modal
  const [selectedRecordForCorrection, setSelectedRecordForCorrection] =
    useState<AttendanceRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  if (!currentUser) return null;

  // Active staff count (exclude admin or inactive)
  const regularStaff = users.filter((u) => u.role !== 'admin');
  const totalStaffCount = regularStaff.length;

  // Calculate stats for current active date
  const recordsForDate = attendanceRecords.filter((r) => r.date === filterDate);

  const presentCount = recordsForDate.filter(
    (r) => r.status === 'PRESENT' || r.status === 'LATE'
  ).length;

  const wfhCount = recordsForDate.filter(
    (r) => r.arrangement === 'WFH' && (r.status === 'PRESENT' || r.status === 'LATE')
  ).length;

  const onSiteCount = recordsForDate.filter(
    (r) => r.arrangement === 'ON_SITE' && (r.status === 'PRESENT' || r.status === 'LATE')
  ).length;

  const lateCount = recordsForDate.filter((r) => r.status === 'LATE').length;

  const onLeaveCount = recordsForDate.filter((r) => r.status === 'ON_LEAVE').length;

  const pendingRequestsCount =
    leaveRequests.filter((l) => l.status === 'PENDING').length +
    arrangementRequests.filter((a) => a.status === 'PENDING').length +
    lateRequests.filter((lt) => lt.status === 'PENDING').length;

  // Build rows for all staff on selected date (show recorded OR not timed in)
  const allStaffAttendance = regularStaff.map((staff) => {
    const rec = recordsForDate.find((r) => r.userId === staff.id);
    if (rec) return rec;

    // Default placeholder for staff not yet timed in
    const defaultPlaceholder: AttendanceRecord = {
      id: `placeholder-${filterDate}-${staff.id}`,
      userId: staff.id,
      userName: staff.fullName,
      userPosition: staff.position,
      userStaffId: staff.staffId,
      date: filterDate,
      timeIn: null,
      timeOut: null,
      arrangement: staff.currentArrangement,
      status: 'NOT_LOGGED_IN',
      lateMinutes: 0,
      undertimeMinutes: 0,
      totalHours: 0,
    };
    return defaultPlaceholder;
  });

  // Filtered rows for attendance table
  const displayedAttendance = allStaffAttendance.filter((rec) => {
    if (filterStatus !== 'ALL') {
      if (filterStatus === 'LATE' && rec.status !== 'LATE') return false;
      if (filterStatus === 'PRESENT' && rec.status !== 'PRESENT') return false;
      if (filterStatus === 'ON_LEAVE' && rec.status !== 'ON_LEAVE') return false;
      if (filterStatus === 'NOT_LOGGED_IN' && rec.status !== 'NOT_LOGGED_IN') return false;
    }
    if (filterArrangement !== 'ALL' && rec.arrangement !== filterArrangement) return false;
    if (searchStaff.trim()) {
      const q = searchStaff.toLowerCase();
      return (
        rec.userName.toLowerCase().includes(q) ||
        rec.userStaffId.toLowerCase().includes(q) ||
        rec.userPosition.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Top pending approvals to show directly on overview
  const topPendingLeaves = leaveRequests.filter((l) => l.status === 'PENDING');
  const topPendingArrangements = arrangementRequests.filter((a) => a.status === 'PENDING');
  const topPendingLates = lateRequests.filter((l) => l.status === 'PENDING');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {toastMsg && (
        <div className="p-4 rounded-xl bg-emerald-700 text-white shadow-xl flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-white hover:text-emerald-200 ml-4 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Admin Greeting Banner */}
      <div className="bg-gradient-to-r from-[#0f2b5c] via-[#163870] to-[#1e3a8a] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>AFLIA Executive Branch Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good day, Dulce Rhea
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Chief Executive Officer (CEO) · Alpine Falcon Life Insurance Agency, Inc.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
              <div className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">
                Operating Date
              </div>
              <div className="font-bold text-white text-sm">
                {formatDateFriendly(currentDate)}
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-xs">
              <div className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">
                Pending Requests
              </div>
              <div className="font-extrabold text-amber-300 text-sm">
                {pendingRequestsCount} Pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN ADMIN NAVIGATION TABS */}
      <div className="bg-white rounded-2xl p-1.5 shadow-xs border border-slate-200 flex flex-wrap gap-1">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'overview'
              ? 'bg-[#0f2b5c] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Dashboard & Attendance</span>
        </button>

        <button
          onClick={() => setAdminTab('locations')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
            adminTab === 'locations'
              ? 'bg-[#0f2b5c] text-white shadow-sm ring-2 ring-amber-400'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="relative">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
          </div>
          <span>Live MacBook Locations</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
            {staffLocations.filter((s) => s.isOnLocation).length} On-Site
          </span>
        </button>

        <button
          onClick={() => setAdminTab('requests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
            adminTab === 'requests'
              ? 'bg-[#0f2b5c] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Pending Approvals</span>
          {pendingRequestsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('staff')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'staff'
              ? 'bg-[#0f2b5c] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Staff Directory</span>
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'reports'
              ? 'bg-[#0f2b5c] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Reports & Monthly Summary</span>
        </button>

        <button
          onClick={() => setAdminTab('rules')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'rules'
              ? 'bg-[#0f2b5c] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Attendance Rules</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'audit'
              ? 'bg-[#0f2b5c] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Audit Trail</span>
        </button>

        <button
          onClick={() => {
            if (onOpenChat) onOpenChat();
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-amber-50/60 border border-amber-200/60 bg-amber-50/30"
          title="Open Staff Messaging and Direct Channels"
        >
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <span>Staff Chat &amp; Messaging</span>
          {totalUnreadChatCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] animate-pulse">
              {totalUnreadChatCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW & TODAY'S ATTENDANCE */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* TOP SUMMARY CARDS (Required by prompt) */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Today's Staff Operations Pulse ({formatDateFriendly(filterDate)})</span>
              <span className="text-[11px] text-amber-600 font-semibold">Live Real-time</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {/* Total Staff */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="text-slate-500 flex items-center justify-between text-xs font-bold">
                  <span>👥 Total Staff</span>
                </div>
                <div className="mt-2 text-2xl font-extrabold text-[#0f2b5c]">
                  {totalStaffCount}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Enrolled personnel</div>
              </div>

              {/* Present */}
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs">
                <div className="text-emerald-700 flex items-center justify-between text-xs font-bold">
                  <span>🟢 Present</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="mt-2 text-2xl font-extrabold text-emerald-800">
                  {presentCount}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">
                  {Math.round((presentCount / (totalStaffCount || 1)) * 100)}% attendance
                </div>
              </div>

              {/* WFH */}
              <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-xs">
                <div className="text-blue-700 flex items-center justify-between text-xs font-bold">
                  <span>🏠 WFH</span>
                  <Home className="w-3.5 h-3.5" />
                </div>
                <div className="mt-2 text-2xl font-extrabold text-blue-900">
                  {wfhCount}
                </div>
                <div className="text-[10px] text-blue-600 font-medium mt-1">Telecommuting</div>
              </div>

              {/* On-Site */}
              <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-xs">
                <div className="text-indigo-700 flex items-center justify-between text-xs font-bold">
                  <span>🏢 On-Site</span>
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="mt-2 text-2xl font-extrabold text-indigo-900">
                  {onSiteCount}
                </div>
                <div className="text-[10px] text-indigo-600 font-medium mt-1">Makati HQ Office</div>
              </div>

              {/* Late */}
              <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs">
                <div className="text-amber-800 flex items-center justify-between text-xs font-bold">
                  <span>⏰ Late</span>
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="mt-2 text-2xl font-extrabold text-amber-900">
                  {lateCount}
                </div>
                <div className="text-[10px] text-amber-700 font-medium mt-1">Beyond grace period</div>
              </div>

              {/* On Leave */}
              <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-xs">
                <div className="text-purple-700 flex items-center justify-between text-xs font-bold">
                  <span>📅 On Leave</span>
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="mt-2 text-2xl font-extrabold text-purple-900">
                  {onLeaveCount}
                </div>
                <div className="text-[10px] text-purple-600 font-medium mt-1">Approved absence</div>
              </div>

              {/* Pending Requests */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 shadow-xs">
                <div className="text-amber-900 flex items-center justify-between text-xs font-bold">
                  <span>⚠️ Pending</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <div className="mt-2 text-2xl font-extrabold text-[#0f2b5c]">
                  {pendingRequestsCount}
                </div>
                <div className="text-[10px] text-amber-800 font-semibold mt-1">Requires review</div>
              </div>
            </div>
          </div>

          {/* QUICK PENDING APPROVALS BAR (If any pending) */}
          {pendingRequestsCount > 0 && (
            <div className="bg-amber-50/90 border border-amber-300 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="font-extrabold text-sm text-[#0f2b5c]">
                    Quick Pending Approvals Inbox ({pendingRequestsCount})
                  </h3>
                </div>
                <button
                  onClick={() => setAdminTab('requests')}
                  className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
                >
                  View Full Request Inbox →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {topPendingLeaves.slice(0, 1).map((l) => (
                  <div key={l.id} className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                        <span>{l.leaveType}</span>
                        <span>{l.numberOfDays}d</span>
                      </div>
                      <div className="font-extrabold text-[#0f2b5c] mt-1">{l.userName}</div>
                      <div className="text-slate-500 text-[11px] truncate mt-0.5">"{l.reason}"</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => reviewLeave(l.id, 'APPROVED', 'Approved by Branch Manager')}
                        className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewLeave(l.id, 'REJECTED', 'Cannot be accommodated due to coverage')}
                        className="py-1 px-2 rounded-lg bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200 hover:bg-rose-100"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}

                {topPendingArrangements.slice(0, 1).map((a) => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-blue-800">
                        <span>Request to switch to {a.requestedArrangement}</span>
                        <span>{a.effectiveDate}</span>
                      </div>
                      <div className="font-extrabold text-[#0f2b5c] mt-1">{a.userName}</div>
                      <div className="text-slate-500 text-[11px] truncate mt-0.5">"{a.reason}"</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => reviewArrangement(a.id, 'APPROVED', 'Approved by Branch Manager')}
                        className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewArrangement(a.id, 'REJECTED', 'Office station presence required')}
                        className="py-1 px-2 rounded-lg bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200 hover:bg-rose-100"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}

                {topPendingLates.slice(0, 1).map((lt) => (
                  <div key={lt.id} className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-rose-800">
                        <span>Late Slip: {lt.actualArrivalExpected}</span>
                        <span>{lt.date}</span>
                      </div>
                      <div className="font-extrabold text-[#0f2b5c] mt-1">{lt.userName}</div>
                      <div className="text-slate-500 text-[11px] truncate mt-0.5">"{lt.reason}"</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => reviewLateRequest(lt.id, 'APPROVED', 'Approved. Record remains intact.')}
                        className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewLateRequest(lt.id, 'NOTED', 'Noted by supervisor')}
                        className="py-1 px-2 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200 hover:bg-blue-100"
                      >
                        Note
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TODAY'S ATTENDANCE TABLE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Real-time Operations Registry</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#0f2b5c] mt-0.5">
                  Today's Staff Attendance ({formatDateFriendly(filterDate)})
                </h3>
              </div>

              {/* Date Filter selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Inspect Date:</span>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 outline-none"
                />
              </div>
            </div>

            {/* Filter Bar (Date, Staff, Status, WFH, On-Site, Late, Leave) */}
            <div className="flex flex-wrap items-center gap-3 pt-4 text-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchStaff}
                  onChange={(e) => setSearchStaff(e.target.value)}
                  placeholder="Filter by staff name, ID, or position..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                />
              </div>

              <select
                value={filterArrangement}
                onChange={(e) => setFilterArrangement(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-semibold"
              >
                <option value="ALL">All Arrangements</option>
                <option value="ON_SITE">🏢 On-Site</option>
                <option value="WFH">🏠 WFH</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-semibold"
              >
                <option value="ALL">All Attendance Statuses</option>
                <option value="PRESENT">🟢 Present</option>
                <option value="LATE">⏰ Late</option>
                <option value="ON_LEAVE">📅 On Leave</option>
                <option value="NOT_LOGGED_IN">⚪ Not Yet Timed In</option>
              </select>
            </div>

            {/* Table */}
            <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f2b5c] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-bold">Staff Member</th>
                    <th className="py-3 px-4 font-bold">MacBook &amp; Location</th>
                    <th className="py-3 px-4 font-bold">Time In</th>
                    <th className="py-3 px-4 font-bold">Time Out</th>
                    <th className="py-3 px-4 font-bold">Arrangement</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Late / Undertime</th>
                    <th className="py-3 px-4 font-bold">Station / Remarks</th>
                    <th className="py-3 px-4 font-bold text-center">Admin Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {displayedAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        No attendance records match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    displayedAttendance.map((rec) => {
                      const staffLoc = staffLocations.find((s) => s.userId === rec.userId);
                      return (
                      <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#0f2b5c]">{rec.userName}</div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {rec.userStaffId} · {rec.userPosition}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <MacBookTelemetryBadge
                            location={staffLoc}
                            compact
                            onClick={() => setAdminTab('locations')}
                          />
                        </td>

                        <td className="py-3 px-4 font-mono font-medium">
                          {rec.timeIn ? (
                            <span className="font-bold text-slate-900">{rec.timeIn}</span>
                          ) : (
                            <span className="text-slate-400 italic">Not yet timed in</span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono font-medium">
                          {rec.timeOut ? (
                            <span className="font-bold text-slate-900">{rec.timeOut}</span>
                          ) : (
                            <span className="text-slate-400 italic">Not yet timed out</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            {rec.arrangement === 'ON_SITE' ? (
                              <>
                                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                                <span>On-Site</span>
                              </>
                            ) : (
                              <>
                                <Home className="w-3.5 h-3.5 text-amber-600" />
                                <span>WFH</span>
                              </>
                            )}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              rec.status === 'PRESENT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : rec.status === 'LATE'
                                ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300'
                                : rec.status === 'ON_LEAVE'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {rec.status === 'NOT_LOGGED_IN' ? 'Not Timed In' : rec.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          {rec.lateMinutes > 0 ? (
                            <span className="text-amber-800 font-bold">
                              Late: {rec.lateMinutes}m
                            </span>
                          ) : rec.undertimeMinutes > 0 ? (
                            <span className="text-rose-700 font-bold">
                              Undertime: {rec.undertimeMinutes}m
                            </span>
                          ) : rec.timeIn ? (
                            <span className="text-emerald-700">On Time</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                          {rec.lateRequestStatus && (
                            <span className="mr-1 text-amber-700 font-bold">
                              [Late Slip: {rec.lateRequestStatus}]
                            </span>
                          )}
                          {rec.correctionReason && (
                            <span className="mr-1 text-blue-700 font-semibold">
                              [Audited Override]
                            </span>
                          )}
                          {rec.locationNote || 'Regular duty'}
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => setSelectedRecordForCorrection(rec)}
                            className="px-2.5 py-1 rounded-lg text-[#0f2b5c] bg-slate-100 hover:bg-slate-200 transition-colors font-bold text-[11px] flex items-center gap-1 mx-auto cursor-pointer"
                            title="Audited Manual Attendance Adjustment"
                          >
                            <Edit className="w-3 h-3 text-amber-600" />
                            <span>Adjust</span>
                          </button>
                        </td>
                      </tr>
                    );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LIVE STAFF LOCATIONS & MACBOOK GPS RADAR */}
      {adminTab === 'locations' && <StaffLocationMapView />}

      {/* TAB 2: PENDING REQUESTS INBOX */}
      {adminTab === 'requests' && <PendingRequestsView />}

      {/* TAB 3: STAFF DIRECTORY */}
      {adminTab === 'staff' && <StaffManagementView />}

      {/* TAB 4: REPORTS & MONTHLY SUMMARY */}
      {adminTab === 'reports' && <ReportsView />}

      {/* TAB 5: ATTENDANCE RULES & SETTINGS */}
      {adminTab === 'rules' && <AttendanceRulesView />}

      {/* TAB 6: AUDIT TRAIL */}
      {adminTab === 'audit' && <AuditTrailView />}

      {/* MANUAL CORRECTION MODAL */}
      <ManualAttendanceCorrectionModal
        isOpen={!!selectedRecordForCorrection}
        onClose={() => setSelectedRecordForCorrection(null)}
        record={selectedRecordForCorrection}
        onSuccess={showToast}
      />
    </div>
  );
};
