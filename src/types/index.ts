export type Role = 'admin' | 'staff';
export type WorkArrangement = 'ON_SITE' | 'WFH';
export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ON_LEAVE' | 'ABSENT' | 'NOT_LOGGED_IN';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOTED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  staffId: string;
  role: Role;
  position: string;
  department: string;
  regularSchedule: string;
  defaultArrangement: WorkArrangement;
  currentArrangement: WorkArrangement;
  status: 'ACTIVE' | 'INACTIVE';
  password?: string;
  avatarInitials: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userPosition: string;
  userStaffId: string;
  date: string; // YYYY-MM-DD
  timeIn: string | null; // e.g. "08:02 AM"
  timeOut: string | null; // e.g. "05:03 PM"
  timeInRaw?: string; // ISO or HH:mm
  timeOutRaw?: string;
  arrangement: WorkArrangement;
  status: AttendanceStatus;
  lateMinutes: number;
  undertimeMinutes: number;
  totalHours: number;
  locationNote?: string;
  lateRequestId?: string;
  lateRequestStatus?: RequestStatus;
  correctionReason?: string;
  correctedBy?: string;
  correctedAt?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userStaffId: string;
  leaveType: 'Vacation Leave' | 'Sick Leave' | 'Emergency Leave' | 'Other';
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  documentName?: string;
  dateFiled: string;
  status: RequestStatus;
  adminRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ArrangementRequest {
  id: string;
  userId: string;
  userName: string;
  userStaffId: string;
  currentArrangement: WorkArrangement;
  requestedArrangement: WorkArrangement;
  effectiveDate: string;
  reason: string;
  dateFiled: string;
  status: RequestStatus;
  adminRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface LateRequest {
  id: string;
  userId: string;
  userName: string;
  userStaffId: string;
  date: string;
  expectedArrivalTime: string;
  actualArrivalExpected: string;
  reason: string;
  additionalRemarks?: string;
  dateFiled: string;
  status: RequestStatus;
  adminRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AttendanceRules {
  workStartTime: string; // "08:00"
  workEndTime: string; // "17:00"
  gracePeriodMinutes: number; // 10
  lunchBreakMinutes: number; // 60
  workingDays: string[]; // ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  holidays: { id: string; date: string; name: string }[];
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  date: string;
  time: string;
  timestamp: string;
  previousStatus?: string;
  newStatus?: string;
  details: string;
  category: 'ATTENDANCE' | 'LEAVE' | 'ARRANGEMENT' | 'LATE' | 'STAFF' | 'RULES';
}

export interface NotificationItem {
  id: string;
  recipientId: string; // 'admin' or userId
  title: string;
  message: string;
  type: 'LEAVE' | 'ARRANGEMENT' | 'LATE' | 'ATTENDANCE' | 'SYSTEM';
  timestamp: string;
  isRead: boolean;
  targetTab?: string;
}

export interface MonthlyStaffSummary {
  userId: string;
  fullName: string;
  staffId: string;
  position: string;
  department: string;
  totalWorkingDays: number;
  daysPresent: number;
  daysWFH: number;
  daysOnSite: number;
  daysOnLeave: number;
  lateOccurrences: number;
  totalLateMinutes: number;
  missingTimeOut: number;
  absences: number;
  attendanceRate: number;
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'file' | 'link';
  name: string;
  url: string;
  size?: string;
  mimeType?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderInitials: string;
  content: string;
  attachments?: ChatAttachment[];
  timestamp: string;
  date: string;
  time: string;
  isReadBy: string[];
  reactions?: { emoji: string; count: number; userIds: string[] }[];
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'channel' | 'dm';
  description?: string;
  participantIds: string[];
  isDirectMessage: boolean;
  targetUserId?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface MacBookTelemetry {
  isMacBook: boolean;
  platform: string; // e.g. "MacIntel" / "macOS"
  model: string; // e.g. "Apple MacBook Pro 16\" (M3 Max)" or "Apple MacBook Air 13\" (M2)"
  osVersion: string; // e.g. "macOS 15.1 Sequoia"
  browser: string; // e.g. "Safari 18.1 (Mac)"
  screenResolution: string; // e.g. "3024 × 1964 Retina"
  devicePixelRatio: number; // e.g. 2
  batteryLevel?: number; // 0 - 100
  isCharging?: boolean;
  wifiSSID: string; // e.g. "AFLIA-CORP-WIFI-5G"
  isOfficeWifi: boolean;
  ipAddress: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  distanceFromHQMeters: number;
  isOnLocation: boolean; // TRUE if distance <= geofence radius
  locationLabel: string; // e.g. "AFLIA Makati Branch HQ - Level 12"
  lastPingTimestamp: string;
  source: 'REAL_BROWSER_GPS' | 'OFFICE_WIFI_VERIFIED' | 'SIMULATED_PRESET';
}

export interface StaffLocationRecord {
  userId: string;
  fullName: string;
  position: string;
  department: string;
  staffId: string;
  avatarInitials: string;
  arrangement: WorkArrangement;
  attendanceToday: AttendanceStatus;
  timedInAt: string | null;

  // MacBook and Hardware Telemetry
  isMacBook: boolean;
  deviceModel: string;
  deviceSerial: string;
  macOSVersion: string;
  browser: string;
  isOnLocation: boolean; // In HQ geofence
  locationLabel: string;
  latitude: number;
  longitude: number;
  distanceFromHQMeters: number;
  wifiSSID: string;
  isOfficeWifi: boolean;
  ipAddress: string;
  batteryLevel: number;
  isCharging: boolean;
  lastPingTime: string;
  lastPingRaw: string;
  status: 'ON_LOCATION' | 'REMOTE' | 'OFFLINE';
}

export interface GeofenceConfig {
  officeName: string;
  address: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  allowedWifiSSIDs: string[];
}

