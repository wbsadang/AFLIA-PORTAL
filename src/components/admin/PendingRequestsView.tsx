import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Calendar,
  Home,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Search,
  MessageSquare,
  ShieldCheck,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { LeaveRequest, ArrangementRequest, LateRequest, RequestStatus } from '../../types';

export const PendingRequestsView: React.FC = () => {
  const {
    leaveRequests,
    arrangementRequests,
    lateRequests,
    reviewLeave,
    reviewArrangement,
    reviewLateRequest,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'leave' | 'arrangement' | 'late'>('all');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  // Review modal state
  const [reviewModalData, setReviewModalData] = useState<{
    type: 'leave' | 'arrangement' | 'late';
    item: LeaveRequest | ArrangementRequest | LateRequest;
    action: 'APPROVED' | 'REJECTED' | 'NOTED';
  } | null>(null);
  const [adminRemarks, setAdminRemarks] = useState('');

  // Details view modal
  const [detailItem, setDetailItem] = useState<{
    type: 'leave' | 'arrangement' | 'late';
    item: LeaveRequest | ArrangementRequest | LateRequest;
  } | null>(null);

  // Combine unified requests for 'all' tab
  interface UnifiedRequest {
    id: string;
    type: 'leave' | 'arrangement' | 'late';
    typeLabel: string;
    userId: string;
    userName: string;
    userStaffId: string;
    dateDescription: string;
    reason: string;
    dateFiled: string;
    status: RequestStatus;
    adminRemarks?: string;
    rawItem: LeaveRequest | ArrangementRequest | LateRequest;
  }

  const unifiedList: UnifiedRequest[] = [
    ...leaveRequests.map((l) => ({
      id: l.id,
      type: 'leave' as const,
      typeLabel: l.leaveType,
      userId: l.userId,
      userName: l.userName,
      userStaffId: l.userStaffId,
      dateDescription: `${l.startDate} to ${l.endDate} (${l.numberOfDays}d)`,
      reason: l.reason,
      dateFiled: l.dateFiled,
      status: l.status,
      adminRemarks: l.adminRemarks,
      rawItem: l,
    })),
    ...arrangementRequests.map((a) => ({
      id: a.id,
      type: 'arrangement' as const,
      typeLabel: `Switch to ${a.requestedArrangement}`,
      userId: a.userId,
      userName: a.userName,
      userStaffId: a.userStaffId,
      dateDescription: `Effective ${a.effectiveDate}`,
      reason: a.reason,
      dateFiled: a.dateFiled,
      status: a.status,
      adminRemarks: a.adminRemarks,
      rawItem: a,
    })),
    ...lateRequests.map((lt) => ({
      id: lt.id,
      type: 'late' as const,
      typeLabel: 'Late Notification',
      userId: lt.userId,
      userName: lt.userName,
      userStaffId: lt.userStaffId,
      dateDescription: `${lt.date} (ETA: ${lt.actualArrivalExpected})`,
      reason: lt.reason,
      dateFiled: lt.dateFiled,
      status: lt.status,
      adminRemarks: lt.adminRemarks,
      rawItem: lt,
    })),
  ].sort((a, b) => b.dateFiled.localeCompare(a.dateFiled));

  // Filter based on tab, status, and search
  const filteredRequests = unifiedList.filter((req) => {
    if (activeTab !== 'all' && req.type !== activeTab) return false;
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.userName.toLowerCase().includes(q) ||
        req.userStaffId.toLowerCase().includes(q) ||
        req.reason.toLowerCase().includes(q) ||
        req.typeLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmReview = () => {
    if (!reviewModalData) return;
    const { type, item, action } = reviewModalData;

    if (type === 'leave') {
      reviewLeave(item.id, action === 'REJECTED' ? 'REJECTED' : 'APPROVED', adminRemarks);
    } else if (type === 'arrangement') {
      reviewArrangement(item.id, action === 'REJECTED' ? 'REJECTED' : 'APPROVED', adminRemarks);
    } else if (type === 'late') {
      reviewLateRequest(item.id, action as 'APPROVED' | 'NOTED' | 'REJECTED', adminRemarks);
    }

    setReviewModalData(null);
    setAdminRemarks('');
  };

  const getBadgeStyle = (status: RequestStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'NOTED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-900 border-amber-300';
    }
  };

  const pendingCountAll = unifiedList.filter((r) => r.status === 'PENDING').length;
  const pendingCountLeave = leaveRequests.filter((l) => l.status === 'PENDING').length;
  const pendingCountArr = arrangementRequests.filter((a) => a.status === 'PENDING').length;
  const pendingCountLate = lateRequests.filter((lt) => lt.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>AFLIA Executive In-Box</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0f2b5c] mt-0.5">
              Pending & Staff Requests Central
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Review and act on leave applications, telecommuting requests, and tardiness notifications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-xs">
              {pendingCountAll} Pending Action
            </span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-white text-[#0f2b5c] shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>All Requests</span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-mono">
                {pendingCountAll}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leave')}
              className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'leave'
                  ? 'bg-white text-[#0f2b5c] shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Leave</span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-mono">
                {pendingCountLeave}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('arrangement')}
              className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'arrangement'
                  ? 'bg-white text-[#0f2b5c] shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>WFH / On-Site</span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-mono">
                {pendingCountArr}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('late')}
              className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'late'
                  ? 'bg-white text-[#0f2b5c] shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>Late Slips</span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-mono">
                {pendingCountLate}
              </span>
            </button>
          </div>

          {/* Search & Status Pill */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff, ID, reason..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 text-slate-700 outline-none"
            >
              <option value="ALL">Status: All</option>
              <option value="PENDING">Pending Only</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f2b5c] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-bold">Staff Member</th>
                <th className="py-3.5 px-4 font-bold">Request Category</th>
                <th className="py-3.5 px-4 font-bold">Effective Date / Span</th>
                <th className="py-3.5 px-4 font-bold">Reason & Justification</th>
                <th className="py-3.5 px-4 font-bold">Date Filed</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-center">Action Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-70" />
                    <p className="font-semibold text-slate-600">No requests matching criteria.</p>
                    <p className="text-[11px] text-slate-400">All staff applications have been reviewed.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    {/* Staff */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0f2b5c]">{req.userName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{req.userStaffId}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        {req.type === 'leave' ? (
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        ) : req.type === 'arrangement' ? (
                          <Home className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>{req.typeLabel}</span>
                      </div>
                    </td>

                    {/* Date Span */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {req.dateDescription}
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      <div className="truncate font-normal" title={req.reason}>
                        {req.reason}
                      </div>
                      {req.adminRemarks && (
                        <div className="text-[10px] text-[#0f2b5c] font-semibold mt-0.5 truncate">
                          Admin note: {req.adminRemarks}
                        </div>
                      )}
                    </td>

                    {/* Date Filed */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {req.dateFiled}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getBadgeStyle(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </td>

                    {/* Action Controls: VIEW, APPROVE, REJECT */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* VIEW button */}
                        <button
                          onClick={() =>
                            setDetailItem({
                              type: req.type,
                              item: req.rawItem,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          title="View complete request file"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>VIEW</span>
                        </button>

                        {/* APPROVE button */}
                        {req.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => {
                                setAdminRemarks('');
                                setReviewModalData({
                                  type: req.type,
                                  item: req.rawItem,
                                  action: req.type === 'late' ? 'APPROVED' : 'APPROVED',
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              title="Approve request"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>APPROVE</span>
                            </button>

                            {/* REJECT button */}
                            <button
                              onClick={() => {
                                setAdminRemarks('');
                                setReviewModalData({
                                  type: req.type,
                                  item: req.rawItem,
                                  action: 'REJECTED',
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition-colors font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              title="Reject request"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>REJECT</span>
                            </button>

                            {/* Optional Note for Late requests */}
                            {req.type === 'late' && (
                              <button
                                onClick={() => {
                                  setAdminRemarks('');
                                  setReviewModalData({
                                    type: req.type,
                                    item: req.rawItem,
                                    action: 'NOTED',
                                  });
                                }}
                                className="px-2.5 py-1 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 transition-colors font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                title="Acknowledge / Note tardiness"
                              >
                                <span>NOTE</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRMATION / REMARKS MODAL FOR APPROVAL OR REJECTION */}
      {reviewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div
              className={`px-6 py-4 text-white flex items-center justify-between ${
                reviewModalData.action === 'APPROVED' || reviewModalData.action === 'NOTED'
                  ? 'bg-emerald-700 border-b-2 border-emerald-500'
                  : 'bg-rose-700 border-b-2 border-rose-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {reviewModalData.action === 'APPROVED' || reviewModalData.action === 'NOTED' ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <XCircle className="w-5 h-5 text-white" />
                )}
                <h3 className="font-bold text-base">
                  Confirm {reviewModalData.action}: {reviewModalData.item.userName}
                </h3>
              </div>
              <button
                onClick={() => setReviewModalData(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-700">
                You are about to mark this{' '}
                <span className="font-bold capitalize">{reviewModalData.type}</span> request as{' '}
                <span className="font-extrabold uppercase">{reviewModalData.action}</span>.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Administrator Remarks / Reason (Sent to Staff Notification)
                </label>
                <textarea
                  rows={3}
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder={
                    reviewModalData.action === 'REJECTED'
                      ? 'State required reason for rejection (e.g., Critical branch staffing shortage on selected date)...'
                      : 'Optional remarks or instructions for the staff member...'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none resize-none"
                  required={reviewModalData.action === 'REJECTED'}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewModalData(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReview}
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer ${
                    reviewModalData.action === 'APPROVED' || reviewModalData.action === 'NOTED'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm & Send Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#0f2b5c] text-white flex items-center justify-between border-b-2 border-amber-500">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Request Specification File</h3>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#0f2b5c] text-sm">{detailItem.item.userName}</div>
                  <div className="text-slate-500">{detailItem.item.userStaffId}</div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full font-bold text-[11px] border ${getBadgeStyle(
                    detailItem.item.status
                  )}`}
                >
                  {detailItem.item.status}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Request Category:</span>
                  <span className="font-bold text-slate-800 capitalize">{detailItem.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Date Filed:</span>
                  <span className="font-medium text-slate-700">{detailItem.item.dateFiled}</span>
                </div>
                <div className="py-1 border-b border-slate-100">
                  <span className="text-slate-500 block mb-1">Reason / Statement:</span>
                  <div className="p-2.5 bg-slate-50 rounded-lg text-slate-800 italic">
                    "{detailItem.item.reason}"
                  </div>
                </div>

                {'documentName' in detailItem.item && detailItem.item.documentName && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Attached File:</span>
                    <span className="font-bold text-blue-600 underline">
                      {detailItem.item.documentName}
                    </span>
                  </div>
                )}

                {detailItem.item.adminRemarks && (
                  <div className="py-1">
                    <span className="text-slate-500 block mb-1">Branch Manager Remarks:</span>
                    <div className="p-2.5 bg-amber-50 text-amber-900 rounded-lg font-medium">
                      "{detailItem.item.adminRemarks}"
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 text-right">
                <button
                  onClick={() => setDetailItem(null)}
                  className="px-4 py-2 bg-[#0f2b5c] text-white rounded-xl text-xs font-bold hover:bg-[#153a7a]"
                >
                  Close Specification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
