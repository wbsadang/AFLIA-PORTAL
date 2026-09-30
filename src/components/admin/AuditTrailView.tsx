import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Search,
  Filter,
  Clock,
  User,
  ArrowRight,
  FileCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedCategory !== 'ALL' && log.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.actorName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportAudit = () => {
    const rows = filteredLogs.map((l) => ({
      Timestamp: l.timestamp,
      Date: l.date,
      Time: l.time,
      Actor: l.actorName,
      Role: l.actorRole,
      Action: l.action,
      Category: l.category,
      'Previous Status': l.previousStatus || '—',
      'New Status': l.newStatus || '—',
      'Audit Details': l.details,
    }));
    exportToCSV('AFLIA_Official_Audit_Trail', rows);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'ATTENDANCE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'LEAVE':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ARRANGEMENT':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'LATE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'STAFF':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Immutable Governance & Activity Log</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0f2b5c] mt-0.5">
              Admin Compliance Audit Trail
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Permanent chronological record of all administrative approvals, biometric clock-ins, manual corrections, and account adjustments
            </p>
          </div>

          <button
            onClick={handleExportAudit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actor, action, or justification..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 text-slate-700 outline-none"
            >
              <option value="ALL">All Event Categories ({auditLogs.length})</option>
              <option value="ATTENDANCE">Attendance & Clock Logs</option>
              <option value="LEAVE">Leave Approvals</option>
              <option value="ARRANGEMENT">Work Arrangement</option>
              <option value="LATE">Late Notifications</option>
              <option value="STAFF">Staff Enrollment / Updates</option>
              <option value="RULES">Rules & Policy Updates</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f2b5c] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-bold">Timestamp & Date</th>
                <th className="py-3.5 px-4 font-bold">Authorized Actor</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Action Performed</th>
                <th className="py-3.5 px-4 font-bold">Status Shift</th>
                <th className="py-3.5 px-4 font-bold">Full Audit Verification Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No matching audit records.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#0f2b5c]">{log.date}</div>
                      <div className="text-[10px] font-mono text-slate-400">{log.time}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-amber-600" />
                        <span>{log.actorName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{log.actorRole}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadge(
                          log.category
                        )}`}
                      >
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {log.previousStatus || log.newStatus ? (
                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                          <span className="text-slate-400 font-semibold">
                            {log.previousStatus || '—'}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-bold text-[#0f2b5c]">
                            {log.newStatus || '—'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Recorded</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-md">
                      <div className="leading-relaxed">{log.details}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
