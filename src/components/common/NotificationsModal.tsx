import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCheck, Bell, Clock, Calendar, AlertTriangle, Home } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tabKey: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const {
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  if (!isOpen) return null;

  // Filter notifications relevant to current user
  const userNotifications = notifications.filter((n) => {
    if (currentUser?.role === 'admin') {
      return n.recipientId === 'user-admin' || n.recipientId === currentUser?.id;
    }
    return n.recipientId === currentUser?.id;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'LEAVE':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'ARRANGEMENT':
        return <Home className="w-4 h-4 text-blue-600" />;
      case 'LATE':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0f2b5c] text-white flex items-center justify-between border-b border-amber-500/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10 text-amber-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Notification Center</h3>
              <p className="text-xs text-amber-200/90">
                Staff requests, approvals & attendance alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">
            {userNotifications.length} Total Notices (
            {userNotifications.filter((n) => !n.isRead).length} unread)
          </span>
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {userNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium">No notifications at this time.</p>
              <p className="text-xs text-slate-400 mt-1">
                You're all caught up on staff updates.
              </p>
            </div>
          ) : (
            userNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.targetTab && onSelectTab) {
                    onSelectTab(notif.targetTab);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    : 'bg-amber-50/60 border-amber-200 text-slate-900 shadow-xs hover:bg-amber-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                      notif.isRead ? 'bg-slate-100' : 'bg-amber-100 ring-1 ring-amber-300'
                    }`}
                  >
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-bold leading-tight ${
                          notif.isRead ? 'text-slate-800' : 'text-[#0f2b5c]'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="mt-2 text-[10px] text-slate-400 font-medium flex items-center justify-between">
                      <span>{notif.timestamp}</span>
                      <span className="text-amber-700 font-semibold hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0f2b5c] text-white rounded-lg text-xs font-bold hover:bg-[#153a7a] transition-colors cursor-pointer"
          >
            Close Notification Center
          </button>
        </div>
      </div>
    </div>
  );
};
