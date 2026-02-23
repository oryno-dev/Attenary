import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { 
  storePin, 
  getPin, 
  verifyPin, 
  getUnlockedState, 
  setUnlockedState, 
  hasPin,
  clearPin 
} from '../utils/securePinStorage';
import { performAutoBackup } from '../utils/autoBackup';
import { Session, AppData } from '../types';

interface AppContextType {
  appData: AppData;
  pin: string | null;
  unlocked: boolean;
  loading: boolean;
  biometricEnabled: boolean;
  saveData: () => Promise<boolean>;
  loadData: () => Promise<void>;
  checkIn: () => Promise<void>;
  checkOut: (reason?: string) => Promise<void>;
  setEmployeeName: (name: string) => Promise<void>;
  setEmail: (email: string) => Promise<void>;
  setJobTitle: (jobTitle: string) => Promise<void>;
  setDepartment: (department: string) => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
  exportData: () => Promise<boolean>;
  importData: () => Promise<boolean>;
  completeOnboarding: () => Promise<void>;
  updateOnboardingProgress: (step: number) => Promise<void>;
  resetOnboardingProgress: () => Promise<void>;
  authenticateWithBiometrics: () => Promise<boolean>;
  enableBiometricAuth: () => Promise<boolean>;
  disableBiometricAuth: () => Promise<void>;
  isBiometricSupported: () => Promise<boolean>;
  storageError: string | null;
  clearStorageError: () => void;
  deleteSession: (sessionId: string) => Promise<boolean>;
  clearAllData: () => Promise<boolean>;
}

