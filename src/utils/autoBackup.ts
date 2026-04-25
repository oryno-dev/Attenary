import { Platform } from 'react-native';
import { Paths, File, Directory } from 'expo-file-system';
import { AppData } from '../types';

// Backup configuration
const BACKUP_DIR_NAME = 'SAS_Backups';
const MAX_BACKUPS = 5;
const BACKUP_PREFIX = 'attendance_backup_';
const BACKUP_EXTENSION = '.json';

/**
 * Get the backup directory path based on platform
 * Uses Paths.cache which is available on all platforms
 */
export const getBackupDirectory = async (): Promise<Directory | null> => {
  if (Platform.OS === 'web') {
    // Web doesn't have file system, use localStorage
    return null;
  }

   try {
     // Use Paths.cache for backup storage
     const backupDir = new Directory(Paths.cache, BACKUP_DIR_NAME);
     
     // Create directory if it doesn't exist
     if (!backupDir.exists) {
       await backupDir.create();
     }
     
     return backupDir;
   } catch (error) {
     console.error('Error getting backup directory:', error);
     return null;
   }
};

/**
 * Request storage permissions for Android
 * Note: For Android 10+, app-specific directories don't require permissions
 */
export const requestStoragePermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return true; // Web doesn't need permissions
  }

  // For Android 10+ (API 29+), scoped storage is used
  // App-specific directories don't require explicit permissions
  // The app.json configuration handles the permission declarations
  return true;
};

/**
 * Generate a timestamped backup filename
 */
const generateBackupFilename = (): string => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').substring(0, 19);
  return `${BACKUP_PREFIX}${timestamp}${BACKUP_EXTENSION}`;
};

/**
 * Create backup data structure with metadata
 */
const createBackupData = (appData: AppData): string => {
  const backup = {
    version: '2.0',
    backupDate: new Date().toISOString(),
    backupTimestamp: Date.now(),
    platform: Platform.OS,
    data: appData,
  };
  return JSON.stringify(backup, null, 2);
};

/**
 * Save backup to file
 */
export const saveBackupToFile = async (appData: AppData): Promise<boolean> => {
  if (Platform.OS === 'web') {
    // For web, save to localStorage as a backup
    try {
      const backupKey = 'SAS_AUTO_BACKUP';
      const backupData = createBackupData(appData);
      localStorage.setItem(backupKey, backupData);
      console.log('Web backup saved to localStorage');
      return true;
    } catch (error) {
      console.error('Error saving web backup:', error);
      return false;
    }
  }

  try {
    const backupDir = await getBackupDirectory();
    if (!backupDir) {
      console.error('Could not get backup directory');
      return false;
    }

    const filename = generateBackupFilename();
    const backupFile = new File(backupDir, filename);
    const backupData = createBackupData(appData);

     await backupFile.write(backupData);

    console.log(`Backup saved to: ${backupFile.uri}`);
    
    // Clean up old backups
    await cleanupOldBackups(backupDir);
    
    return true;
  } catch (error) {
    console.error('Error saving backup:', error);
    return false;
  }
};

/**
 * Get list of existing backup files
 */
export const getBackupFiles = async (backupDir: Directory): Promise<File[]> => {
  try {
    const contents = backupDir.list();
    
    return contents
      .filter((item): item is File => item instanceof File)
      .filter(file => file.name.startsWith(BACKUP_PREFIX) && file.name.endsWith(BACKUP_EXTENSION))
      .sort((a, b) => b.name.localeCompare(a.name)); // Most recent first
  } catch (error) {
    console.error('Error getting backup files:', error);
    return [];
  }
};

/**
 * Clean up old backups, keeping only the most recent MAX_BACKUPS
 */
export const cleanupOldBackups = async (backupDir: Directory): Promise<void> => {
  try {
    const backupFiles = await getBackupFiles(backupDir);
    
    if (backupFiles.length > MAX_BACKUPS) {
      const filesToDelete = backupFiles.slice(MAX_BACKUPS);
      
      for (const file of filesToDelete) {
        file.delete();
        console.log(`Deleted old backup: ${file.name}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old backups:', error);
  }
};

/**
 * Perform automatic backup (main entry point)
 * Called automatically after each data save
 */
export const performAutoBackup = async (appData: AppData): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const hasPermissions = await requestStoragePermissions();
    
    if (!hasPermissions) {
      return {
        success: false,
        message: 'Storage permissions not granted',
      };
    }

    const success = await saveBackupToFile(appData);
    
    if (success) {
      return {
        success: true,
        message: 'Backup completed successfully',
      };
    } else {
      return {
        success: false,
        message: 'Failed to save backup file',
      };
    }
  } catch (error) {
    console.log('Auto-backup error (non-critical):', error?.message || error);
    return {
      success: false,
      message: `Backup skipped: ${error?.message || 'Unknown error'}`,
    };
  }
};

/**
 * Get backup status and info
 */
export const getBackupStatus = async (): Promise<{
  lastBackupTime: number | null;
  backupCount: number;
  backupDir: string;
}> => {
  try {
    if (Platform.OS === 'web') {
      const backupData = localStorage.getItem('SAS_AUTO_BACKUP');
      if (backupData) {
        const parsed = JSON.parse(backupData);
        return {
          lastBackupTime: parsed.backupTimestamp || null,
          backupCount: 1,
          backupDir: 'localStorage',
        };
      }
      return {
        lastBackupTime: null,
        backupCount: 0,
        backupDir: 'localStorage',
      };
    }

    const backupDir = await getBackupDirectory();
    if (!backupDir) {
      return {
        lastBackupTime: null,
        backupCount: 0,
        backupDir: '',
      };
    }

    const backupFiles = await getBackupFiles(backupDir);
    
    let lastBackupTime: number | null = null;
    if (backupFiles.length > 0) {
      // Get the most recent backup's timestamp
      const mostRecent = backupFiles[0];
      const content = await mostRecent.text();
      const parsed = JSON.parse(content);
      lastBackupTime = parsed.backupTimestamp || null;
    }

    return {
      lastBackupTime,
      backupCount: backupFiles.length,
      backupDir: backupDir.uri,
    };
  } catch (error) {
    console.error('Error getting backup status:', error);
    return {
      lastBackupTime: null,
      backupCount: 0,
      backupDir: '',
    };
  }
};

/**
 * Restore data from the most recent backup
 */
export const restoreFromBackup = async (): Promise<AppData | null> => {
  try {
    if (Platform.OS === 'web') {
      const backupData = localStorage.getItem('SAS_AUTO_BACKUP');
      if (backupData) {
        const parsed = JSON.parse(backupData);
        return parsed.data || null;
      }
      return null;
    }

    const backupDir = await getBackupDirectory();
    if (!backupDir) {
      return null;
    }

    const backupFiles = await getBackupFiles(backupDir);
    
    if (backupFiles.length === 0) {
      console.log('No backup files found');
      return null;
    }

    // Get the most recent backup
    const mostRecent = backupFiles[0];
    const content = await mostRecent.text();
    const parsed = JSON.parse(content);
    
    console.log(`Restored from backup: ${mostRecent.name}`);
    return parsed.data || null;
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return null;
  }
};

export default {
  performAutoBackup,
  getBackupStatus,
  restoreFromBackup,
  getBackupDirectory,
  requestStoragePermissions,
};
