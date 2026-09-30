import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import {
  Bell,
  Calendar,
  Clock,
  LogOut,
  UserCheck,
  ChevronDown,
  Sparkles,
  Shield,
  Briefcase,
  MessageSquare,
  Laptop,
} from 'lucide-react';
import { formatTime12, formatDateFriendly } from '../../utils/dateUtils';
import { formatDistance } from '../../utils/locationUtils';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenFutureReady: () => void;
  onOpenChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenFutureReady,
  onOpenChat,
}) => {
  const {
    currentUser,
    users,
    switchUser,
    logout,
    currentDate,
    setCurrentDate,
    unreadNotificationCount,
    totalUnreadChatCount,
    staffLocations,
  } = useApp();

  const myLocation = staffLocations.find((s) => s.userId === currentUser?.id);

  const [currentTime, setCurrentTime] = useState<string>(formatTime12(new Date()));
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime12(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0f2b5c] text-white border-b-2 border-amber-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left Brand with Official Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-white/20 flex items-center">
              <Logo size="sm" variant="color" showSubtitle={true} />
            </div>
          </div>

          {/* Center Date & Clock Info */}
          <div className="hidden lg:flex items-center gap-4 bg-white/10 px-4 py-2 rounded-xl border border-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs text-amber-200">
              <Calendar className="w-4 h-4 text-amber-400" />
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="font-medium text-white hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer text-xs"
                title="Click to simulate changing working date"
              >
                {formatDateFriendly(currentDate)}
              </button>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-white font-semibold text-xs tracking-wider">
                {currentTime}
              </span>
            </div>
          </div>

          {/* Right Action Hub */}
          <div className="flex items-center gap-3">
            {/* Future Ready Roadmap Button */}
            <button
              onClick={onOpenFutureReady}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer"
              title="View Architecture & Future Modules"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Future Modules</span>
            </button>

            {/* Staff Chat Hub Button */}
            <button
              onClick={onOpenChat}
              className="relative p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center gap-1.5"
              aria-label="Open staff communication chat"
              title="AFLIA Staff Communication Hub"
            >
              <MessageSquare className="w-5 h-5 text-amber-300" />
              <span className="hidden lg:inline text-xs font-bold text-amber-100">
                Chat
              </span>
              {totalUnreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-[#0f2b5c] animate-pulse">
                  {totalUnreadChatCount > 9 ? '9+' : totalUnreadChatCount}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Open notifications"
            >
              <Bell className="w-5 h-5 text-amber-200" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-[#0f2b5c] animate-pulse">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            {/* User Profile & Demo Switcher */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                    {currentUser.avatarInitials}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold leading-tight flex items-center gap-1 text-white">
                      <span>{currentUser.fullName}</span>
                      {currentUser.role === 'admin' ? (
                        <Shield className="w-3 h-3 text-amber-400 inline" />
                      ) : (
                        <Briefcase className="w-3 h-3 text-blue-300 inline" />
                      )}
                    </div>
                    <div className="text-[10px] text-amber-200/90 font-medium tracking-wide flex items-center gap-1.5">
                      <span>{currentUser.role === 'admin' ? 'CEO / Executive Admin' : currentUser.position}</span>
                      {myLocation && (
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                            myLocation.isOnLocation
                              ? 'bg-emerald-500/30 text-emerald-300'
                              : 'bg-amber-500/30 text-amber-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              myLocation.isOnLocation ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                            }`}
                          />
                          <span>{myLocation.isOnLocation ? 'On-Site' : 'Remote'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-300" />
                </button>

                {/* Switcher & Profile Dropdown */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Current Active User</span>
                        {myLocation?.isOnLocation ? (
                          <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
                            💻 On Location
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-800 font-extrabold bg-amber-100 px-2 py-0.5 rounded-full">
                            💻 Remote / WFH
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-[#0f2b5c] mt-0.5">
                        {currentUser.fullName}
                      </div>
                      <div className="text-xs text-slate-500">{currentUser.position}</div>
                      <div className="text-[11px] font-mono text-amber-700 mt-1">
                        ID: {currentUser.staffId} · {currentUser.currentArrangement}
                      </div>
                      {myLocation && (
                        <div className="text-[11px] text-slate-500 mt-1 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="truncate">{myLocation.deviceModel.split('(')[0]}</span>
                          <span className="font-mono text-slate-700 font-bold shrink-0">
                            {formatDistance(myLocation.distanceFromHQMeters)} away
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Fast Switch User Section for testing both Admin & Staff views */}
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Switch Demo Persona</span>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-1 text-xs">
                        {users.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.id);
                              setShowUserDropdown(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                              u.id === currentUser.id
                                ? 'bg-amber-50 font-bold text-[#0f2b5c] border border-amber-200'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="truncate mr-2">
                              {u.fullName}
                              {u.role === 'admin' ? ' (Admin)' : ''}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                u.role === 'admin'
                                  ? 'bg-[#0f2b5c] text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {u.role}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Simulator inside Dropdown for mobile */}
                    <div className="px-4 py-2 border-b border-slate-100 lg:hidden">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Working Date Simulator
                      </div>
                      <input
                        type="date"
                        value={currentDate}
                        onChange={(e) => setCurrentDate(e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded px-2 py-1"
                      />
                    </div>

                    <div className="p-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Portal</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Switcher Modal Popover (for Desktop test toggle) */}
      {showDatePicker && (
        <div className="bg-[#0b1f42] border-t border-amber-500/40 px-4 py-2 text-xs text-slate-200 flex items-center justify-center gap-3">
          <span className="text-amber-300 font-semibold">Simulate Operating Date:</span>
          <input
            type="date"
            value={currentDate}
            onChange={(e) => {
              setCurrentDate(e.target.value);
            }}
            className="bg-white text-slate-900 px-2 py-1 rounded border border-amber-400 font-medium text-xs"
          />
          <button
            onClick={() => setCurrentDate('2026-09-30')}
            className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-400 transition-colors text-xs"
          >
            Reset to Sept 30, 2026
          </button>
          <button
            onClick={() => setShowDatePicker(false)}
            className="text-slate-400 hover:text-white underline text-xs ml-2"
          >
            Close
          </button>
        </div>
      )}
    </header>
  );
};
