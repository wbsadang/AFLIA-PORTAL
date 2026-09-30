export function formatTime12(date: Date = new Date()): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours.toString().padStart(2, '0')}:${minutesStr} ${ampm}`;
}

export function formatTime24(date: Date = new Date()): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDateYMD(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateFriendly(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, monthIndex, day);
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateWithDay(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, monthIndex, day);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Parses time string like "08:05 AM" or "14:30" or "08:05" to minutes since midnight
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();

  if (clean.includes('AM') || clean.includes('PM')) {
    const isPM = clean.includes('PM');
    const withoutAmPm = clean.replace('AM', '').replace('PM', '').trim();
    const [h, m] = withoutAmPm.split(':').map((v) => parseInt(v, 10));
    let hours = h || 0;
    const minutes = m || 0;
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    return hours * 60 + minutes;
  } else {
    const [h, m] = clean.split(':').map((v) => parseInt(v, 10));
    return (h || 0) * 60 + (m || 0);
  }
}

/**
 * Calculates late minutes based on official start time and grace period
 */
export function calculateLateMinutes(
  timeInStr: string,
  officialStartTimeStr: string = '08:00',
  gracePeriodMinutes: number = 10
): number {
  const actualMinutes = timeStringToMinutes(timeInStr);
  const officialMinutes = timeStringToMinutes(officialStartTimeStr);
  const cutoffMinutes = officialMinutes + gracePeriodMinutes;

  if (actualMinutes > cutoffMinutes) {
    // If beyond grace period, late minutes are counted from official start time
    return actualMinutes - officialMinutes;
  }
  return 0;
}

/**
 * Calculates undertime minutes if timeOut is before officialEndTime
 */
export function calculateUndertimeMinutes(
  timeOutStr: string,
  officialEndTimeStr: string = '17:00'
): number {
  const actualMinutes = timeStringToMinutes(timeOutStr);
  const officialMinutes = timeStringToMinutes(officialEndTimeStr);

  if (actualMinutes < officialMinutes) {
    return officialMinutes - actualMinutes;
  }
  return 0;
}

/**
 * Calculates total working hours between timeIn and timeOut
 */
export function calculateWorkingHours(
  timeInStr: string,
  timeOutStr: string,
  lunchBreakMinutes: number = 60
): number {
  const inMinutes = timeStringToMinutes(timeInStr);
  const outMinutes = timeStringToMinutes(timeOutStr);
  if (outMinutes <= inMinutes) return 0;

  let diffMinutes = outMinutes - inMinutes;
  // If span is more than 5 hours, deduct lunch break
  if (diffMinutes > 300) {
    diffMinutes = Math.max(0, diffMinutes - lunchBreakMinutes);
  }
  return parseFloat((diffMinutes / 60).toFixed(1));
}
