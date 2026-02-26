import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fonts, shadows } from '../theme/colors';
import { formatHoursMinutes, getTodayString, getDateString, formatTimeReversed } from '../utils/timeUtils';
import BarChartComponent from '../components/BarChartComponent';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';

// ═══════════════════════════════════════════════════════════════════
// FUTURISTIC 2026 GLASSMORPHISM ICONS
// ═══════════════════════════════════════════════════════════════════

const LogIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" 
      stroke={colors.primary} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V5z" 
      stroke={colors.primary} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path d="M9 10h6" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
    <Path d="M9 14h6" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ClockIcon = ({ size = 20, color = colors.textMuted }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SessionIcon = ({ size = 20, color = colors.textMuted }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="3" fill={color} />
  </Svg>
);

const ChartIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3v18h18" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 16l4-4 4 4 5-6" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DailyLogScreen = ({ navigation }: any) => {
  const { appData } = useApp();
  const { t, isRTL, language } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);

  const today = getTodayString();
  const sessions = appData.sessions.filter((s: any) => getDateString(s.checkInTime) === today);

  // Calculate hourly data for bar chart
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const sessionsByHour = new Map();

    // Initialize all hours with 0
    hours.forEach(hour => {
      sessionsByHour.set(hour, 0);
    });

    // Count sessions by hour
    sessions.forEach((session: any) => {
      const hour = new Date(session.checkInTime).getHours();
      sessionsByHour.set(hour, (sessionsByHour.get(hour) || 0) + 1);
    });

    const data = Array.from(sessionsByHour.values());
    const labels = hours.map(hour => `${hour}:00`);

    return {
      labels: labels,
      datasets: [{
        data: data
      }]
    };
  }, [sessions]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Calculate today's statistics
  const todayStats = useMemo(() => {
    const totalSessions = sessions.length;
    let totalDuration = 0;
    let activeSessions = 0;

    sessions.forEach((session: any) => {
      if (session.checkOutTime) {
        totalDuration += session.checkOutTime - session.checkInTime;
      } else {
        activeSessions++;
      }
    });

    return {
      totalSessions,
      activeSessions,
      completedSessions: totalSessions - activeSessions,
      totalDuration
    };
  }, [sessions]);

  // Get today's date formatted
  const todayFormatted = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* ═══════════════════════════════════════════════════════════
            HEADER SECTION
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.headerSection}>
          <View style={[
            styles.headerIconContainer,
            isRTL && styles.headerIconContainerRTL
          ]}>
            <LogIcon size={28} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{t('dailylog.todaysLog')}</Text>
            <Text style={styles.subtitle}>{todayFormatted}</Text>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            STATS SECTION - Glass Cards
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.statsContainer}>
          {/* Main Hours Card */}
          <View style={styles.mainStatCard}>
            <View style={styles.mainStatGlow} />
            <View style={styles.mainStatIconContainer}>
              <ClockIcon size={24} color={colors.primary} />
            </View>
            <Text style={styles.mainStatLabel}>{t('dailylog.totalHours')}</Text>
            <Text style={styles.mainStatValue}>
              {formatHoursMinutes(todayStats.totalDuration / 1000)}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <SessionIcon size={18} color={colors.primary} />
              </View>
              <Text style={styles.statLabel}>{t('dailylog.sessions')}</Text>
              <Text style={styles.statValue}>{todayStats.totalSessions}</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, styles.statIconActive]}>
                <SessionIcon size={18} color={colors.info} />
              </View>
              <Text style={styles.statLabel}>{t('dailylog.active')}</Text>
              <Text style={[styles.statValue, styles.statValueInfo]}>{todayStats.activeSessions}</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, styles.statIconSuccess]}>
                <SessionIcon size={18} color={colors.success} />
              </View>
              <Text style={styles.statLabel}>{t('dailylog.done')}</Text>
              <Text style={[styles.statValue, styles.statValueSuccess]}>{todayStats.completedSessions}</Text>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            BAR CHART - Glass Panel
            ═══════════════════════════════════════════════════════════ */}
        {sessions.length > 0 && (
          <View style={styles.chartSection}>
            <View style={styles.chartHeader}>
              <View style={[
                styles.chartIconContainer,
                isRTL && styles.chartIconContainerRTL
              ]}>
                <ChartIcon size={20} />
              </View>
              <Text style={styles.chartTitle}>{t('dailylog.hourlyActivity')}</Text>
            </View>
            <BarChartComponent
              data={hourlyData}
              title=""
              yAxisLabel=""
              yAxisSuffix={` ${t('dailylog.sessionsPerHour')}`}
              showValuesOnTopOfBars={true}
              use12HourFormat={true}
              showAllLabels={true}
            />
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════════
            SESSIONS LIST - Glass Cards
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.sessionsSection}>
          <Text style={styles.sectionTitle}>{t('dailylog.sessions')}</Text>
          
          {sessions.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <LogIcon size={40} />
              </View>
              <Text style={styles.emptyStateTitle}>{t('dailylog.noSessionsToday')}</Text>
              <Text style={styles.emptyStateSubtext}>
                {t('dailylog.startMessage')}
              </Text>
            </View>
          ) : (
            <View style={styles.sessionsList}>
              {sessions
                .sort((a: any, b: any) => b.checkInTime - a.checkInTime)
                .map((session: any) => {
                  const checkin = new Date(session.checkInTime);
                  const checkout = session.checkOutTime ? new Date(session.checkOutTime) : null;
                  const duration = checkout
                    ? Math.floor((checkout.getTime() - checkin.getTime()) / 1000)
                    : Math.floor((Date.now() - checkin.getTime()) / 1000);

                  return (
                    <TouchableOpacity
                      key={session.sessionId}
                      style={styles.sessionCard}
                      activeOpacity={0.7}
                    >
                      {/* Session Header */}
                      <View style={styles.sessionHeader}>
                        <View style={styles.sessionHeaderLeft}>
                          <View style={[
                            styles.sessionStatusDot,
                            !session.checkOutTime && styles.sessionStatusDotActive
                          ]} />
                          <Text style={styles.sessionTime}>
                            {formatTimeReversed(checkin)}
                          </Text>
                        </View>
                        
                        <View style={[
                          styles.sessionStatusBadge,
                          !session.checkOutTime && styles.sessionStatusBadgeActive
                        ]}>
                          <Text style={[
                            styles.sessionStatusText,
                            !session.checkOutTime && styles.sessionStatusTextActive
                          ]}>
                            {session.checkOutTime ? t('dailylog.completed') : t('dailylog.active')}
                          </Text>
                        </View>
                      </View>

                      {/* Session Details */}
                      <View style={styles.sessionDetails}>
                        <View style={styles.sessionDetailRow}>
                          <Text style={styles.sessionDetailLabel}>{t('dailylog.checkIn')}:</Text>
                          <Text style={styles.sessionDetailValue}>
                            {formatTimeReversed(checkin)}
                          </Text>
                        </View>

                        <View style={styles.sessionDetailRow}>
                          <Text style={styles.sessionDetailLabel}>{t('dailylog.checkOut')}:</Text>
                          <Text style={styles.sessionDetailValue}>
                            {checkout ? formatTimeReversed(checkout) : '—'}
                          </Text>
                        </View>

                        <View style={styles.sessionDurationRow}>
                          <Text style={styles.sessionDurationLabel}>{t('dailylog.duration')}:</Text>
                          <Text style={[
                            styles.sessionDurationValue,
                            !session.checkOutTime && styles.sessionDurationValueActive
                          ]}>
                            {formatHoursMinutes(duration)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          )}
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
    paddingTop: spacing.huge,
    paddingBottom: 120, // Extra padding to ensure content is visible above tab bar
  },

  // ═══════════════════════════════════════════════════════════════
  // HEADER SECTION
  // ═══════════════════════════════════════════════════════════════
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
    ...shadows.neonGlowSubtle,
  },
  headerIconContainerRTL: {
    marginRight: 0,
    marginLeft: spacing.lg,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: fonts.sizes.hero,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // ═══════════════════════════════════════════════════════════════
  // STATS SECTION
  // ═══════════════════════════════════════════════════════════════
  statsContainer: {
    marginBottom: spacing.xxl,
  },
  mainStatCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderAccent,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.neonGlowSubtle,
  },
  mainStatGlow: {
    position: 'absolute',
    top: -50,
    width: 200,
    height: 100,
    backgroundColor: colors.primaryGlow,
    borderRadius: 100,
    opacity: 0.2,
  },
  mainStatIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  mainStatLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  mainStatValue: {
    fontSize: fonts.sizes.display,
    fontWeight: '900' as const,
    color: colors.primary,
    fontFamily: 'monospace',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.glass,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statIconActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  statIconSuccess: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
  },
  statLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  statValueInfo: {
    color: colors.info,
  },
  statValueSuccess: {
    color: colors.success,
  },

  // ═══════════════════════════════════════════════════════════════
  // CHART SECTION
  // ═══════════════════════════════════════════════════════════════
  chartSection: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  chartIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  chartIconContainerRTL: {
    marginRight: 0,
    marginLeft: spacing.md,
  },
  chartTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },

  // ═══════════════════════════════════════════════════════════════
  // SESSIONS SECTION
  // ═══════════════════════════════════════════════════════════════
  sessionsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sessionsList: {
    gap: spacing.md,
  },

  // Session Card
  sessionCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sessionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.textMuted,
    marginRight: spacing.md,
  },
  sessionStatusDotActive: {
    backgroundColor: colors.primary,
    ...shadows.neonGlowSubtle,
  },
  sessionTime: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  sessionStatusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.bgElevated,
  },
  sessionStatusBadgeActive: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
  },
  sessionStatusText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sessionStatusTextActive: {
    color: colors.primary,
  },

  // Session Details
  sessionDetails: {
    gap: spacing.sm,
  },
  sessionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionDetailLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
  sessionDetailValue: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  sessionDurationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  sessionDurationLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sessionDurationValue: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  sessionDurationValueActive: {
    color: colors.primary,
  },
});

export default DailyLogScreen;
