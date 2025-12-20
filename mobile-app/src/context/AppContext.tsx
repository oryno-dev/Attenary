import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Session {
  sessionId: string;
  checkInTime: number;
  checkOutTime: number | null;
  reason: string | null;
}

interface AppData {
  sessions: Session[];
  employeeName: string;
}

interface AppContextType {
  appData: AppData;
  pin: string | null;
  unlocked: boolean;
  loading: boolean;
  saveData: () => Promise<boolean>;
  checkIn: () => Promise<void>;
  checkOut: (reason?: string) => Promise<void>;
  setEmployeeName: (name: string) => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
  exportData: () => Promise<string | null>;
}

const STORAGE_KEY = 'PHARMACY_ATTENDANCE_DATA_V2';
const PIN_STORAGE_KEY = 'PHARMACY_EMPLOYEE_PIN';

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: any;
}

export const Provider = ({ children }: any) => {
  const [appData, setAppData] = useState({ sessions: [], employeeName: '' });
  const [pin, setPinState] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load app data
      const dataString = await AsyncStorage.getItem(STORAGE_KEY);
      if (dataString) {
        const parsed = JSON.parse(dataString);
        setAppData({
          sessions: parsed.sessions || [],
          employeeName: parsed.employeeName || ''
        });
      }

      // Load PIN
      const pinString = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      if (pinString) {
        const parsed = JSON.parse(pinString);
        setPinState(parsed.pin || null);
        setUnlocked(parsed.unlocked || false);
      }
    } catch (error) {
      console.log('Error loading data:', error);
      setAppData({ sessions: [], employeeName: '' });
      setPinState(null);
      setUnlocked(false);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (): Promise<boolean> => {
    try {
      const dataString = JSON.stringify(appData);
      await AsyncStorage.setItem(STORAGE_KEY, dataString);
      return true;
    } catch (error) {
      console.log('Error saving data:', error);
      return false;
    }
  };

  const savePin = async (): Promise<boolean> => {
    try {
      const pinString = JSON.stringify({ pin, unlocked });
      await AsyncStorage.setItem(PIN_STORAGE_KEY, pinString);
      return true;
    } catch (error) {
      console.log('Error saving pin:', error);
      return false;
    }
  };

  const setEmployeeName = async (name: string) => {
    setAppData((prev: any) => ({ ...prev, employeeName: name }));
    await saveData();
  };

  const checkIn = async () => {
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    const session: Session = {
      sessionId,
      checkInTime: Date.now(),
      checkOutTime: null,
      reason: null
    };

    setAppData((prev: any) => ({
      ...prev,
      sessions: [...prev.sessions, session]
    }));

    await saveData();
  };

  const checkOut = async (reason?: string) => {
    const activeSession = appData.sessions.find((s: any) => s.checkOutTime === null);
    if (!activeSession) return;

    setAppData((prev: any) => ({
      ...prev,
      sessions: prev.sessions.map((s: any) =>
        s.sessionId === activeSession.sessionId
          ? { ...s, checkOutTime: Date.now(), reason: reason || null }
          : s
      )
    }));

    await saveData();
  };

  const setPin = async (pinValue: string) => {
    setPinState(pinValue);
    setUnlocked(true);
    await savePin();
  };

  const unlock = async (pinValue: string): Promise<boolean> => {
    if (!pin) return true; // No PIN set, always unlocked
    
    if (pin === pinValue) {
      setUnlocked(true);
      await savePin();
      return true;
    }
    return false;
  };

  const lock = () => {
    setUnlocked(false);
  };

  const exportData = async (): Promise<string | null> => {
    try {
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-');
      const filename = `pharmacy_attendance_backup_${timestamp}.json`;

      const backupData = {
        exportDate: now.toISOString(),
        exportTimestamp: Date.now(),
        version: '2.0',
        pharmacyName: 'Pharmacy Attendance System',
        employeeName: appData.employeeName,
        summary: {
          totalSessions: appData.sessions.length,
          activeSessions: appData.sessions.filter((s: any) => s.checkOutTime === null).length
        },
        sessions: appData.sessions.map((s: any) => ({
          sessionId: s.sessionId,
          checkInTime: s.checkInTime,
          checkInTimeReadable: new Date(s.checkInTime).toLocaleString(),
          checkOutTime: s.checkOutTime,
          checkOutTimeReadable: s.checkOutTime ? new Date(s.checkOutTime).toLocaleString() : null,
          duration: s.checkOutTime ? formatHoursMinutes(Math.floor((s.checkOutTime - s.checkInTime) / 1000)) : 'Active',
          reason: s.reason
        })),
        rawData: appData
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      return jsonString;
    } catch (error) {
      console.log('Error exporting data:', error);
      return null;
    }
  };

  const formatHoursMinutes = (seconds: number): string => {
    if (!seconds || seconds < 0) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const value = {
    appData,
    pin,
    unlocked,
    loading,
    saveData,
    checkIn,
    checkOut,
    setEmployeeName,
    setPin,
    unlock,
    lock,
    exportData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};