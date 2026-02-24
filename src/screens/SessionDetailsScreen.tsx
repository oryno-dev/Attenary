import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, fonts, shadows } from '../theme/colors';
import { formatTime, formatTimeReversed } from '../utils/timeUtils';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Session } from '../types';

// ═══════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════

const BackIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M19 12H5M5 12L12 19M5 12L12 5" 
      stroke={colors.textPrimary} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const ClockIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={colors.primary} strokeWidth="2" />
    <Path d="M12 7v5l3 3" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke={colors.primary} strokeWidth="2" />
    <Path d="M3 10h18M8 2v4M16 2v4" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ReasonIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" 
      stroke={colors.primary} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

const DurationIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={colors.primary} strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

interface SessionDetailsScreenProps {
  route: {
    params: {
      session: Session;
    };
  };
}

const SessionDetailsScreen: React.FC<SessionDetailsScreenProps> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { session } = route.params;

  const duration = session.checkOutTime
    ? Math.floor((session.checkOutTime - session.checkInTime) / 1000)
    : Math.floor((Date.now() - session.checkInTime) / 1000);

  const checkInDate = new Date(session.checkInTime);
  const checkOutDate = session.checkOutTime ? new Date(session.checkOutTime) : null;

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* ═══════════════════════════════════════════════════════════
          HEADER WITH BACK BUTTON
          ═══════════════════════════════════════════════════════════ */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <BackIcon size={24} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════════════════════════════════════════════════════════
            SESSION STATUS CARD
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.statusCard}>
          <View style={[
            styles.statusIndicator,
            session.checkOutTime === null && styles.statusIndicatorActive
          ]}>
            <View style={[
              styles.statusDot,
              session.checkOutTime === null && styles.statusDotActive
            ]} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>Session Status</Text>
            <Text style={[
              styles.statusValue,
              session.checkOutTime === null && styles.statusValueActive
            ]}>
              {session.checkOutTime === null ? 'Active Session' : 'Completed'}
            </Text>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            DATE & TIME SECTION
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <CalendarIcon size={20} />
            <Text style={styles.sectionTitle}>Date & Time</Text>
          </View>
          
          <View style={styles.timeRow}>
            <View style={styles.timeLabelContainer}>
              <ClockIcon size={16} />
              <Text style={styles.timeLabel}>Check In</Text>
            </View>
            <View style={styles.timeValueContainer}>
              <Text style={styles.timeValue}>
                {formatTimeReversed(checkInDate)}
              </Text>
              <Text style={styles.dateValue}>
                {checkInDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.timeRow}>
            <View style={styles.timeLabelContainer}>
              <ClockIcon size={16} />
              <Text style={styles.timeLabel}>Check Out</Text>
            </View>
            <View style={styles.timeValueContainer}>
              {checkOutDate ? (
                <>
                  <Text style={styles.timeValue}>
                    {formatTimeReversed(checkOutDate)}
                  </Text>
                  <Text style={styles.dateValue}>
                    {checkOutDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </>
              ) : (
                <Text style={styles.timeValueMuted}>Session still active</Text>
              )}
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            DURATION SECTION
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.durationCard}>
          <View style={styles.durationHeader}>
            <DurationIcon size={24} />
            <Text style={styles.durationLabel}>Total Duration</Text>
          </View>
          <Text style={[
            styles.durationValue,
            session.checkOutTime === null && styles.durationValueActive
          ]}>
            {formatTime(duration)}
          </Text>
          <Text style={styles.durationSubtext}>
            {Math.floor(duration / 3600)} hours, {Math.floor((duration % 3600) / 60)} minutes
          </Text>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            REASON SECTION - PROMINENTLY DISPLAYED
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.reasonCard}>
          <View style={styles.reasonHeader}>
            <ReasonIcon size={24} />
            <Text style={styles.reasonTitle}>Reason for Checking Out</Text>
          </View>
          
          <View style={styles.reasonContent}>
            {session.reason ? (
              <Text style={styles.reasonText}>{session.reason}</Text>
            ) : (
              <View style={styles.noReasonContainer}>
                <Text style={styles.noReasonText}>No reason provided</Text>
                <Text style={styles.noReasonSubtext}>
                  This session was completed without a checkout reason
                </Text>
              </View>
            )}
          </View>
        </View>

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
    paddingBottom: spacing.xxxl,
  },

  // ═══════════════════════════════════════════════════════════════
  // HEADER
  // ═══════════════════════════════════════════════════════════════
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.huge,
    paddingBottom: spacing.lg,
    backgroundColor: colors.bgMain,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
  },
  backButtonText: {
    color: colors.textPrimary,
    fontSize: fonts.sizes.md,
    fontWeight: '600' as const,
    marginLeft: spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.xl,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 80, // Balance the back button width
  },

  // ═══════════════════════════════════════════════════════════════
  // STATUS CARD
  // ═══════════════════════════════════════════════════════════════
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  statusIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  statusIndicatorActive: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.textMuted,
  },
  statusDotActive: {
    backgroundColor: colors.primary,
    ...shadows.neonGlowSubtle,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  statusValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  statusValueActive: {
    color: colors.primary,
  },

  // ═══════════════════════════════════════════════════════════════
  // SECTION CARD
  // ═══════════════════════════════════════════════════════════════
  sectionCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    gap: spacing.xs,
  },
  timeLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
  timeValueContainer: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  timeValue: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  timeValueMuted: {
    fontSize: fonts.sizes.md,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  dateValue: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },

  // ═══════════════════════════════════════════════════════════════
  // DURATION CARD
  // ═══════════════════════════════════════════════════════════════
  durationCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadows.card,
  },
  durationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  durationLabel: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  durationValue: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  durationValueActive: {
    color: colors.primary,
  },
  durationSubtext: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  // ═══════════════════════════════════════════════════════════════
  // REASON CARD - PROMINENT
  // ═══════════════════════════════════════════════════════════════
  reasonCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.neonGlowSubtle,
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  reasonTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  reasonContent: {
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  reasonText: {
    fontSize: fonts.sizes.lg,
    color: colors.textPrimary,
    lineHeight: 28,
  },
  noReasonContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  noReasonText: {
    fontSize: fonts.sizes.md,
    color: colors.textMuted,
    fontWeight: '500' as const,
    marginBottom: spacing.xs,
  },
  noReasonSubtext: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default SessionDetailsScreen;
