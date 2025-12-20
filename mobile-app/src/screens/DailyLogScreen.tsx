import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';
import { formatHoursMinutes, getTodayString, getDateString, formatTimeReversed } from '../utils/timeUtils';
import BarChartComponent from '../components/BarChartComponent';

// SVG Icons
const DocumentIcon = ({ color = '#94a3b8', size = 64 }) => (
  <View style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M4 4h7l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path d="M10 9h4M10 13h4M10 17h2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </View>
);

const DailyLogScreen = ({ navigation }: any) => {
  const { appData, unlocked } = useApp();
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

  const maskData = (data: any) => {
    return unlocked ? data : '***';
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleEmployeePress = () => {
    if (!unlocked) {
      navigation.navigate('PINModal');
    }
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Today's Sessions</Text>

      {/* Today's Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Sessions</Text>
          <Text style={styles.statValue}>{todayStats.totalSessions}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active</Text>
          <Text style={styles.statValue}>{todayStats.activeSessions}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{todayStats.completedSessions}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Hours</Text>
          <Text style={styles.statValue}>{formatHoursMinutes(todayStats.totalDuration)}</Text>
        </View>
      </View>

      {/* Bar Chart for hourly activity */}
      {sessions.length > 0 && (
        <BarChartComponent
          data={hourlyData}
          title="Hourly Activity (12-Hour Format)"
          yAxisLabel=""
          yAxisSuffix=" sessions"
          showValuesOnTopOfBars={true}
          use12HourFormat={true}
          showAllLabels={true}
        />
      )}

      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <DocumentIcon color="#94a3b8" size={64} />
          <Text style={styles.emptyTitle}>No sessions recorded today</Text>
          <Text style={styles.emptySubtitle}>
            Check in to start tracking your attendance
          </Text>
        </View>
      ) : (
        sessions
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
                onPress={handleEmployeePress}
                activeOpacity={0.7}
              >
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionNameContainer}>
                    <Text style={styles.sessionName}>Session</Text>
                    <Text style={styles.sessionDate}>
                      {new Date(session.checkInTime).toLocaleDateString()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      session.checkOutTime ? styles.statusCompleted : styles.statusActive,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {session.checkOutTime ? 'Completed' : 'Active'}
                    </Text>
                  </View>
                </View>

                <View style={styles.sessionDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Check In:</Text>
                    <Text style={styles.detailValue}>
                      {maskData(formatTimeReversed(checkin))}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Check Out:</Text>
                    <Text style={styles.detailValue}>
                      {maskData(
                        checkout ? formatTimeReversed(checkout) : '—'
                      )}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.durationValue}>
                      {maskData(formatHoursMinutes(duration))}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
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
  title: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
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
    padding: spacing.md,
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
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sessionCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sessionName: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  sessionNameContainer: {
    flex: 1,
  },
  sessionDate: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    minWidth: 80,
    alignItems: 'center',
  },
  statusActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: colors.success,
  },
  statusCompleted: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: colors.info,
  },
  statusText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textPrimary,
  },
  sessionDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontWeight: fonts.weights.medium as any,
  },
  detailValue: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    fontWeight: fonts.weights.semibold as any,
  },
  durationValue: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
});

export default DailyLogScreen;