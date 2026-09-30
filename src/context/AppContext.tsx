import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  AttendanceRecord,
  LeaveRequest,
  ArrangementRequest,
  LateRequest,
  AttendanceRules,
  AuditLog,
  NotificationItem,
  WorkArrangement,
  RequestStatus,
  AttendanceStatus,
  ChatChannel,
  ChatMessage,
  ChatAttachment,
  StaffLocationRecord,
  GeofenceConfig,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_RULES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ARRANGEMENT_REQUESTS,
  INITIAL_LATE_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  TODAY_DATE,
} from '../data/mockData';
import { INITIAL_CHANNELS, INITIAL_MESSAGES } from '../data/chatData';
import { INITIAL_STAFF_LOCATIONS } from '../data/locationData';
import {
  AFLIA_HQ_GEOFENCE,
  calculateDistanceInMeters,
  formatDistance,
  getBrowserCoordinates,
} from '../utils/locationUtils';
import {
  formatTime12,
  calculateLateMinutes,
  calculateUndertimeMinutes,
  calculateWorkingHours,
} from '../utils/dateUtils';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  currentDate: string;
  setCurrentDate: (date: string) => void;
  rules: AttendanceRules;
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  arrangementRequests: ArrangementRequest[];
  lateRequests: LateRequest[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;

  // Auth & User Management
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  addStaff: (user: Omit<User, 'id' | 'avatarInitials'>) => void;
  updateStaff: (userId: string, data: Partial<User>) => void;
  toggleStaffStatus: (userId: string) => void;

  // Attendance
  todayRecord: AttendanceRecord | undefined;
  timeIn: (locationNote?: string) => { success: boolean; message: string };
  timeOut: () => { success: boolean; message: string };
  correctAttendanceRecord: (
    recordId: string,
    updates: Partial<AttendanceRecord>,
    mandatoryReason: string
  ) => { success: boolean; message: string };

  // Requests
  fileLeave: (
    data: Omit<LeaveRequest, 'id' | 'userId' | 'userName' | 'userStaffId' | 'dateFiled' | 'status'>
  ) => void;
  reviewLeave: (requestId: string, status: 'APPROVED' | 'REJECTED', remarks?: string) => void;

  fileArrangement: (
    data: Omit<ArrangementRequest, 'id' | 'userId' | 'userName' | 'userStaffId' | 'dateFiled' | 'status'>
  ) => void;
  reviewArrangement: (requestId: string, status: 'APPROVED' | 'REJECTED', remarks?: string) => void;

  fileLateRequest: (
    data: Omit<LateRequest, 'id' | 'userId' | 'userName' | 'userStaffId' | 'dateFiled' | 'status'>
  ) => void;
  reviewLateRequest: (
    requestId: string,
    status: 'APPROVED' | 'NOTED' | 'REJECTED',
    remarks?: string
  ) => void;

  // Rules & Admin
  updateAttendanceRules: (newRules: AttendanceRules) => void;

  // Notifications
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;

  // Chat & Messaging
  chatChannels: ChatChannel[];
  chatMessages: ChatMessage[];
  activeChannelId: string;
  setActiveChannelId: (channelId: string) => void;
  sendChatMessage: (
    channelId: string,
    content: string,
    attachments?: ChatAttachment[]
  ) => void;
  openDirectMessageWithUser: (targetUserId: string) => string;
  markChannelAsRead: (channelId: string) => void;
  addChatReaction: (messageId: string, emoji: string) => void;
  totalUnreadChatCount: number;

  // MacBook Location Tracking & Geofence
  staffLocations: StaffLocationRecord[];
  geofenceSettings: GeofenceConfig;
  updateUserMacBookLocation: (userId: string, data: Partial<StaffLocationRecord>) => void;
  updateGeofenceSettings: (settings: Partial<GeofenceConfig>) => void;
  pingMacBookLocation: (userId?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'aflia_users',
  RULES: 'aflia_rules',
  ATTENDANCE: 'aflia_attendance',
  LEAVES: 'aflia_leaves',
  ARRANGEMENTS: 'aflia_arrangements',
  LATES: 'aflia_lates',
  AUDIT: 'aflia_audit',
  NOTIFS: 'aflia_notifs',
  CURRENT_USER_ID: 'aflia_current_user_id',
  CURRENT_DATE: 'aflia_current_date',
  CHAT_CHANNELS: 'aflia_chat_channels',
  CHAT_MESSAGES: 'aflia_chat_messages',
  ACTIVE_CHANNEL_ID: 'aflia_active_channel_id',
  STAFF_LOCATIONS: 'aflia_staff_locations',
  GEOFENCE_SETTINGS: 'aflia_geofence_settings',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialize with seed data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved && saved.includes('Dulce Rhea Buling')) {
      return JSON.parse(saved);
    }
    return INITIAL_USERS;
  });

  const [currentDate, setCurrentDate] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_DATE);
    return saved || TODAY_DATE;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user-admin';
  });

  const [rules, setRules] = useState<AttendanceRules>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RULES);
    return saved ? JSON.parse(saved) : INITIAL_RULES;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (saved && saved.includes('Merelil Mitra')) {
      return JSON.parse(saved);
    }
    return INITIAL_ATTENDANCE;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
    if (saved && saved.includes('Merelil Mitra')) {
      return JSON.parse(saved);
    }
    return INITIAL_LEAVE_REQUESTS;
  });

  const [arrangementRequests, setArrangementRequests] = useState<ArrangementRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ARRANGEMENTS);
    if (saved && saved.includes('Merelil Mitra')) {
      return JSON.parse(saved);
    }
    return INITIAL_ARRANGEMENT_REQUESTS;
  });

  const [lateRequests, setLateRequests] = useState<LateRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LATES);
    return saved ? JSON.parse(saved) : INITIAL_LATE_REQUESTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (saved && saved.includes('Merelil Mitra')) {
      return JSON.parse(saved);
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    if (saved && saved.includes('Merelil Mitra')) {
      return JSON.parse(saved);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Chat state
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT_CHANNELS);
    if (saved && saved.includes('Merelil Mitra')) {
      return JSON.parse(saved);
    }
    return INITIAL_CHANNELS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (saved && saved.includes('Dulce Rhea Buling')) {
      return JSON.parse(saved);
    }
    return INITIAL_MESSAGES;
  });

  const [activeChannelId, setActiveChannelId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHANNEL_ID);
    return saved || 'ch-announcements';
  });

  // Staff MacBook Location Tracking State
  const [staffLocations, setStaffLocations] = useState<StaffLocationRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF_LOCATIONS);
    if (saved && saved.includes('Merelil Mitra')) {
      return JSON.parse(saved);
    }
    return INITIAL_STAFF_LOCATIONS;
  });

  const [geofenceSettings, setGeofenceSettings] = useState<GeofenceConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GEOFENCE_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return AFLIA_HQ_GEOFENCE;
      }
    }
    return AFLIA_HQ_GEOFENCE;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARRANGEMENTS, JSON.stringify(arrangementRequests));
  }, [arrangementRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LATES, JSON.stringify(lateRequests));
  }, [lateRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT_CHANNELS, JSON.stringify(chatChannels));
  }, [chatChannels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CHANNEL_ID, activeChannelId);
  }, [activeChannelId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF_LOCATIONS, JSON.stringify(staffLocations));
  }, [staffLocations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEOFENCE_SETTINGS, JSON.stringify(geofenceSettings));
  }, [geofenceSettings]);

  // Real-time synchronization across browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.CHAT_MESSAGES && e.newValue) {
        setChatMessages(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEYS.CHAT_CHANNELS && e.newValue) {
        setChatChannels(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DATE, currentDate);
  }, [currentDate]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  // Unread notifications for current user (staff gets their user-specific, admin gets both admin and broadcast)
  const unreadNotificationCount = notifications.filter(
    (n) => !n.isRead && (currentUser?.role === 'admin' ? n.recipientId === 'user-admin' || n.recipientId === currentUser?.id : n.recipientId === currentUser?.id)
  ).length;

  const todayRecord = currentUser
    ? attendanceRecords.find(
        (r) => r.userId === currentUser.id && r.date === currentDate
      )
    : undefined;

  // Helper for audit logging
  const recordAudit = (
    action: string,
    details: string,
    category: AuditLog['category'],
    previousStatus?: string,
    newStatus?: string
  ) => {
    const now = new Date();
    const timeFormatted = formatTime12(now);
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      actorId: currentUser ? currentUser.id : 'system',
      actorName: currentUser ? currentUser.fullName : 'System Automation',
      actorRole: currentUser ? (currentUser.role === 'admin' ? 'Administrator' : currentUser.position) : 'System',
      action,
      date: currentDate,
      time: timeFormatted,
      timestamp: now.toISOString(),
      previousStatus,
      newStatus,
      details,
      category,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Auth functions
  const login = (email: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUserId(found.id);
      recordAudit('User Signed In', `${found.fullName} authenticated to portal.`, 'STAFF');
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      recordAudit('User Signed Out', `${currentUser.fullName} logged out.`, 'STAFF');
    }
    setCurrentUserId('');
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUserId(found.id);
      recordAudit('User Switched Account', `Active session shifted to ${found.fullName} (${found.role}).`, 'STAFF');
    }
  };

  const addStaff = (userData: Omit<User, 'id' | 'avatarInitials'>) => {
    const initials = userData.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      avatarInitials: initials || 'AF',
    };

    setUsers((prev) => [...prev, newUser]);
    recordAudit(
      'Staff Account Created',
      `${currentUser?.fullName || 'Admin'} enrolled new staff member: ${newUser.fullName} (${newUser.staffId}).`,
      'STAFF'
    );
  };

  const updateStaff = (userId: string, data: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
    );
    const target = users.find((u) => u.id === userId);
    recordAudit(
      'Staff Information Modified',
      `${currentUser?.fullName || 'Admin'} updated profile settings for ${target?.fullName || userId}.`,
      'STAFF'
    );
  };

  const toggleStaffStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          recordAudit(
            'Staff Status Changed',
            `${currentUser?.fullName || 'Admin'} toggled ${u.fullName} account to ${newStatus}.`,
            'STAFF',
            u.status,
            newStatus
          );
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  // TIME IN logic
  const timeIn = (locationNote?: string) => {
    if (!currentUser) return { success: false, message: 'Please sign in first.' };

    const existing = attendanceRecords.find(
      (r) => r.userId === currentUser.id && r.date === currentDate
    );

    if (existing && existing.timeIn) {
      return {
        success: false,
        message: `You have already timed in today at ${existing.timeIn}. Duplicate time-in is strictly prevented.`,
      };
    }

    const now = new Date();
    const formattedNowTime = formatTime12(now);
    const lateMins = calculateLateMinutes(
      formattedNowTime,
      rules.workStartTime,
      rules.gracePeriodMinutes
    );
    const status: AttendanceStatus = lateMins > 0 ? 'LATE' : 'PRESENT';

    const userLoc = staffLocations.find((s) => s.userId === currentUser.id);
    const macBookNote = userLoc
      ? userLoc.isOnLocation
        ? `[💻 MacBook Pro · On Location Makati HQ (${formatDistance(userLoc.distanceFromHQMeters)})]`
        : `[💻 MacBook · Remote WFH (${formatDistance(userLoc.distanceFromHQMeters)})]`
      : '';

    const defaultLoc =
      currentUser.currentArrangement === 'ON_SITE'
        ? `AFLIA Makati Branch HQ - Level 12 ${macBookNote}`
        : `Authorized Telecommuting Residence / Remote ${macBookNote}`;

    const finalLocationNote = locationNote ? `${locationNote} ${macBookNote}` : defaultLoc;

    if (existing) {
      // Update existing placeholder
      const updated: AttendanceRecord = {
        ...existing,
        timeIn: formattedNowTime,
        status,
        lateMinutes: lateMins,
        arrangement: currentUser.currentArrangement,
        locationNote: finalLocationNote,
      };

      setAttendanceRecords((prev) =>
        prev.map((r) => (r.id === existing.id ? updated : r))
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${currentDate.replace(/-/g, '')}-${currentUser.id}`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        userPosition: currentUser.position,
        userStaffId: currentUser.staffId,
        date: currentDate,
        timeIn: formattedNowTime,
        timeOut: null,
        arrangement: currentUser.currentArrangement,
        status,
        lateMinutes: lateMins,
        undertimeMinutes: 0,
        totalHours: 0,
        locationNote: finalLocationNote,
      };

      setAttendanceRecords((prev) => [newRecord, ...prev]);
    }

    recordAudit(
      'Time In Recorded',
      `${currentUser.fullName} timed in at ${formattedNowTime} (${currentUser.currentArrangement}). ${
        lateMins > 0 ? `Late by ${lateMins} minutes.` : 'On time.'
      }`,
      'ATTENDANCE',
      'NOT_LOGGED_IN',
      status
    );

    return {
      success: true,
      message: `Time In confirmed at ${formattedNowTime}. Work Arrangement: ${currentUser.currentArrangement}.`,
    };
  };

  // TIME OUT logic
  const timeOut = () => {
    if (!currentUser) return { success: false, message: 'Please sign in first.' };

    const existing = attendanceRecords.find(
      (r) => r.userId === currentUser.id && r.date === currentDate
    );

    if (!existing || !existing.timeIn) {
      return {
        success: false,
        message: 'Cannot record Time Out because you have not timed in today.',
      };
    }

    if (existing.timeOut) {
      return {
        success: false,
        message: `You have already timed out today at ${existing.timeOut}. Duplicate time-out is prevented.`,
      };
    }

    const now = new Date();
    const formattedNowTime = formatTime12(now);
    const undertime = calculateUndertimeMinutes(formattedNowTime, rules.workEndTime);
    const totalHours = calculateWorkingHours(
      existing.timeIn,
      formattedNowTime,
      rules.lunchBreakMinutes
    );

    const updated: AttendanceRecord = {
      ...existing,
      timeOut: formattedNowTime,
      undertimeMinutes: undertime,
      totalHours,
    };

    setAttendanceRecords((prev) =>
      prev.map((r) => (r.id === existing.id ? updated : r))
    );

    recordAudit(
      'Time Out Recorded',
      `${currentUser.fullName} timed out at ${formattedNowTime}. Total working hours: ${totalHours} hrs.${
        undertime > 0 ? ` Undertime: ${undertime} mins.` : ''
      }`,
      'ATTENDANCE',
      existing.status,
      existing.status
    );

    return {
      success: true,
      message: `Time Out recorded at ${formattedNowTime}. Worked: ${totalHours} hrs.${
        undertime > 0 ? ` Undertime: ${undertime} mins.` : ''
      }`,
    };
  };

  // Attendance manual correction by Admin
  const correctAttendanceRecord = (
    recordId: string,
    updates: Partial<AttendanceRecord>,
    mandatoryReason: string
  ) => {
    if (!mandatoryReason.trim()) {
      return {
        success: false,
        message: 'Mandatory reason is required to correct attendance for compliance auditing.',
      };
    }

    const target = attendanceRecords.find((r) => r.id === recordId);
    if (!target) return { success: false, message: 'Record not found.' };

    const nowStr = formatTime12(new Date());
    const correctedRecord: AttendanceRecord = {
      ...target,
      ...updates,
      correctionReason: mandatoryReason,
      correctedBy: currentUser?.fullName || 'Administrator',
      correctedAt: `${currentDate} ${nowStr}`,
    };

    setAttendanceRecords((prev) =>
      prev.map((r) => (r.id === recordId ? correctedRecord : r))
    );

    recordAudit(
      'Attendance Record Manually Adjusted',
      `${currentUser?.fullName || 'Admin'} adjusted record for ${target.userName} on ${target.date}. Reason: "${mandatoryReason}". Previous: [In: ${target.timeIn || 'None'}, Out: ${target.timeOut || 'None'}, Status: ${target.status}]. New: [In: ${correctedRecord.timeIn || 'None'}, Out: ${correctedRecord.timeOut || 'None'}, Status: ${correctedRecord.status}].`,
      'ATTENDANCE',
      target.status,
      correctedRecord.status
    );

    return { success: true, message: 'Attendance record updated and logged to audit trail.' };
  };

  // Leave Request
  const fileLeave = (
    data: Omit<LeaveRequest, 'id' | 'userId' | 'userName' | 'userStaffId' | 'dateFiled' | 'status'>
  ) => {
    if (!currentUser) return;
    const now = new Date();
    const newReq: LeaveRequest = {
      ...data,
      id: `leave-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userStaffId: currentUser.staffId,
      dateFiled: `${currentDate} ${formatTime12(now)}`,
      status: 'PENDING',
    };

    setLeaveRequests((prev) => [newReq, ...prev]);

    // Notify Admin
    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: 'user-admin',
      title: `New ${data.leaveType} Filed`,
      message: `${currentUser.fullName} filed ${data.leaveType} for ${data.startDate} to ${data.endDate} (${data.numberOfDays} days).`,
      type: 'LEAVE',
      timestamp: `${currentDate} ${formatTime12(now)}`,
      isRead: false,
      targetTab: 'requests',
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    recordAudit(
      'Leave Request Submitted',
      `${currentUser.fullName} filed ${data.leaveType} for ${data.startDate} to ${data.endDate}. Reason: "${data.reason}".`,
      'LEAVE',
      'NONE',
      'PENDING'
    );
  };

  const reviewLeave = (requestId: string, status: 'APPROVED' | 'REJECTED', remarks?: string) => {
    const target = leaveRequests.find((l) => l.id === requestId);
    if (!target) return;

    const now = new Date();
    const timestamp = `${currentDate} ${formatTime12(now)}`;

    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === requestId
          ? {
              ...l,
              status,
              adminRemarks: remarks,
              reviewedBy: currentUser?.fullName || 'Branch Manager',
              reviewedAt: timestamp,
            }
          : l
      )
    );

    // If approved and the leave spans today's date, mark employee as ON_LEAVE for today
    if (status === 'APPROVED') {
      if (target.startDate <= currentDate && target.endDate >= currentDate) {
        setAttendanceRecords((prev) => {
          const existing = prev.find(
            (r) => r.userId === target.userId && r.date === currentDate
          );
          if (existing) {
            return prev.map((r) =>
              r.id === existing.id
                ? {
                    ...r,
                    status: 'ON_LEAVE',
                    locationNote: `Approved ${target.leaveType}`,
                  }
                : r
            );
          } else {
            const leaveRecord: AttendanceRecord = {
              id: `att-${currentDate.replace(/-/g, '')}-${target.userId}`,
              userId: target.userId,
              userName: target.userName,
              userPosition: 'Staff',
              userStaffId: target.userStaffId,
              date: currentDate,
              timeIn: null,
              timeOut: null,
              arrangement: 'ON_SITE',
              status: 'ON_LEAVE',
              lateMinutes: 0,
              undertimeMinutes: 0,
              totalHours: 0,
              locationNote: `Approved ${target.leaveType}`,
            };
            return [leaveRecord, ...prev];
          }
        });
      }
    }

    // In-system notification to staff
    const staffNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: target.userId,
      title: `Leave Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      message: `Your ${target.leaveType} for ${target.startDate} to ${target.endDate} was ${status.toLowerCase()} by ${currentUser?.fullName || 'Branch Manager'}.${remarks ? ` Note: "${remarks}"` : ''}`,
      type: 'LEAVE',
      timestamp,
      isRead: false,
      targetTab: 'leave',
    };
    setNotifications((prev) => [staffNotif, ...prev]);

    recordAudit(
      `Leave Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      `${currentUser?.fullName || 'Admin'} ${status.toLowerCase()} ${target.userName}'s ${target.leaveType} (${target.startDate} - ${target.endDate}). Remarks: "${remarks || 'None'}".`,
      'LEAVE',
      target.status,
      status
    );
  };

  // Work Arrangement Request
  const fileArrangement = (
    data: Omit<ArrangementRequest, 'id' | 'userId' | 'userName' | 'userStaffId' | 'dateFiled' | 'status'>
  ) => {
    if (!currentUser) return;
    const now = new Date();
    const newReq: ArrangementRequest = {
      ...data,
      id: `arr-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userStaffId: currentUser.staffId,
      dateFiled: `${currentDate} ${formatTime12(now)}`,
      status: 'PENDING',
    };

    setArrangementRequests((prev) => [newReq, ...prev]);

    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: 'user-admin',
      title: 'New Work Arrangement Request',
      message: `${currentUser.fullName} requested ${data.requestedArrangement} for ${data.effectiveDate}. Reason: "${data.reason}".`,
      type: 'ARRANGEMENT',
      timestamp: `${currentDate} ${formatTime12(now)}`,
      isRead: false,
      targetTab: 'requests',
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    recordAudit(
      'Work Arrangement Request Filed',
      `${currentUser.fullName} filed request to change from ${data.currentArrangement} to ${data.requestedArrangement} for ${data.effectiveDate}.`,
      'ARRANGEMENT',
      'NONE',
      'PENDING'
    );
  };

  const reviewArrangement = (
    requestId: string,
    status: 'APPROVED' | 'REJECTED',
    remarks?: string
  ) => {
    const target = arrangementRequests.find((a) => a.id === requestId);
    if (!target) return;

    const now = new Date();
    const timestamp = `${currentDate} ${formatTime12(now)}`;

    setArrangementRequests((prev) =>
      prev.map((a) =>
        a.id === requestId
          ? {
              ...a,
              status,
              adminRemarks: remarks,
              reviewedBy: currentUser?.fullName || 'Branch Manager',
              reviewedAt: timestamp,
            }
          : a
      )
    );

    // If approved, update user's currentArrangement
    if (status === 'APPROVED') {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === target.userId
            ? { ...u, currentArrangement: target.requestedArrangement }
            : u
        )
      );

      // If effective date is today, also update today's attendance record arrangement
      if (target.effectiveDate === currentDate) {
        setAttendanceRecords((prev) =>
          prev.map((r) =>
            r.userId === target.userId && r.date === currentDate
              ? { ...r, arrangement: target.requestedArrangement }
              : r
          )
        );
      }
    }

    const staffNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: target.userId,
      title: `Work Arrangement ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      message: `Your request for ${target.requestedArrangement} on ${target.effectiveDate} has been ${status.toLowerCase()} by ${currentUser?.fullName || 'Branch Manager'}.${remarks ? ` Remarks: "${remarks}"` : ''}`,
      type: 'ARRANGEMENT',
      timestamp,
      isRead: false,
      targetTab: 'arrangement',
    };
    setNotifications((prev) => [staffNotif, ...prev]);

    recordAudit(
      `Work Arrangement Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      `${currentUser?.fullName || 'Admin'} ${status.toLowerCase()} ${target.userName}'s request for ${target.requestedArrangement} on ${target.effectiveDate}. Remarks: "${remarks || 'None'}".`,
      'ARRANGEMENT',
      target.status,
      status
    );
  };

  // Late Request
  const fileLateRequest = (
    data: Omit<LateRequest, 'id' | 'userId' | 'userName' | 'userStaffId' | 'dateFiled' | 'status'>
  ) => {
    if (!currentUser) return;
    const now = new Date();
    const newReq: LateRequest = {
      ...data,
      id: `late-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userStaffId: currentUser.staffId,
      dateFiled: `${currentDate} ${formatTime12(now)}`,
      status: 'PENDING',
    };

    setLateRequests((prev) => [newReq, ...prev]);

    // Link to today's attendance record if matching date
    if (data.date === currentDate) {
      setAttendanceRecords((prev) =>
        prev.map((r) =>
          r.userId === currentUser.id && r.date === currentDate
            ? { ...r, lateRequestId: newReq.id, lateRequestStatus: 'PENDING' }
            : r
        )
      );
    }

    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: 'user-admin',
      title: 'New Late Arrival Notification',
      message: `${currentUser.fullName} filed late notification for ${data.date} (Expected: ${data.actualArrivalExpected}). Reason: "${data.reason}".`,
      type: 'LATE',
      timestamp: `${currentDate} ${formatTime12(now)}`,
      isRead: false,
      targetTab: 'requests',
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    recordAudit(
      'Late Notification Submitted',
      `${currentUser.fullName} submitted late notification for ${data.date} (Expected: ${data.actualArrivalExpected}). Reason: "${data.reason}".`,
      'LATE',
      'NONE',
      'PENDING'
    );
  };

  const reviewLateRequest = (
    requestId: string,
    status: 'APPROVED' | 'NOTED' | 'REJECTED',
    remarks?: string
  ) => {
    const target = lateRequests.find((l) => l.id === requestId);
    if (!target) return;

    const now = new Date();
    const timestamp = `${currentDate} ${formatTime12(now)}`;

    setLateRequests((prev) =>
      prev.map((l) =>
        l.id === requestId
          ? {
              ...l,
              status,
              adminRemarks: remarks,
              reviewedBy: currentUser?.fullName || 'Branch Manager',
              reviewedAt: timestamp,
            }
          : l
      )
    );

    // Important business rule: The system should not alter or erase the actual attendance time.
    // We update lateRequestStatus on attendance record for transparency
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        r.lateRequestId === requestId || (r.userId === target.userId && r.date === target.date)
          ? { ...r, lateRequestStatus: status }
          : r
      )
    );

    const staffNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: target.userId,
      title: `Late Notification ${status}`,
      message: `Your late notification for ${target.date} was marked as ${status} by ${currentUser?.fullName || 'Branch Manager'}.${remarks ? ` Remarks: "${remarks}"` : ''}`,
      type: 'LATE',
      timestamp,
      isRead: false,
      targetTab: 'history',
    };
    setNotifications((prev) => [staffNotif, ...prev]);

    recordAudit(
      `Late Request Status Updated to ${status}`,
      `${currentUser?.fullName || 'Admin'} reviewed late request of ${target.userName} on ${target.date}. Action: ${status}. Remarks: "${remarks || 'None'}". Actual attendance time remains transparent and intact.`,
      'LATE',
      target.status,
      status
    );
  };

  // Rules
  const updateAttendanceRules = (newRules: AttendanceRules) => {
    setRules(newRules);
    recordAudit(
      'Attendance Rules Configured',
      `${currentUser?.fullName || 'Admin'} updated agency attendance rules: Working Hours: ${newRules.workStartTime}-${newRules.workEndTime}, Grace: ${newRules.gracePeriodMinutes}m, Lunch: ${newRules.lunchBreakMinutes}m.`,
      'RULES'
    );
  };

  // Notifications
  const markNotificationAsRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (
          currentUser?.role === 'admin'
            ? n.recipientId === 'user-admin' || n.recipientId === currentUser?.id
            : n.recipientId === currentUser?.id
        ) {
          return { ...n, isRead: true };
        }
        return n;
      })
    );
  };

  // Chat Actions
  const sendChatMessage = (
    channelId: string,
    content: string,
    attachments?: ChatAttachment[]
  ) => {
    if (!currentUser) return;
    const now = new Date();
    const timeFormatted = formatTime12(now);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      channelId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role === 'admin' ? 'CEO' : currentUser.position,
      senderInitials: currentUser.avatarInitials,
      content: content.trim(),
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
      timestamp: now.toISOString(),
      date: currentDate,
      time: timeFormatted,
      isReadBy: [currentUser.id],
    };

    setChatMessages((prev) => [...prev, newMsg]);

    setChatChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? {
              ...c,
              lastMessage:
                content.trim() ||
                (attachments?.length
                  ? `[${attachments[0].type.toUpperCase()}: ${attachments[0].name}]`
                  : 'Sent an update'),
              lastMessageTime: timeFormatted,
            }
          : c
      )
    );
  };

  const openDirectMessageWithUser = (targetUserId: string): string => {
    if (!currentUser) return 'ch-announcements';
    const targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) return 'ch-announcements';

    const existing = chatChannels.find(
      (c) =>
        c.type === 'dm' &&
        c.participantIds.includes(currentUser.id) &&
        c.participantIds.includes(targetUserId)
    );

    if (existing) {
      setActiveChannelId(existing.id);
      return existing.id;
    }

    const newDmChannel: ChatChannel = {
      id: `dm-${currentUser.id}-${targetUserId}`,
      name: targetUser.fullName,
      type: 'dm',
      description: `Direct conversation with ${targetUser.position}`,
      participantIds: [currentUser.id, targetUserId],
      isDirectMessage: true,
      targetUserId: targetUserId,
      lastMessage: 'Conversation initiated',
      lastMessageTime: formatTime12(new Date()),
    };

    setChatChannels((prev) => [...prev, newDmChannel]);
    setActiveChannelId(newDmChannel.id);
    return newDmChannel.id;
  };

  const markChannelAsRead = (channelId: string) => {
    if (!currentUser) return;
    setChatMessages((prev) =>
      prev.map((m) =>
        m.channelId === channelId && !m.isReadBy.includes(currentUser.id)
          ? { ...m, isReadBy: [...m.isReadBy, currentUser.id] }
          : m
      )
    );
  };

  const addChatReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    setChatMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const currentReactions = m.reactions || [];
        const existingIdx = currentReactions.findIndex((r) => r.emoji === emoji);

        if (existingIdx >= 0) {
          const existing = currentReactions[existingIdx];
          const hasReacted = existing.userIds.includes(currentUser.id);
          let updatedList;
          if (hasReacted) {
            // Remove reaction
            const newUserIds = existing.userIds.filter((id) => id !== currentUser.id);
            if (newUserIds.length === 0) {
              updatedList = currentReactions.filter((_, i) => i !== existingIdx);
            } else {
              updatedList = currentReactions.map((r, i) =>
                i === existingIdx ? { ...r, count: newUserIds.length, userIds: newUserIds } : r
              );
            }
          } else {
            // Add to existing
            const newUserIds = [...existing.userIds, currentUser.id];
            updatedList = currentReactions.map((r, i) =>
              i === existingIdx ? { ...r, count: newUserIds.length, userIds: newUserIds } : r
            );
          }
          return { ...m, reactions: updatedList };
        } else {
          // New reaction
          return {
            ...m,
            reactions: [
              ...currentReactions,
              { emoji, count: 1, userIds: [currentUser.id] },
            ],
          };
        }
      })
    );
  };

  // Calculate unread chat messages for currentUser
  const totalUnreadChatCount = chatMessages.filter((m) => {
    if (!currentUser) return false;
    if (m.senderId === currentUser.id) return false;
    if (m.isReadBy.includes(currentUser.id)) return false;
    const channel = chatChannels.find((c) => c.id === m.channelId);
    if (!channel) return false;
    if (channel.participantIds.includes('all') || channel.participantIds.includes(currentUser.id)) {
      return true;
    }
    return false;
  }).length;

  // MacBook Location Tracking methods
  const updateUserMacBookLocation = (userId: string, data: Partial<StaffLocationRecord>) => {
    setStaffLocations((prev) =>
      prev.map((s) => {
        if (s.userId === userId) {
          const updated = { ...s, ...data };
          if (data.distanceFromHQMeters !== undefined) {
            updated.isOnLocation = data.distanceFromHQMeters <= geofenceSettings.radiusMeters;
            updated.status = updated.isOnLocation ? 'ON_LOCATION' : 'REMOTE';
          }
          return updated;
        }
        return s;
      })
    );
  };

  const updateGeofenceSettings = (settings: Partial<GeofenceConfig>) => {
    setGeofenceSettings((prev) => {
      const updated = { ...prev, ...settings };
      // Recalculate isOnLocation for all staff based on new radius
      setStaffLocations((staffList) =>
        staffList.map((s) => {
          const distance = calculateDistanceInMeters(
            s.latitude,
            s.longitude,
            updated.latitude,
            updated.longitude
          );
          const isInside = distance <= updated.radiusMeters;
          return {
            ...s,
            distanceFromHQMeters: distance,
            isOnLocation: isInside,
            status: isInside ? 'ON_LOCATION' : 'REMOTE',
          };
        })
      );
      return updated;
    });
    recordAudit(
      'Geofence Boundary Modified',
      `Admin adjusted Makati Branch HQ geofence boundary (Radius: ${settings.radiusMeters || geofenceSettings.radiusMeters}m).`,
      'RULES'
    );
  };

  const pingMacBookLocation = async (userId?: string) => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) return;

    try {
      const geo = await getBrowserCoordinates();
      const distance = calculateDistanceInMeters(
        geo.latitude,
        geo.longitude,
        geofenceSettings.latitude,
        geofenceSettings.longitude
      );
      const isInside = distance <= geofenceSettings.radiusMeters;

      updateUserMacBookLocation(targetUserId, {
        latitude: geo.latitude,
        longitude: geo.longitude,
        distanceFromHQMeters: distance,
        isOnLocation: isInside,
        status: isInside ? 'ON_LOCATION' : 'REMOTE',
        lastPingTime: 'Just now (GPS verified)',
        lastPingRaw: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Ping MacBook Location error', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        currentDate,
        setCurrentDate,
        rules,
        attendanceRecords,
        leaveRequests,
        arrangementRequests,
        lateRequests,
        auditLogs,
        notifications,
        unreadNotificationCount,

        login,
        logout,
        switchUser,
        addStaff,
        updateStaff,
        toggleStaffStatus,

        todayRecord,
        timeIn,
        timeOut,
        correctAttendanceRecord,

        fileLeave,
        reviewLeave,

        fileArrangement,
        reviewArrangement,

        fileLateRequest,
        reviewLateRequest,

        updateAttendanceRules,

        markNotificationAsRead,
        markAllNotificationsAsRead,

        // Chat
        chatChannels,
        chatMessages,
        activeChannelId,
        setActiveChannelId,
        sendChatMessage,
        openDirectMessageWithUser,
        markChannelAsRead,
        addChatReaction,
        totalUnreadChatCount,

        // MacBook Location Tracking & Geofence
        staffLocations,
        geofenceSettings,
        updateUserMacBookLocation,
        updateGeofenceSettings,
        pingMacBookLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