const STORAGE_KEY = 'PHARMACY_ATTENDANCE_DATA_V2';
const PIN_STORAGE_KEY = 'PHARMACY_EMPLOYEE_PIN';
const BIOMETRIC_STORAGE_KEY = 'PHARMACY_BIOMETRIC_ENABLED';

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const Provider = ({ children }: AppProviderProps) => {
  const [appData, setAppData] = useState<AppData>({
    sessions: [],
    employeeName: '',
    email: '',
    jobTitle: '',
    department: '',
    onboardingCompleted: false,
    onboardingProgress: {
      currentStep: 0,
      completedSteps: [],
      lastVisited: Date.now(),
    },
    appSettings: {
      theme: 'dark',
      notifications: true,
      biometricAuth: false,
    },
  });
  const [pin, setPinState] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Web-safe storage functions
  const getStorageItem = async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('localStorage getItem error:', error);
        return null;
      }
    } else {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.error('AsyncStorage getItem error:', error);
        return null;
      }
    }
  };

  const setStorageItem = async (key: string, value: string): Promise<boolean> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        console.error('localStorage setItem error:', error);
        return false;
      }
    } else {
      try {
        await AsyncStorage.setItem(key, value);
        return true;
      } catch (error) {
        console.error('AsyncStorage setItem error:', error);
        return false;
      }
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setStorageError(null);
      
      console.log('Loading data...', { platform: Platform.OS });
      
      // Load app data with enhanced error handling
      const dataString = await getStorageItem(STORAGE_KEY);
      console.log('Loaded data string:', dataString ? 'Data found' : 'No data found');
      
      if (dataString) {
        try {
          const parsed = JSON.parse(dataString);
          console.log('Parsed data:', parsed);
          setAppData({
            sessions: parsed.sessions || [],
            employeeName: parsed.employeeName || '',
            email: parsed.email || '',
            jobTitle: parsed.jobTitle || '',
            department: parsed.department || '',
            onboardingCompleted: parsed.onboardingCompleted || false,
            onboardingProgress: parsed.onboardingProgress || {
              currentStep: 0,
              completedSteps: [],
              lastVisited: Date.now(),
            },
            appSettings: parsed.appSettings || {
              theme: 'dark',
              notifications: true,
              biometricAuth: false,
            },
          });
        } catch (parseError) {
          console.error('Error parsing stored data:', parseError);
          setStorageError('Failed to parse stored data. Resetting to defaults.');
          // Reset to defaults on parse error
          setAppData({
            sessions: [],
            employeeName: '',
            email: '',
            jobTitle: '',
            department: '',
            onboardingCompleted: false,
            onboardingProgress: {
              currentStep: 0,
              completedSteps: [],
              lastVisited: Date.now(),
            },
            appSettings: {
              theme: 'dark',
              notifications: true,
              biometricAuth: false,
            },
          });
        }
      }

      // Load PIN with secure storage
      const storedPin = await getPin();
      if (storedPin) {
        setPinState(storedPin);
        setUnlocked(await getUnlockedState());
      }

      // Load biometric settings with error handling
      const biometricString = await getStorageItem(BIOMETRIC_STORAGE_KEY);
      if (biometricString) {
        try {
          const parsed = JSON.parse(biometricString);
          setBiometricEnabled(parsed.enabled || false);
        } catch (bioError) {
          console.error('Error parsing biometric data:', bioError);
        }
      }
    } catch (error) {
      console.error('Critical error loading data:', error);
      setStorageError('Failed to load app data. Please restart the app.');
      // Reset to defaults on critical error
      setAppData({
        sessions: [],
        employeeName: '',
        email: '',
        jobTitle: '',
        department: '',
        onboardingCompleted: false,
        onboardingProgress: {
          currentStep: 0,
          completedSteps: [],
          lastVisited: Date.now(),
        },
        appSettings: {
          theme: 'dark',
          notifications: true,
          biometricAuth: false,
        },
      });
      setPinState(null);
      setUnlocked(false);
      setBiometricEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (): Promise<boolean> => {
    try {
      const dataString = JSON.stringify(appData);
      console.log('Saving data:', { platform: Platform.OS, dataLength: dataString.length });
      const success = await setStorageItem(STORAGE_KEY, dataString);
      console.log('Save result:', success ? 'Success' : 'Failed');
      return success;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  };

  const savePin = async (): Promise<boolean> => {
    try {
      const pinString = JSON.stringify({ pin, unlocked });
      const success = await setStorageItem(PIN_STORAGE_KEY, pinString);
      return success;
    } catch (error) {
      console.error('Error saving pin:', error);
      return false;
    }
  };

  const saveBiometricSettings = async (): Promise<boolean> => {
    try {
      const biometricString = JSON.stringify({ enabled: biometricEnabled });
      const success = await setStorageItem(BIOMETRIC_STORAGE_KEY, biometricString);
      return success;
    } catch (error) {
      console.error('Error saving biometric settings:', error);
      return false;
    }
  };

  const setEmployeeName = async (name: string) => {
    setAppData((prev: AppData) => ({ ...prev, employeeName: name }));
    await saveData();
  };

  const setEmail = async (email: string) => {
    setAppData((prev: AppData) => ({ ...prev, email }));
    await saveData();
  };

  const setJobTitle = async (jobTitle: string) => {
    setAppData((prev: AppData) => ({ ...prev, jobTitle }));
    await saveData();
  };

  const setDepartment = async (department: string) => {
    setAppData((prev: AppData) => ({ ...prev, department }));
    await saveData();
  };

  // Direct save function to avoid race conditions
  const saveDataDirect = async (data: AppData): Promise<boolean> => {
    try {
      const dataString = JSON.stringify(data);
      console.log('Saving data directly:', { platform: Platform.OS, dataLength: dataString.length });
      const success = await setStorageItem(STORAGE_KEY, dataString);
      console.log('Save result:', success ? 'Success' : 'Failed');
      
      // Trigger automatic backup after successful save
      if (success) {
        // Run backup in background without blocking the save operation
        performAutoBackup(data).then(result => {
          if (result.success) {
            console.log('Auto-backup completed:', result.message);
          } else {
            console.log('Auto-backup skipped:', result.message);
          }
        }).catch(error => {
          console.error('Auto-backup error:', error);
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  };

  const checkIn = async () => {
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
    const session: Session = {
      sessionId,
      checkInTime: Date.now(),
      checkOutTime: null,
      reason: null
    };

    const newData: AppData = {
      ...appData,
      sessions: [...appData.sessions, session]
    };

    setAppData(newData);
    await saveDataDirect(newData);
  };

  const checkOut = async (reason?: string) => {
    const activeSession = appData.sessions.find((s: Session) => s.checkOutTime === null);
    if (!activeSession) return;

    const newData: AppData = {
      ...appData,
      sessions: appData.sessions.map((s: Session) =>
        s.sessionId === activeSession.sessionId
          ? { ...s, checkOutTime: Date.now(), reason: reason || null }
          : s
      )
    };

    setAppData(newData);
    await saveDataDirect(newData);
  };

  const setPin = async (pinValue: string) => {
    const success = await storePin(pinValue);
    if (success) {
      setPinState(pinValue);
      setUnlocked(true);
      await setUnlockedState(true);
    }
  };

  const unlock = async (pinValue: string): Promise<boolean> => {
    if (!pin) return true; // No PIN set, always unlocked
    
    const isValid = await verifyPin(pinValue);
    if (isValid) {
      setUnlocked(true);
      await setUnlockedState(true);
      return true;
    }
    return false;
  };

  const lock = () => {
    setUnlocked(false);
    setUnlockedState(false);
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    if (!biometricEnabled || !pin) {
      return false;
    }

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Data',
        fallbackLabel: 'Enter PIN',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setUnlocked(true);
        await savePin();
        return true;
      }
      return false;
    } catch (error) {
      console.log('Biometric authentication error:', error);
      return false;
    }
  };

  const enableBiometricAuth = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware) {
        Alert.alert('Biometric Authentication', 'This device does not support biometric authentication.');
        return false;
      }
      
      if (!isEnrolled) {
        Alert.alert('Biometric Authentication', 'No biometric credentials are enrolled on this device.');
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable Biometric Authentication',
        fallbackLabel: 'Use PIN Instead',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setBiometricEnabled(true);
        await saveBiometricSettings();
        return true;
      }
      return false;
    } catch (error) {
      console.log('Error enabling biometric auth:', error);
      return false;
    }
  };

  const disableBiometricAuth = async () => {
    setBiometricEnabled(false);
    await saveBiometricSettings();
  };

  const isBiometricSupported = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.log('Error checking biometric support:', error);
      return false;
    }
  };

  const exportData = async (): Promise<boolean> => {
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
        email: appData.email,
        jobTitle: appData.jobTitle,
        department: appData.department,
        summary: {
          totalSessions: appData.sessions.length,
          activeSessions: appData.sessions.filter((s: Session) => s.checkOutTime === null).length
        },
        sessions: appData.sessions.map((s: Session) => ({
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
      
      // For web environment, use clipboard as backup method
      if (Platform.OS === 'web') {
        try {
          // Use clipboard for web
          const Clipboard = require('expo-clipboard');
          await Clipboard.setStringAsync(jsonString);
          Alert.alert(
            'Backup Ready', 
            'Your data has been copied to clipboard. Paste it into a text file to save.',
            [{ text: 'OK' }]
          );
          return true;
        } catch (clipboardError) {
          console.log('Clipboard not available, showing raw data:', clipboardError);
          Alert.alert(
            'Export Data',
            'Copy this data to save as backup:\n\n' + jsonString.substring(0, 500) + '...',
            [{ text: 'OK' }]
          );
          return true;
        }
      }

      // For native platforms, try file system
      try {
        const { Paths, File, Directory } = require('expo-file-system');
        const cacheDir = Paths.cache;
        const file = new File(cacheDir, filename);
        file.write(jsonString);

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(file.uri, {
            mimeType: 'application/json',
            dialogTitle: 'Export Attendance Data',
            UTI: 'public.json',
          });
          return true;
        } else {
          Alert.alert('Export', 'Sharing is not available on this device');
          return false;
        }
      } catch (fileError) {
        console.log('File system error, falling back to clipboard:', fileError);
        try {
          const { setStringAsync } = await import('expo-clipboard');
          await setStringAsync(jsonString);
          Alert.alert(
            'Backup Ready', 
            'Your data has been copied to clipboard. Paste it into a text file to save.',
            [{ text: 'OK' }]
          );
          return true;
        } catch (clipboardError) {
          Alert.alert(
            'Export Data',
            'Copy this data to save as backup:\n\n' + jsonString.substring(0, 500) + '...',
            [{ text: 'OK' }]
          );
          return true;
        }
      }
    } catch (error) {
      console.log('Error exporting data:', error);
      Alert.alert('Export Error', 'Failed to export data. Please try again.');
      return false;
    }
  };

  const importData = async (): Promise<boolean> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return false;
      }

      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);

      const importedData = JSON.parse(fileContent);

      // Validate the imported data structure
      if (!importedData.version || !importedData.rawData) {
        Alert.alert('Import Error', 'Invalid backup file format');
        return false;
      }

      const rawData = importedData.rawData;

      // Validate required fields
      if (!Array.isArray(rawData.sessions)) {
        Alert.alert('Import Error', 'Invalid sessions data in backup file');
        return false;
      }

      // Apply the imported data
      const newAppData: AppData = {
        sessions: rawData.sessions || [],
        employeeName: rawData.employeeName || '',
        email: rawData.email || '',
        jobTitle: rawData.jobTitle || '',
        department: rawData.department || '',
        onboardingCompleted: rawData.onboardingCompleted || true,
        onboardingProgress: rawData.onboardingProgress || {
          currentStep: 0,
          completedSteps: [],
          lastVisited: Date.now(),
        },
        appSettings: rawData.appSettings || {
          theme: 'dark',
          notifications: true,
          biometricAuth: false,
        },
      };

      setAppData(newAppData);
      
      // Save to AsyncStorage
      const dataString = JSON.stringify(newAppData);
      await AsyncStorage.setItem(STORAGE_KEY, dataString);

      Alert.alert(
        'Import Successful',
        `Imported ${newAppData.sessions.length} sessions for ${newAppData.employeeName || 'Unknown User'}`
      );

      return true;
    } catch (error) {
      console.log('Error importing data:', error);
      Alert.alert('Import Error', 'Failed to import data. Please ensure the file is a valid backup.');
      return false;
    }
  };

  const completeOnboarding = async () => {
    try {
      setAppData((prev: AppData) => ({
        ...prev,
        onboardingCompleted: true,
        onboardingProgress: {
          ...prev.onboardingProgress,
          completedSteps: [0, 1, 2], // Mark all steps as completed
          lastVisited: Date.now(),
        },
      }));
      await saveData();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setStorageError('Failed to save onboarding completion.');
    }
  };

  const updateOnboardingProgress = async (step: number) => {
    try {
      setAppData((prev: AppData) => ({
        ...prev,
        onboardingProgress: {
          currentStep: step,
          completedSteps: prev.onboardingProgress.completedSteps.includes(step)
            ? prev.onboardingProgress.completedSteps
            : [...prev.onboardingProgress.completedSteps, step],
          lastVisited: Date.now(),
        },
      }));
      await saveData();
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
      setStorageError('Failed to save onboarding progress.');
    }
  };

  const resetOnboardingProgress = async () => {
    try {
      setAppData((prev: AppData) => ({
        ...prev,
        onboardingCompleted: false,
        onboardingProgress: {
          currentStep: 0,
          completedSteps: [],
          lastVisited: Date.now(),
        },
      }));
      await saveData();
    } catch (error) {
      console.error('Error resetting onboarding progress:', error);
      setStorageError('Failed to reset onboarding progress.');
    }
  };

  const clearStorageError = () => {
    setStorageError(null);
  };

  const clearAllData = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setStorageError(null);
      
      // Clear all storage keys
      if (Platform.OS === 'web') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PIN_STORAGE_KEY);
        localStorage.removeItem(BIOMETRIC_STORAGE_KEY);
      } else {
        await AsyncStorage.multiRemove([STORAGE_KEY, PIN_STORAGE_KEY, BIOMETRIC_STORAGE_KEY]);
      }
      
      // Reset app state to defaults
      const defaultAppData: AppData = {
        sessions: [],
        employeeName: '',
        email: '',
        jobTitle: '',
        department: '',
        onboardingCompleted: false,
        onboardingProgress: {
          currentStep: 0,
          completedSteps: [],
          lastVisited: Date.now(),
        },
        appSettings: {
          theme: 'dark',
          notifications: true,
          biometricAuth: false,
        },
      };
      
      setAppData(defaultAppData);
      setPinState(null);
      setUnlocked(false);
      setBiometricEnabled(false);
      
      Alert.alert('Success', 'All data has been cleared successfully.');
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      setStorageError('Failed to clear data. Please try again.');
      Alert.alert('Error', 'Failed to clear data. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string): Promise<boolean> => {
    try {
      // Find the session to delete
      const sessionToDelete = appData.sessions.find((s: any) => s.sessionId === sessionId);
      if (!sessionToDelete) {
        return false;
      }

      // Check if trying to delete an active session
      if (sessionToDelete.checkOutTime === null) {
        Alert.alert(
          'Cannot Delete Active Session',
          'Please check out first before deleting this session.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Remove the session from the list
      setAppData((prev: AppData) => ({
        ...prev,
        sessions: prev.sessions.filter((s: Session) => s.sessionId !== sessionId)
      }));

      // Save the updated data
      const success = await saveData();
      if (success) {
        Alert.alert('Success', 'Session deleted successfully.');
        return true;
      } else {
        // Revert the change if save failed
        setAppData((prev: AppData) => ({
          ...prev,
          sessions: [...prev.sessions, sessionToDelete]
        }));
        Alert.alert('Error', 'Failed to save changes. Session not deleted.');
        return false;
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      Alert.alert('Error', 'Failed to delete session.');
      return false;
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
    biometricEnabled,
    storageError,
    saveData,
    loadData,
    checkIn,
    checkOut,
    setEmployeeName,
    setEmail,
    setJobTitle,
    setDepartment,
    setPin,
    unlock,
    lock,
    exportData,
    importData,
    completeOnboarding,
    updateOnboardingProgress,
    resetOnboardingProgress,
    authenticateWithBiometrics,
    enableBiometricAuth,
    disableBiometricAuth,
    isBiometricSupported,
    clearStorageError,
    deleteSession,
    clearAllData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};