import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';
import { formatTime, formatHoursMinutes, getTodayString, getDateString, formatTimeReversed } from '../utils/timeUtils';

// SVG Icons
const ClockIcon = ({ color = '#94a3b8', size = 24 }) => (
  <View style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <path 
        d="M12 7v5l3 3" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </View>
);

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

const BackupIcon = ({ color = '#94a3b8', size = 24 }) => (
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

const TimeClockScreen = () => {
  const { appData, loading, checkIn, checkOut } = useApp();
  const navigation: any = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [employeeName, setEmployeeName] = useState(appData.employeeName);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dateTimer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(dateTimer);
  }, []);

  useEffect(() => {
    setEmployeeName(appData.employeeName);
  }, [appData.employeeName]);

  const activeSession = appData.sessions.find((s: any) => s.checkOutTime === null);
  const todaySessions = appData.sessions.filter((s: any) => getDateString(s.checkInTime) === getTodayString());

  let totalSeconds = 0;
  todaySessions.forEach((s: any) => {
    const end = s.checkOutTime || Date.now();
    totalSeconds += Math.floor((end - s.checkInTime) / 1000);
  });

  const handleCheckIn = () => {
    navigation.navigate('CheckInModal');
  };

  const handleCheckOut = async () => {
    if (!activeSession) {
      Alert.alert('No Active Session', 'You are not currently checked in.');
      return;
    }
    navigation.navigate('CheckOutModal');
  };

  const handleExit = () => {
    Alert.alert(
      'Close Pharmacy & Backup',
      'This will create a backup of your attendance data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create Backup', onPress: () => {} }
      ]
    );
  };

  const saveEmployeeName = () => {
    if (!employeeName.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }
    setNameModalVisible(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={true}
    >
      {/* Removed Header, Date Display, and Time Display */}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today's Hours</Text>
          <Text style={styles.statValue}>{formatHoursMinutes(totalSeconds)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Session</Text>
          <Text style={styles.statValue}>{activeSession ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Sessions</Text>
          <Text style={styles.statValue}>{todaySessions.length}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[
            styles.checkInButton,
            activeSession && styles.checkInButtonDisabled
          ]} 
          onPress={handleCheckIn}
          disabled={!!activeSession}
        >
          <Text style={styles.checkInButtonText}>
            {activeSession ? '✓ Already Checked In' : '✓ Check In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.checkOutButton,
            !activeSession && styles.checkOutButtonDisabled
          ]} 
          onPress={handleCheckOut}
          disabled={!activeSession}
        >
          <Text style={styles.checkOutButtonText}>◼ Check Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <BackupIcon color="#94a3b8" size={24} />
          <Text style={styles.exitButtonText}>Create Backup</Text>
        </TouchableOpacity>
      </View>

      {/* Active Session */}
      {activeSession && (
        <View style={styles.activeSection}>
          <Text style={styles.activeSectionTitle}>Current Session</Text>
          <View style={styles.activeItem}>
            <View>
              <Text style={styles.activeItemName}>{employeeName || 'Employee'}</Text>
              <Text style={styles.activeItemInfo}>
                Started at {formatTimeReversed(new Date(activeSession.checkInTime))} • Active for {formatTime(Math.floor((Date.now() - activeSession.checkInTime) / 1000))}
              </Text>
            </View>
            <Text style={styles.activeItemTimer}>{formatTime(Math.floor((Date.now() - activeSession.checkInTime) / 1000))}</Text>
          </View>
        </View>
      )}

      {/* Set Name Modal */}
      {nameModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Your Name</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your name"
              placeholderTextColor={colors.textMuted}
              value={employeeName}
              onChangeText={setEmployeeName}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  headerIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  headerIconText: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium as any,
  },
  nameDisplay: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontWeight: fonts.weights.medium as any,
  },
  nameButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.bgMain,
    borderRadius: borderRadius.md,
  },
  nameText: {
    fontSize: fonts.sizes.md,
    color: colors.textPrimary,
    flex: 1,
  },
  editText: {
    fontSize: 16,
    marginLeft: spacing.sm,
  },
  dateDisplay: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  dateText: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textSecondary,
  },
  timeDisplay: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 32,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    fontFamily: 'monospace',
    marginBottom: spacing.sm,
  },
  statusText: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.sm,
  },
  statLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.05,
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  buttonsContainer: {
    marginBottom: spacing.xl,
  },
  checkInButton: {
    backgroundColor: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  checkInButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  checkInButtonText: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
  },
  checkOutButton: {
    backgroundColor: 'linear-gradient(135deg, #ef4444, #dc2626)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  checkOutButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  checkOutButtonText: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
  },
  exitButton: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  exitButtonText: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
  },
  activeSection: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  activeSectionTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold as any,
    color: colors.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.1,
    marginBottom: spacing.md,
  },
  activeItem: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeItemName: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  activeItemInfo: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
  activeItemTimer: {
    fontSize: 24,
    fontWeight: fonts.weights.bold as any,
    color: colors.primary,
    fontFamily: 'monospace',
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
  },
  modalContent: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    zIndex: 1000,
  },
  modalTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
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
});

export default TimeClockScreen;