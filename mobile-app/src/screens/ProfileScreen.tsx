import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';

// SVG Icons
const EditIcon = ({ color = '#94a3b8', size = 16 }) => (
  <View style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 20h9M13.5 6.5l-7 7-3 3 3.5-3 6.5-6.5z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </View>
);

const LockIcon = ({ color = '#94a3b8', size = 20 }) => (
  <View style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 15v3m-3-3h6M5 9h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M9 9V7a4 4 0 1 1 6 0v2" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </View>
);

const UnlockIcon = ({ color = '#94a3b8', size = 20 }) => (
  <View style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 15v3m-3-3h6M5 9h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M13 9V7a4 4 0 1 1 8 0v2" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </View>
);

const ExportIcon = ({ color = '#94a3b8', size = 20 }) => (
  <View style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M4 16a8 8 0 1 1 16 0" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 8v8" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </View>
);

const ImportIcon = ({ color = '#94a3b8', size = 20 }) => (
  <View style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M4 16a8 8 0 1 1 16 0" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 16v-8" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </View>
);

const ProfileScreen = () => {
  const { appData, pin, setPin, lock, exportData, importData, setEmployeeName, setEmail, setJobTitle, setDepartment, biometricEnabled, authenticateWithBiometrics, enableBiometricAuth, disableBiometricAuth, isBiometricSupported } = useApp();
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [jobTitleModalVisible, setJobTitleModalVisible] = useState(false);
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false);
  const [employeeName, setEmployeeNameInput] = useState(appData.employeeName);
  const [email, setEmailInput] = useState(appData.email);
  const [jobTitle, setJobTitleInput] = useState(appData.jobTitle);
  const [department, setDepartmentInput] = useState(appData.department);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricSwitchEnabled, setBiometricSwitchEnabled] = useState(biometricEnabled);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const supported = await isBiometricSupported();
    setBiometricSupported(supported);
  };

  const handleExport = async () => {
    const success = await exportData();
    if (success) {
      Alert.alert('Success', 'Data exported successfully', [
        { text: 'OK', onPress: () => {} }
      ]);
    } else {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImport = async () => {
    Alert.alert(
      'Import Data',
      'This will replace all your current attendance data. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          style: 'destructive',
          onPress: async () => {
            const success = await importData();
            if (!success) {
              Alert.alert('Import Failed', 'Failed to import data. Please check the file format.');
            }
          }
        }
      ]
    );
  };

  const handleSetPin = async () => {
    if (pinInput.length !== 6) {
      Alert.alert('Error', 'PIN must be exactly 6 digits');
      return;
    }
    setPin(pinInput);
    setPinInput('');
    setPinModalVisible(false);
  };

  const handleRemovePin = () => {
    setPin('');
    setPinModalVisible(false);
  };

  const handleLockData = async () => {
    Alert.alert(
      'Lock Data',
      'Are you sure you want to lock your attendance data? This will require PIN or biometric authentication to unlock.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Lock', style: 'destructive', onPress: lock }
      ]
    );
  };

  const handleUnlockData = async () => {
    if (biometricEnabled && biometricSupported) {
      const success = await authenticateWithBiometrics();
      if (success) {
        Alert.alert('Success', 'Data unlocked using biometric authentication');
      } else {
        Alert.alert('Authentication Failed', 'Biometric authentication failed. Please try again.');
      }
    } else {
      Alert.alert('PIN Required', 'Please set a PIN first to unlock your data.');
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      // Enable biometric authentication
      if (!biometricSupported) {
        Alert.alert('Biometric Authentication', 'This device does not support biometric authentication.');
        return;
      }
      
      if (!pin) {
        Alert.alert('PIN Required', 'Please set a PIN first before enabling biometric authentication.');
        return;
      }

      const success = await enableBiometricAuth();
      if (success) {
        setBiometricSwitchEnabled(true);
        Alert.alert('Success', 'Biometric authentication enabled');
      } else {
        setBiometricSwitchEnabled(false);
      }
    } else {
      // Disable biometric authentication
      await disableBiometricAuth();
      setBiometricSwitchEnabled(false);
      Alert.alert('Success', 'Biometric authentication disabled');
    }
  };

  const saveEmployeeName = () => {
    if (!employeeName.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }
    setEmployeeName(employeeName.trim());
    setNameModalVisible(false);
  };

  const saveEmail = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    setEmail(email.trim());
    setEmailModalVisible(false);
  };

  const saveJobTitle = () => {
    if (!jobTitle.trim()) {
      Alert.alert('Error', 'Please enter your job title.');
      return;
    }
    setJobTitle(jobTitle.trim());
    setJobTitleModalVisible(false);
  };

  const saveDepartment = () => {
    if (!department.trim()) {
      Alert.alert('Error', 'Please enter your department.');
      return;
    }
    setDepartment(department.trim());
    setDepartmentModalVisible(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Profile</Text>

      {/* Personal Information Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        
        <TouchableOpacity style={styles.profileRow} onPress={() => setNameModalVisible(true)}>
          <View>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>
              {appData.employeeName || 'Tap to set your name'}
            </Text>
          </View>
          <EditIcon color="#94a3b8" size={16} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.profileRow} onPress={() => setEmailModalVisible(true)}>
          <View>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>
              {appData.email || 'user@example.com'}
            </Text>
          </View>
          <EditIcon color="#94a3b8" size={16} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.profileRow} onPress={() => setJobTitleModalVisible(true)}>
          <View>
            <Text style={styles.infoLabel}>Job Title</Text>
            <Text style={styles.infoValue}>
              {appData.jobTitle || 'Pharmacy Staff'}
            </Text>
          </View>
          <EditIcon color="#94a3b8" size={16} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.profileRow} onPress={() => setDepartmentModalVisible(true)}>
          <View>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>
              {appData.department || 'Pharmacy'}
            </Text>
          </View>
          <EditIcon color="#94a3b8" size={16} />
        </TouchableOpacity>
      </View>

      {/* Privacy Settings Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Privacy & Security</Text>
        
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>PIN Protection</Text>
            <Text style={styles.settingSublabel}>
              {pin ? 'Enabled - 6-digit PIN required' : 'Disabled - No PIN protection'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => setPinModalVisible(true)}
          >
            <Text style={styles.settingButtonText}>
              {pin ? 'Change PIN' : 'Set PIN'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {biometricSupported && (
          <>
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Biometric Authentication</Text>
                <Text style={styles.settingSublabel}>
                  Use fingerprint or face recognition
                </Text>
              </View>
              <Switch
                value={biometricSwitchEnabled}
                onValueChange={handleBiometricToggle}
                thumbColor={biometricSwitchEnabled ? colors.primary : colors.textMuted}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
              />
            </View>
            <View style={styles.divider} />
          </>
        )}

        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Data Security</Text>
            <Text style={styles.settingSublabel}>
              {pin ? 'Protected - Lock/unlock with PIN or biometrics' : 'Protected - Lock/unlock functionality available'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.lockButton}
            onPress={handleLockData}
          >
            <Text style={styles.lockButtonText}>Lock Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Visual Separator */}
      <View style={styles.sectionSeparator}>
        <Text style={styles.sectionSeparatorText}>🔧 DATA & BACKUP</Text>
      </View>

      {/* Data Management Card */}
      <View style={[styles.card, styles.dataManagementCard]}>
        <View style={styles.dataManagementHeader}>
          <Text style={[styles.cardTitle, styles.dataManagementTitle]}>📊 Data Management</Text>
        </View>
        
        <View style={{ marginBottom: spacing.md }}>
          <Text style={styles.dataManagementDescription}>
            Export your attendance data to share or backup
          </Text>
        </View>
        <TouchableOpacity style={[styles.dataButton, styles.exportButton]} onPress={handleExport}>
          <ExportIcon color={colors.primary} size={24} />
          <Text style={[styles.dataButtonText, { color: colors.primary }]}>Export Data</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={{ marginBottom: spacing.md }}>
          <Text style={styles.dataManagementDescription}>
            Import attendance data from a backup file
          </Text>
        </View>
        <TouchableOpacity style={[styles.dataButton, styles.importButton]} onPress={handleImport}>
          <ImportIcon color={colors.textPrimary} size={24} />
          <Text style={styles.dataButtonText}>Import Data</Text>
        </TouchableOpacity>
      </View>

      {/* Name Modal */}
      {nameModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Your Name</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textMuted}
              value={employeeName}
              onChangeText={setEmployeeNameInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setNameModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={saveEmployeeName}>
                <Text style={styles.confirmButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Email Modal */}
      {emailModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Your Email</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your email address"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmailInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEmailModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={saveEmail}>
                <Text style={styles.confirmButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Job Title Modal */}
      {jobTitleModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Your Job Title</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your job title"
              placeholderTextColor={colors.textMuted}
              value={jobTitle}
              onChangeText={setJobTitleInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setJobTitleModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={saveJobTitle}>
                <Text style={styles.confirmButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Department Modal */}
      {departmentModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Your Department</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your department"
              placeholderTextColor={colors.textMuted}
              value={department}
              onChangeText={setDepartmentInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setDepartmentModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={saveDepartment}>
                <Text style={styles.confirmButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* PIN Modal */}
      {pinModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {pin ? 'Change PIN' : 'Set PIN'}
            </Text>
            <Text style={styles.modalSubtitle}>
              Enter a 6-digit PIN to protect your data
            </Text>
            <TextInput
              style={styles.pinInput}
              placeholder="Enter 6-digit PIN"
              placeholderTextColor={colors.textMuted}
              value={pinInput}
              onChangeText={setPinInput}
              keyboardType="numeric"
              maxLength={6}
              textAlign="center"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setPinModalVisible(false);
                  setPinInput('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleSetPin}
              >
                <Text style={styles.confirmButtonText}>Save PIN</Text>
              </TouchableOpacity>
            </View>
            {pin && (
              <>
                <View style={styles.divider} />
                <TouchableOpacity
                  style={[styles.dangerButton, styles.fullWidthButton]}
                  onPress={() => {
                    Alert.alert(
                      'Remove PIN',
                      'This will remove PIN protection from your data.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', onPress: handleRemovePin }
                      ]
                    );
                  }}
                >
                  <Text style={styles.confirmButtonText}>Remove PIN</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  contentContainer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl + 100, // Extra padding for tab bar and scrolling
  },
  title: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontWeight: fonts.weights.medium as any,
  },
  infoValue: {
    fontSize: fonts.sizes.md,
    color: colors.textPrimary,
    fontWeight: fonts.weights.semibold as any,
  },
  editText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingLabel: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textPrimary,
  },
  settingSublabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  settingButtonText: {
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium as any,
    fontSize: fonts.sizes.sm,
  },
  lockButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 80,
  },
  lockButtonText: {
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium as any,
    fontSize: fonts.sizes.sm,
    textAlign: 'center',
  },
  settingIcon: {
    fontSize: 20,
  },
  dataButton: {
    backgroundColor: colors.bgMain,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dataButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textPrimary,
  },
  importButton: {
    backgroundColor: colors.danger,
  },
  dataManagementCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.bgCard,
  },
  dataManagementTitle: {
    color: colors.primary,
    fontSize: fonts.sizes.xl,
  },
  dataManagementHeader: {
    marginBottom: spacing.lg,
  },
  sectionSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionSeparatorText: {
    color: colors.textMuted,
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold as any,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dataManagementDescription: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  exportButton: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primary + '10',
  },
  dangerButton: {
    backgroundColor: colors.danger,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: colors.bgMain,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
  },
  modalTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  nameInput: {
    backgroundColor: colors.bgMain,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
    fontSize: fonts.sizes.md,
  },
  pinInput: {
    backgroundColor: colors.bgMain,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cancelButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium as any,
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
  },
  fullWidthButton: {
    width: '100%',
    marginTop: spacing.md,
  },
});

export default ProfileScreen;