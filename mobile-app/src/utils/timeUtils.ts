export const formatTime = (seconds: number): string => {
  if (!seconds || seconds < 0) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

export const formatHoursMinutes = (seconds: number): string => {
  if (!seconds || seconds < 0) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${pad(h)}:${pad(m)}`;
};

export const pad = (num: number): string => {
  return String(num).padStart(2, '0');
};

export const getTodayString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const getDateString = (timestamp: number): string => {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const getMonthString = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Custom time formatter that shows PM before AM (reversed order)
export const formatTimeReversed = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Convert to 12-hour format
  const displayHour = hours % 12 || 12; // Convert 0 to 12
  const isPM = hours >= 12;
  
  // Create PM/AM indicator with PM first
  const period = isPM ? 'PM' : 'AM';
  
  // Format time with reversed AM/PM order
  return `${displayHour}:${String(minutes).padStart(2, '0')}${period}`;
};

// Alternative format with space between time and period
export const formatTimeReversedWithSpace = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Convert to 12-hour format
  const displayHour = hours % 12 || 12; // Convert 0 to 12
  const isPM = hours >= 12;
  
  // Create PM/AM indicator with PM first
  const period = isPM ? 'PM' : 'AM';
  
  // Format time with space and reversed AM/PM order
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
};