import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_KEY = 'PHARMACY_EMPLOYEE_PIN_SECURE';
const SALT_KEY = 'PHARMACY_PIN_SALT';
const UNLOCKED_KEY = 'PHARMACY_PIN_UNLOCKED';

// Generate a random salt for hashing (web only)
const generateSalt = (): string => {
  const array = new Uint8Array(16);
  // Use crypto API if available
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for older environments
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Simple hash function using PBKDF2-like approach for web
const hashPin = async (pin: string, salt: string): Promise<string> => {
  // Use SubtleCrypto API for web
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(pin),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 1000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    return Array.from(new Uint8Array(derivedBits))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  // Fallback: simple hash for environments without SubtleCrypto
  let hash = '';
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    const saltChar = salt.charCodeAt(i % salt.length);
    hash += ((char + saltChar) % 256).toString(16).padStart(2, '0');
  }
  // Pad to 64 characters (256 bits)
  while (hash.length < 64) {
    hash += salt.charCodeAt(hash.length % salt.length).toString(16).padStart(2, '0');
  }
  return hash;
};

export const storePin = async (pin: string): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      // For web: store hashed PIN
      const salt = generateSalt();
      const hashedPin = await hashPin(pin, salt);
      await AsyncStorage.setItem(PIN_KEY, JSON.stringify({ 
        hashedPin, 
        salt,
        unlocked: false 
      }));
    } else {
      // For native: use SecureStore
      await SecureStore.setItemAsync(PIN_KEY, pin);
      // Store unlocked state separately
      await AsyncStorage.setItem(UNLOCKED_KEY, JSON.stringify(false));
    }
    return true;
  } catch (error) {
    console.error('Error storing PIN:', error);
    return false;
  }
};

export const getPin = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      const data = await AsyncStorage.getItem(PIN_KEY);
      if (data) {
        const { hashedPin } = JSON.parse(data);
        return hashedPin; // Return hashed for verification
      }
      return null;
    } else {
      return await SecureStore.getItemAsync(PIN_KEY);
    }
  } catch (error) {
    console.error('Error getting PIN:', error);
    return null;
  }
};

export const verifyPin = async (inputPin: string): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      const data = await AsyncStorage.getItem(PIN_KEY);
      if (data) {
        const { hashedPin, salt } = JSON.parse(data);
        const inputHashed = await hashPin(inputPin, salt);
        return hashedPin === inputHashed;
      }
      return false;
    } else {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      return storedPin === inputPin;
    }
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return false;
  }
};

export const getUnlockedState = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      const data = await AsyncStorage.getItem(PIN_KEY);
      if (data) {
        return JSON.parse(data).unlocked || false;
      }
    } else {
      const unlocked = await AsyncStorage.getItem(UNLOCKED_KEY);
      return unlocked ? JSON.parse(unlocked) : false;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const setUnlockedState = async (unlocked: boolean): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      const data = await AsyncStorage.getItem(PIN_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        await AsyncStorage.setItem(PIN_KEY, JSON.stringify({
          ...parsed,
          unlocked
        }));
      }
    } else {
      await AsyncStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));
    }
  } catch (error) {
    console.error('Error setting unlocked state:', error);
  }
};

// Check if a PIN has been set
export const hasPin = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      const data = await AsyncStorage.getItem(PIN_KEY);
      return data !== null;
    } else {
      const pin = await SecureStore.getItemAsync(PIN_KEY);
      return pin !== null;
    }
  } catch (error) {
    return false;
  }
};

// Clear PIN data
export const clearPin = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(PIN_KEY);
    } else {
      await SecureStore.deleteItemAsync(PIN_KEY);
      await AsyncStorage.removeItem(UNLOCKED_KEY);
    }
  } catch (error) {
    console.error('Error clearing PIN:', error);
  }
};
