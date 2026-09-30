import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { LoginModal } from './components/common/LoginModal';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationsModal } from './components/common/NotificationsModal';
import { FutureReadyModal } from './components/common/FutureReadyModal';
import { StaffChatModal } from './components/chat/StaffChatModal';
import { Logo } from './components/common/Logo';
import { Shield, Sparkles, MessageSquare } from 'lucide-react';

const MainPortal: React.FC = () => {
  const { currentUser, totalUnreadChatCount } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [futureReadyOpen, setFutureReadyOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // If not logged in, display the corporate login modal
  if (!currentUser) {
    return <LoginModal />;
  }

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenFutureReady={() => setFutureReadyOpen(true)}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentUser.role === 'admin' ? (
          <AdminDashboard onOpenChat={() => setChatOpen(true)} />
        ) : (
          <StaffDashboard onOpenChat={() => setChatOpen(true)} />
        )}
      </main>

      {/* Floating Team Chat Launcher */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          onClick={() => setChatOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0f2b5c] text-white shadow-xl hover:bg-[#153a7a] hover:shadow-2xl active:scale-95 transition-all border-2 border-amber-500 cursor-pointer"
          title="Open AFLIA Staff Communication Hub"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-amber-300" />
            {totalUnreadChatCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {totalUnreadChatCount > 9 ? '9+' : totalUnreadChatCount}
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-white tracking-wide pr-1">
            Staff Chat
          </span>
        </button>
      </div>

      {/* Corporate Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" layout="mark-only" />
            <span className="font-bold text-[#0f2b5c]">
              ALPINE FALCON LIFE INSURANCE AGENCY, INC. (AFLIA)
            </span>
            <span className="text-slate-300">|</span>
            <span>Staff Management & Biometric Portal</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button
              onClick={() => setFutureReadyOpen(true)}
              className="text-amber-700 hover:text-amber-800 font-semibold cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Future-Ready Modules</span>
            </button>
            <span className="text-slate-300">·</span>
            <span>Makati Branch HQ</span>
            <span className="text-slate-300">·</span>
            <span>Confidential Internal System</span>
          </div>
        </div>
      </footer>

      {/* Shared Modals */}
      <StaffChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <FutureReadyModal
        isOpen={futureReadyOpen}
        onClose={() => setFutureReadyOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainPortal />
    </AppProvider>
  );
}
