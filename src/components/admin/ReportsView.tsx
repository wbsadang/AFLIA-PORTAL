import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { exportToCSV } from '../../utils/exportUtils';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  BarChart3,
  Building2,
  Home,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { MonthlyStaffSummary } from '../../types';

export const ReportsView: React.FC = () => {
  const { users, attendanceRecords, leaveRequests, lateRequests, currentDate } = useApp();

  const [reportType, setReportType] = useState<
    'monthly-summary' | 'daily' | 'leave' | 'arrangements' | 'late'
  >('monthly-summary');

  const [filterStaff, setFilterStaff] = useState('ALL');
  const [filterArrangement, setFilterArrangement] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Month calculation (for Sept 2026 or chosen month)
  const currentYearMonth = currentDate.substring(0, 7); // e.g. "2026-09"

  // 1. Calculate Monthly Staff Attendance Summary
  const monthlySummaries: MonthlyStaffSummary[] = useMemo(() => {
    return users
      .filter((u) => u.role !== 'admin')
      .map((staff) => {
        const staffRecords = attendanceRecords.filter(
          (r) => r.userId === staff.id && r.date.startsWith(currentYearMonth)
        );

        const daysPresent = staffRecords.filter((r) => r.status === 'PRESENT').length;
        const daysWFH = staffRecords.filter(
          (r) => r.arrangement === 'WFH' && (r.status === 'PRESENT' || r.status === 'LATE')
        ).length;
        const daysOnSite = staffRecords.filter(
          (r) => r.arrangement === 'ON_SITE' && (r.status === 'PRESENT' || r.status === 'LATE')
        ).length;
        const daysOnLeave = staffRecords.filter((r) => r.status === 'ON_LEAVE').length;
        const lateOccurrences = staffRecords.filter((r) => r.status === 'LATE').length;
        const totalLateMinutes = staffRecords.reduce((acc, r) => acc + (r.lateMinutes || 0), 0);
        const missingTimeOut = staffRecords.filter((r) => r.timeIn && !r.timeOut && r.date !== currentDate).length;

        // Assumed 22 working days in standard month
        const totalWorkingDays = 22;
        const recordedDays = daysPresent + lateOccurrences + daysOnLeave;
        const absences = Math.max(0, totalWorkingDays - recordedDays);
        const attendanceRate = parseFloat(
          (((daysPresent + lateOccurrences) / totalWorkingDays) * 100).toFixed(1)
        );

        return {
          userId: staff.id,
          fullName: staff.fullName,
          staffId: staff.staffId,
          position: staff.position,
          department: staff.department,
          totalWorkingDays,
          daysPresent: daysPresent + lateOccurrences,
          daysWFH,
          daysOnSite,
          daysOnLeave,
          lateOccurrences,
          totalLateMinutes,
          missingTimeOut,
          absences,
          attendanceRate,
        };
      });
  }, [users, attendanceRecords, currentYearMonth, currentDate]);

  // Export handlers
  const handleExport = () => {
    if (reportType === 'monthly-summary') {
      const rows = monthlySummaries.map((s) => ({
        'Staff Name': s.fullName,
        'Staff ID': s.staffId,
        Position: s.position,
        Department: s.department,
        'Working Days': s.totalWorkingDays,
        'Days Present': s.daysPresent,
        'WFH Days': s.daysWFH,
        'On-Site Days': s.daysOnSite,
        'Days On Leave': s.daysOnLeave,
        'Late Occurrences': s.lateOccurrences,
        'Total Late Minutes': s.totalLateMinutes,
        'Missing Time Out': s.missingTimeOut,
        Absences: s.absences,
        'Attendance Rate %': `${s.attendanceRate}%`,
      }));
      exportToCSV(`AFLIA_Monthly_Attendance_Summary_${currentYearMonth}`, rows);
    } else if (reportType === 'daily') {
      const rows = attendanceRecords
        .filter((r) => {
          if (filterStaff !== 'ALL' && r.userId !== filterStaff) return false;
          if (filterArrangement !== 'ALL' && r.arrangement !== filterArrangement) return false;
          if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
          return true;
        })
        .map((r) => ({
          Date: r.date,
          'Staff Name': r.userName,
          'Staff ID': r.userStaffId,
          'Time In': r.timeIn || '—',
          'Time Out': r.timeOut || '—',
          Arrangement: r.arrangement,
          Status: r.status,
          'Late Minutes': r.lateMinutes || 0,
          'Undertime Minutes': r.undertimeMinutes || 0,
          'Total Working Hours': r.totalHours || 0,
          Location: r.locationNote || '',
          'Audit Adjusted': r.correctedBy ? `Yes by ${r.correctedBy}` : 'No',
        }));
      exportToCSV(`AFLIA_Daily_Attendance_Report_${currentDate}`, rows);
    } else if (reportType === 'leave') {
      const rows = leaveRequests.map((l) => ({
        'Staff Name': l.userName,
        'Staff ID': l.userStaffId,
        'Leave Type': l.leaveType,
        'Start Date': l.startDate,
        'End Date': l.endDate,
        Days: l.numberOfDays,
        Reason: l.reason,
        'Date Filed': l.dateFiled,
        Status: l.status,
        'Admin Remarks': l.adminRemarks || '',
        'Reviewed By': l.reviewedBy || '',
      }));
      exportToCSV(`AFLIA_Leave_Report`, rows);
    } else if (reportType === 'late') {
      const rows = lateRequests.map((lt) => ({
        'Staff Name': lt.userName,
        'Staff ID': lt.userStaffId,
        Date: lt.date,
        'Expected Arrival': lt.actualArrivalExpected,
        Reason: lt.reason,
        'Additional Remarks': lt.additionalRemarks || '',
        'Date Filed': lt.dateFiled,
        Status: lt.status,
        'Admin Remarks': lt.adminRemarks || '',
      }));
      exportToCSV(`AFLIA_Late_Tardiness_Report`, rows);
    } else {
      // WFH / On-Site report
      const rows = attendanceRecords.map((r) => ({
        Date: r.date,
        'Staff Name': r.userName,
        'Staff ID': r.userStaffId,
        'Arrangement Mode': r.arrangement,
        Status: r.status,
        Location: r.locationNote || '',
      }));
      exportToCSV(`AFLIA_Work_Arrangement_Report`, rows);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" />
              <span>AFLIA Analytics & Executive Reporting</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0f2b5c] mt-0.5">
              Attendance & Operational Reports
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Generate audited attendance logs, monthly staff tallies, and export to Excel/CSV for payroll
            </p>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>EXPORT TO EXCEL / CSV</span>
          </button>
        </div>

        {/* Report Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-b border-slate-100 pb-4">
          <button
            onClick={() => setReportType('monthly-summary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              reportType === 'monthly-summary'
                ? 'bg-[#0f2b5c] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Monthly Staff Attendance Summary</span>
          </button>

          <button
            onClick={() => setReportType('daily')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              reportType === 'daily'
                ? 'bg-[#0f2b5c] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Attendance Log</span>
          </button>

          <button
            onClick={() => setReportType('leave')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              reportType === 'leave'
                ? 'bg-[#0f2b5c] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
            <span>Leave Report</span>
          </button>

          <button
            onClick={() => setReportType('arrangements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              reportType === 'arrangements'
                ? 'bg-[#0f2b5c] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>WFH / On-Site Distribution</span>
          </button>

          <button
            onClick={() => setReportType('late')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              reportType === 'late'
                ? 'bg-[#0f2b5c] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Late & Tardiness Audit</span>
          </button>
        </div>

        {/* Filters if Daily Report */}
        {reportType === 'daily' && (
          <div className="flex flex-wrap items-center gap-3 pt-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span>Filters:</span>
            </div>

            <select
              value={filterStaff}
              onChange={(e) => setFilterStaff(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
            >
              <option value="ALL">All Staff</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName}
                </option>
              ))}
            </select>

            <select
              value={filterArrangement}
              onChange={(e) => setFilterArrangement(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
            >
              <option value="ALL">All Arrangements</option>
              <option value="ON_SITE">On-Site Only</option>
              <option value="WFH">WFH Only</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="LATE">Late</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>
          </div>
        )}

        {/* 1. Monthly Staff Summary Matrix Table */}
        {reportType === 'monthly-summary' && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="font-bold text-slate-700">
                Performance Period: <span className="text-[#0f2b5c] font-extrabold">{currentYearMonth}</span>
              </div>
              <div className="text-slate-400">
                Formula: Attendance % = (Days Present + Late) / Working Days (22d)
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f2b5c] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3 font-bold">Staff Member</th>
                    <th className="py-3 px-3 font-bold text-center">Working Days</th>
                    <th className="py-3 px-3 font-bold text-center">Present</th>
                    <th className="py-3 px-3 font-bold text-center">WFH</th>
                    <th className="py-3 px-3 font-bold text-center">On-Site</th>
                    <th className="py-3 px-3 font-bold text-center">On Leave</th>
                    <th className="py-3 px-3 font-bold text-center">Late Count</th>
                    <th className="py-3 px-3 font-bold text-center">Late Mins</th>
                    <th className="py-3 px-3 font-bold text-center">Missing Out</th>
                    <th className="py-3 px-3 font-bold text-center">Absences</th>
                    <th className="py-3 px-3 font-bold text-right">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {monthlySummaries.map((s) => (
                    <tr key={s.userId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#0f2b5c]">{s.fullName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{s.staffId} · {s.position}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700">
                        {s.totalWorkingDays}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-700 bg-emerald-50/50">
                        {s.daysPresent}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700">{s.daysWFH}</td>
                      <td className="py-3 px-3 text-center text-slate-700">{s.daysOnSite}</td>
                      <td className="py-3 px-3 text-center font-semibold text-purple-700">
                        {s.daysOnLeave}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-700">
                        {s.lateOccurrences}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600">
                        {s.totalLateMinutes}m
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-500">
                        {s.missingTimeOut}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-rose-700">
                        {s.absences}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded ${
                            s.attendanceRate >= 90
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-amber-800 bg-amber-50'
                          }`}
                        >
                          {s.attendanceRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Daily Attendance Table */}
        {reportType === 'daily' && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f2b5c] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Staff Member</th>
                  <th className="py-3 px-4 font-bold">Time In</th>
                  <th className="py-3 px-4 font-bold">Time Out</th>
                  <th className="py-3 px-4 font-bold">Arrangement</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Late / Undertime</th>
                  <th className="py-3 px-4 font-bold">Total Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {attendanceRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.date}</td>
                    <td className="py-3 px-4 font-bold text-[#0f2b5c]">{r.userName}</td>
                    <td className="py-3 px-4 font-mono">{r.timeIn || '—'}</td>
                    <td className="py-3 px-4 font-mono">{r.timeOut || '—'}</td>
                    <td className="py-3 px-4 font-semibold">{r.arrangement}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'LATE'
                            ? 'bg-amber-100 text-amber-900'
                            : r.status === 'ON_LEAVE'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {r.lateMinutes > 0
                        ? `Late ${r.lateMinutes}m`
                        : r.undertimeMinutes > 0
                        ? `Undertime ${r.undertimeMinutes}m`
                        : 'On Time'}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0f2b5c]">
                      {r.totalHours ? `${r.totalHours} hrs` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Leave Report Table */}
        {reportType === 'leave' && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f2b5c] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">Staff Member</th>
                  <th className="py-3 px-4 font-bold">Leave Type</th>
                  <th className="py-3 px-4 font-bold">Start Date</th>
                  <th className="py-3 px-4 font-bold">End Date</th>
                  <th className="py-3 px-4 font-bold">Days</th>
                  <th className="py-3 px-4 font-bold">Reason</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Reviewed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {leaveRequests.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-[#0f2b5c]">{l.userName}</td>
                    <td className="py-3 px-4 font-semibold text-amber-800">{l.leaveType}</td>
                    <td className="py-3 px-4">{l.startDate}</td>
                    <td className="py-3 px-4">{l.endDate}</td>
                    <td className="py-3 px-4 font-bold">{l.numberOfDays}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{l.reason}</td>
                    <td className="py-3 px-4 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          l.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{l.reviewedBy || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Arrangements Table */}
        {reportType === 'arrangements' && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f2b5c] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Staff Member</th>
                  <th className="py-3 px-4 font-bold">Arrangement Mode</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Station Location Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {attendanceRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-700">{r.date}</td>
                    <td className="py-3 px-4 font-bold text-[#0f2b5c]">{r.userName}</td>
                    <td className="py-3 px-4 font-bold">
                      <span className="flex items-center gap-1.5">
                        {r.arrangement === 'ON_SITE' ? (
                          <>
                            <Building2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>ON_SITE</span>
                          </>
                        ) : (
                          <>
                            <Home className="w-3.5 h-3.5 text-amber-600" />
                            <span>WFH</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">{r.status}</td>
                    <td className="py-3 px-4 text-slate-500">{r.locationNote || 'Standard'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Late Table */}
        {reportType === 'late' && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f2b5c] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Staff Member</th>
                  <th className="py-3 px-4 font-bold">Shift Start</th>
                  <th className="py-3 px-4 font-bold">Arrival Time</th>
                  <th className="py-3 px-4 font-bold">Tardiness Reason</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Admin Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {lateRequests.map((lt) => (
                  <tr key={lt.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-700">{lt.date}</td>
                    <td className="py-3 px-4 font-bold text-[#0f2b5c]">{lt.userName}</td>
                    <td className="py-3 px-4 font-mono">{lt.expectedArrivalTime}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-800">
                      {lt.actualArrivalExpected}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{lt.reason}</td>
                    <td className="py-3 px-4 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          lt.status === 'APPROVED' || lt.status === 'NOTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lt.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {lt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{lt.adminRemarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
