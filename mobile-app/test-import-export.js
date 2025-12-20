// Test file for import/export functionality
// This simulates the backup file format for testing

const testBackupData = {
  exportDate: new Date().toISOString(),
  exportTimestamp: Date.now(),
  version: '2.0',
  pharmacyName: 'Pharmacy Attendance System',
  employeeName: 'Test User',
  email: 'test@example.com',
  jobTitle: 'Pharmacy Technician',
  department: 'Pharmacy',
  summary: {
    totalSessions: 3,
    activeSessions: 1
  },
  sessions: [
    {
      sessionId: 'test-session-1',
      checkInTime: Date.now() - 3600000, // 1 hour ago
      checkInTimeReadable: new Date(Date.now() - 3600000).toLocaleString(),
      checkOutTime: Date.now() - 1800000, // 30 minutes ago
      checkOutTimeReadable: new Date(Date.now() - 1800000).toLocaleString(),
      duration: '00:30',
      reason: null
    },
    {
      sessionId: 'test-session-2',
      checkInTime: Date.now() - 7200000, // 2 hours ago
      checkInTimeReadable: new Date(Date.now() - 7200000).toLocaleString(),
      checkOutTime: Date.now() - 5400000, // 1.5 hours ago
      checkOutTimeReadable: new Date(Date.now() - 5400000).toLocaleString(),
      duration: '00:30',
      reason: 'Break'
    },
    {
      sessionId: 'test-session-3',
      checkInTime: Date.now() - 900000, // 15 minutes ago
      checkInTimeReadable: new Date(Date.now() - 900000).toLocaleString(),
      checkOutTime: null,
      checkOutTimeReadable: null,
      duration: 'Active',
      reason: null
    }
  ],
  rawData: {
    sessions: [
      {
        sessionId: 'test-session-1',
        checkInTime: Date.now() - 3600000,
        checkOutTime: Date.now() - 1800000,
        reason: null
      },
      {
        sessionId: 'test-session-2',
        checkInTime: Date.now() - 7200000,
        checkOutTime: Date.now() - 5400000,
        reason: 'Break'
      },
      {
        sessionId: 'test-session-3',
        checkInTime: Date.now() - 900000,
        checkOutTime: null,
        reason: null
      }
    ],
    employeeName: 'Test User',
    email: 'test@example.com',
    jobTitle: 'Pharmacy Technician',
    department: 'Pharmacy',
    onboardingCompleted: true
  }
};

console.log('Test backup data created successfully');
console.log('Data structure:', JSON.stringify(testBackupData, null, 2));

// Save this as a test file
const fs = require('fs');
fs.writeFileSync('./test-backup.json', JSON.stringify(testBackupData, null, 2));
console.log('Test backup file saved as test-backup.json');