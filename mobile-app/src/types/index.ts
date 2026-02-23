export interface EmployeeProfile {
  id: string;
  name: string;
  activeSessionId: string | null;
  createdAt: number;
}

export interface Session {
  sessionId: string;
  checkInTime: number;
  checkOutTime: number | null;
  reason: string | null;
}

export interface EmployeePins {
  [employeeName: string]: {
    pin: string | null;
    unlocked: boolean;
  };
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  lastVisited: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  biometricAuth: boolean;
}

export interface AppData {
  sessions: Session[];
  employeeName: string;
  email: string;
  jobTitle: string;
  department: string;
  onboardingCompleted: boolean;
  onboardingProgress: OnboardingProgress;
  appSettings: AppSettings;
}

export interface TimeStats {
  totalHours: number;
  activeCount: number;
  sessionCount: number;
}

export interface MonthlyStats {
  totalHours: number;
  totalSessions: number;
  activeEmployees: number;
  employeeStats: {
    [employeeName: string]: {
      totalSeconds: number;
      sessionCount: number;
      days: number;
      avgPerDay: number;
    };
  };
}

export interface DailyStats {
  totalHours: number;
  sessions: Session[];
}

export interface CompareStats {
  name: string;
  totalHours: number;
  totalSeconds: number;
  sessions: number;
  daysWorked: number;
  avgPerDay: number;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  bgMain: string;
  bgCard: string;
  bgCardHover: string;
  bgMainLight: string;
  bgCardLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textPrimaryLight: string;
  textSecondaryLight: string;
  border: string;
  borderLight: string;
  shadow: string;
  transparent: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  full: number;
}

export interface FontSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface FontWeights {
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
  extrabold: string;
}