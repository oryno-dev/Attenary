import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, fonts, shadows, glassStyles } from '../theme/colors';
import { formatTime, formatHoursMinutes, getTodayString, getDateString, formatTimeReversed } from '../utils/timeUtils';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// ═══════════════════════════════════════════════════════════════════
// FUTURISTIC 2026 GLASSMORPHISM ICONS
// ═══════════════════════════════════════════════════════════════════

const ClockIcon = ({ color = colors.textMuted, size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" opacity={0.8} />
    <Path 
      d="M12 7v5l3 3" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckInIcon = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={colors.primary} strokeWidth="2" />
    <Path 
      d="M8 12l3 3 5-6" 
      stroke={colors.primary} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckOutIcon = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="6" y="6" width="12" height="12" rx="2" stroke={colors.danger} strokeWidth="2" />
    <Path 
      d="M9 12h6" 
      stroke={colors.danger} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
  </Svg>
);

const BackupIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 3v12m0 0l-4-4m4 4l4-4" 
      stroke={colors.textSecondary} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M4 17a8 8 0 1016 0" 
      stroke={colors.textSecondary} 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
  </Svg>
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
      'Create Backup',
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

  const formatCurrentTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatCurrentDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════════════════════════════════════════════════════════
            HEADER SECTION - Time & Date Display
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.headerSection}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              {currentTime.getHours() < 12 ? 'Good Morning' : 
               currentTime.getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
            </Text>
            <Text style={styles.employeeName}>{employeeName || 'Employee'}</Text>
          </View>
          
          {/* Time Display Card */}
          <View style={styles.timeCard}>
            <View style={styles.timeGlow} />
            <Text style={styles.currentTime}>{formatCurrentTime(currentTime)}</Text>
            <Text style={styles.currentDate}>{formatCurrentDate(currentDate)}</Text>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            STATS SECTION - Glass Cards
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIconContainer}>
              <ClockIcon color={colors.primary} size={20} />
            </View>
            <Text style={styles.statLabel}>Today's Hours</Text>
            <Text style={[styles.statValue, styles.statValuePrimary]}>
              {formatHoursMinutes(totalSeconds)}
            </Text>
          </View>
          
          <View style={styles.statRow}>
            <View style={[styles.statCard, styles.statCardSmall]}>
              <View style={styles.statIndicator} />
              <Text style={styles.statLabel}>Status</Text>
              <Text style={[
                styles.statValueSmall, 
                activeSession && styles.statValueActive
              ]}>
                {activeSession ? 'Active' : 'Idle'}
              </Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardSmall]}>
              <Text style={styles.statLabel}>Sessions</Text>
              <Text style={styles.statValueSmall}>{todaySessions.length}</Text>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            ACTION BUTTONS - Neon Accented
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              styles.checkInButton,
              activeSession && styles.buttonDisabled
            ]} 
            onPress={handleCheckIn}
            disabled={!!activeSession}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonIconContainer}>
                <CheckInIcon size={24} />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>
                  {activeSession ? 'Already Checked In' : 'Check In'}
                </Text>
                <Text style={styles.buttonSubtitle}>
                  {activeSession ? 'Session in progress' : 'Start your work session'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.actionButton,
              styles.checkOutButton,
              !activeSession && styles.buttonDisabled
            ]} 
            onPress={handleCheckOut}
            disabled={!activeSession}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <View style={[styles.buttonIconContainer, styles.buttonIconContainerDanger]}>
                <CheckOutIcon size={24} />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonTitle, styles.buttonTitleDanger]}>Check Out</Text>
                <Text style={styles.buttonSubtitle}>
                  {activeSession ? 'End your work session' : 'No active session'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleExit}
            activeOpacity={0.8}
          >
            <BackupIcon size={22} />
            <Text style={styles.secondaryButtonText}>Create Backup</Text>
          </TouchableOpacity>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            ACTIVE SESSION - Glowing Panel
            ═══════════════════════════════════════════════════════════ */}
        {activeSession && (
          <View style={styles.activeSection}>
            <View style={styles.activeSectionHeader}>
              <View style={styles.pulseContainer}>
                <View style={styles.pulseDot} />
                <View style={styles.pulseRing} />
              </View>
              <Text style={styles.activeSectionTitle}>Current Session</Text>
            </View>
            
            <View style={styles.activeSessionCard}>
              <View style={styles.activeSessionInfo}>
                <Text style={styles.activeSessionName}>
                  {employeeName || 'Employee'}
                </Text>
                <Text style={styles.activeSessionTime}>
                  Started at {formatTimeReversed(new Date(activeSession.checkInTime))}
                </Text>
              </View>
              
              <View style={styles.activeTimerContainer}>
                <Text style={styles.activeTimerLabel}>Duration</Text>
                <Text style={styles.activeTimer}>
                  {formatTime(Math.floor((Date.now() - activeSession.checkInTime) / 1000))}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════════
            NAME MODAL - Glass Modal
            ═══════════════════════════════════════════════════════════ */}
        {nameModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Set Your Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your name"
                placeholderTextColor={colors.textMuted}
                value={employeeName}
                onChangeText={setEmployeeName}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={() => setNameModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirmButton} 
                  onPress={saveEmployeeName}
                >
                  <Text style={styles.modalConfirmText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.xl,
    paddingTop: spacing.huge,
  },

  // ═══════════════════════════════════════════════════════════════
  // HEADER SECTION
  // ═══════════════════════════════════════════════════════════════
  headerSection: {
    marginBottom: spacing.xxxl,
  },
  greetingContainer: {
    marginBottom: spacing.xl,
  },
  greetingText: {
    fontSize: fonts.sizes.lg,
    color: colors.textSecondary,
    fontWeight: '500' as const,
    marginBottom: spacing.xs,
  },
  employeeName: {
    fontSize: fonts.sizes.hero,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  timeCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.card,
  },
  timeGlow: {
    position: 'absolute',
    top: -50,
    left: '50%',
    marginLeft: -100,
    width: 200,
    height: 100,
    backgroundColor: colors.primaryGlow,
    borderRadius: 100,
    opacity: 0.3,
  },
  currentTime: {
    fontSize: fonts.sizes.massive,
    fontWeight: '900' as const,
    color: colors.textPrimary,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  currentDate: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },

  // ═══════════════════════════════════════════════════════════════
  // STATS SECTION
  // ═══════════════════════════════════════════════════════════════
  statsContainer: {
    marginBottom: spacing.xxl,
  },
  statCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.glass,
  },
  statCardPrimary: {
    borderColor: colors.borderAccent,
    marginBottom: spacing.md,
  },
  statCardSmall: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statIconContainer: {
    marginBottom: spacing.sm,
  },
  statIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    fontWeight: '500' as const,
  },
  statValue: {
    fontSize: fonts.sizes.massive,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  statValuePrimary: {
    color: colors.primary,
  },
  statValueSmall: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  statValueActive: {
    color: colors.primary,
  },

  // ═══════════════════════════════════════════════════════════════
  // BUTTONS SECTION
  // ═══════════════════════════════════════════════════════════════
  buttonsContainer: {
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  actionButton: {
    borderRadius: borderRadius.button,
    padding: spacing.lg,
    overflow: 'hidden',
    ...shadows.button,
  },
  checkInButton: {
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
  },
  checkOutButton: {
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  buttonIconContainerDanger: {
    backgroundColor: 'rgba(255, 51, 102, 0.15)',
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700' as const,
    color: colors.bgMain,
    marginBottom: 2,
  },
  buttonTitleDanger: {
    color: colors.danger,
  },
  buttonSubtitle: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  secondaryButton: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.button,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },

  // ═══════════════════════════════════════════════════════════════
  // ACTIVE SESSION SECTION
  // ═══════════════════════════════════════════════════════════════
  activeSection: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadows.neonGlowSubtle,
  },
  activeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  pulseContainer: {
    width: 20,
    height: 20,
    marginRight: spacing.md,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  pulseRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.5,
  },
  activeSectionTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: '700' as const,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  activeSessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  activeSessionInfo: {
    flex: 1,
  },
  activeSessionName: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  activeSessionTime: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  activeTimerContainer: {
    alignItems: 'flex-end',
  },
  activeTimerLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  activeTimer: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700' as const,
    color: colors.primary,
    fontFamily: 'monospace',
  },

  // ═══════════════════════════════════════════════════════════════
  // MODAL STYLES
  // ═══════════════════════════════════════════════════════════════
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.glassElevated,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    color: colors.textPrimary,
    fontSize: fonts.sizes.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.button,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.button,
    padding: spacing.lg,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: fonts.sizes.md,
    fontWeight: '700' as const,
    color: colors.bgMain,
  },
});

export default TimeClockScreen;
