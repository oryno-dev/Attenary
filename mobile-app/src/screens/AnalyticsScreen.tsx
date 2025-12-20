import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';
import { formatHoursMinutes, getDateString, formatTimeReversed } from '../utils/timeUtils';

const { width } = Dimensions.get('window');

const AnalyticsScreen = () => {
  const { appData } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSessions = appData.sessions.length;
    const activeSessions = appData.sessions.filter((s: any) => s.checkOutTime === null).length;
    const completedSessions = totalSessions - activeSessions;

    let totalDuration = 0;
    appData.sessions.forEach((session: any) => {
      if (session.checkOutTime) {
        totalDuration += session.checkOutTime - session.checkInTime;
      }
    });

    const avgSessionDuration = completedSessions > 0 
      ? totalDuration / completedSessions 
      : 0;

    // Calculate streaks
    const daysWithActivity = new Set(
      appData.sessions.map((s: any) => getDateString(s.checkInTime))
    );
    
    return {
      totalSessions,
      activeSessions,
      completedSessions,
      totalDuration: Math.floor(totalDuration / 1000),
      avgSessionDuration: Math.floor(avgSessionDuration / 1000),
      activeDays: daysWithActivity.size,
    };
  }, [appData.sessions]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Analytics</Text>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Sessions</Text>
          <Text style={styles.statValue}>{stats.totalSessions}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Sessions</Text>
          <Text style={styles.statValue}>{stats.activeSessions}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{stats.completedSessions}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Hours</Text>
          <Text style={styles.statValue}>{formatHoursMinutes(stats.totalDuration)}</Text>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['week', 'month', 'year'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.periodButtonTextActive
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Additional Analytics Cards */}
      <View style={styles.analyticsCards}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsLabel}>Average Session</Text>
          <Text style={styles.analyticsValue}>{formatHoursMinutes(stats.avgSessionDuration)}</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsLabel}>Active Days</Text>
          <Text style={styles.analyticsValue}>{stats.activeDays}</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        {appData.sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No sessions recorded yet</Text>
            <Text style={styles.emptyStateSubtext}>Start checking in to see your analytics</Text>
          </View>
        ) : (
          appData.sessions.slice(-5).reverse().map((session: any) => (
            <View key={session.sessionId} style={styles.recentItem}>
              <View style={styles.recentLeft}>
                <Text style={styles.recentDate}>
                  {new Date(session.checkInTime).toLocaleDateString()}
                </Text>
                <Text style={styles.recentTime}>
                  {formatTimeReversed(new Date(session.checkInTime))}
                </Text>
              </View>
              <View style={styles.recentRight}>
                <Text style={styles.recentDuration}>
                  {session.checkOutTime 
                    ? formatHoursMinutes(Math.floor((session.checkOutTime - session.checkInTime) / 1000))
                    : 'Active'
                  }
                </Text>
                <Text style={[
                  styles.recentStatus,
                  session.checkOutTime === null && styles.recentStatusActive
                ]}>
                  {session.checkOutTime === null ? 'Checked In' : 'Checked Out'}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
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
  title: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  periodButton: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    color: colors.textPrimary,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium as any,
  },
  periodButtonTextActive: {
    fontWeight: fonts.weights.bold as any,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  analyticsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  analyticsLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  analyticsValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  recentContainer: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentLeft: {
    flex: 1,
  },
  recentDate: {
    fontSize: fonts.sizes.md,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium as any,
  },
  recentTime: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
  recentRight: {
    alignItems: 'flex-end',
  },
  recentDuration: {
    fontSize: fonts.sizes.md,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium as any,
    fontFamily: 'monospace',
  },
  recentStatus: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  recentStatusActive: {
    color: colors.success,
    fontWeight: fonts.weights.bold as any,
  },
});

export default AnalyticsScreen;