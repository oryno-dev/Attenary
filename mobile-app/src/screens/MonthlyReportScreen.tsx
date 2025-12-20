import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';
import { formatHoursMinutes, getDateString, getMonthString, formatTimeReversed } from '../utils/timeUtils';
import CircularProgressChart from '../components/CircularProgressChart';

const MonthlyReportScreen = () => {
  const { appData } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(getMonthString(new Date()));

  const monthlyData = useMemo(() => {
    const sessions = appData.sessions.filter((s: any) => {
      const sessionMonth = getMonthString(new Date(s.checkInTime));
      return sessionMonth === selectedMonth;
    });

    const days = new Map();
    let totalHours = 0;
    let totalSessions = sessions.length;

    sessions.forEach((session: any) => {
      const day = getDateString(session.checkInTime);
      const duration = session.checkOutTime
        ? Math.floor((session.checkOutTime - session.checkInTime) / 1000)
        : 0;
      
      totalHours += duration;
      
      if (!days.has(day)) {
        days.set(day, {
          date: day,
          sessions: [],
          totalDuration: 0
        });
      }
      
      const dayData = days.get(day);
      dayData.sessions.push({
        ...session,
        duration
      });
      dayData.totalDuration += duration;
    });

    return {
      days: Array.from(days.values()).sort((a, b) => a.date.localeCompare(b.date)),
      totalHours,
      totalSessions
    };
  }, [appData.sessions, selectedMonth]);

  // Calculate circular progress chart data
  const chartData = useMemo(() => {
    const totalHoursInSeconds = monthlyData.totalHours;
    const workingDaysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const standardWorkingHours = workingDaysInMonth * 8 * 3600; // 8 hours per working day
    
    const actualHours = totalHoursInSeconds / 3600; // Convert to hours
    const targetHours = Math.min(actualHours, standardWorkingHours);
    const targetPercentage = (actualHours / standardWorkingHours) * 100;
    const completedPercentage = Math.min(targetPercentage, 100);
    const remainingPercentage = Math.max(0, 100 - completedPercentage);
    const overtimePercentage = Math.max(0, targetPercentage - 100);

    return [
      {
        label: 'Completed',
        value: Math.round(completedPercentage),
        color: colors.primary
      },
      {
        label: 'Remaining',
        value: Math.round(remainingPercentage),
        color: colors.secondary
      },
      {
        label: 'Overtime',
        value: Math.round(overtimePercentage),
        color: colors.warning
      }
    ];
  }, [monthlyData.totalHours]);

  const months = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      months.push(getMonthString(date));
    }
    return months;
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Monthly Report</Text>

      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <Text style={styles.monthLabel}>Select Month:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.monthScroll}
        >
          {months.map((month) => (
            <TouchableOpacity
              key={month}
              style={[
                styles.monthButton,
                selectedMonth === month && styles.monthButtonActive
              ]}
              onPress={() => setSelectedMonth(month)}
            >
              <Text style={[
                styles.monthButtonText,
                selectedMonth === month && styles.monthButtonTextActive
              ]}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Sessions</Text>
          <Text style={styles.summaryValue}>{monthlyData.totalSessions}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Hours</Text>
          <Text style={styles.summaryValue}>{formatHoursMinutes(monthlyData.totalHours)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Active Days</Text>
          <Text style={styles.summaryValue}>{monthlyData.days.length}</Text>
        </View>
      </View>

      {/* Circular Progress Chart */}
      <CircularProgressChart
        data={chartData}
        centerLabel="Hours"
        centerValue={formatHoursMinutes(monthlyData.totalHours)}
        title={`${selectedMonth} Progress`}
      />

      {/* Daily Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Breakdown</Text>
        
        {monthlyData.days.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No sessions found for {selectedMonth}</Text>
            <Text style={styles.emptyStateSubtext}>Start checking in to see your monthly progress</Text>
          </View>
        ) : (
          monthlyData.days.map((day) => (
            <View key={day.date} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayDate}>{day.date}</Text>
                <Text style={styles.daySessions}>{day.sessions.length} sessions</Text>
              </View>
              <Text style={styles.dayTotal}>Total: {formatHoursMinutes(day.totalDuration)}</Text>
              
              <View style={styles.sessionList}>
                {day.sessions.map((session: any) => (
                  <View key={session.sessionId} style={styles.sessionItem}>
                    <Text style={styles.sessionTime}>
                      {formatTimeReversed(new Date(session.checkInTime))}
                    </Text>
                    <Text style={styles.sessionDuration}>
                      {formatHoursMinutes(session.duration)}
                    </Text>
                  </View>
                ))}
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
    paddingBottom: spacing.xxl + 100, // Extra padding for tab bar and scrolling
  },
  title: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  monthSelector: {
    marginBottom: spacing.xl,
  },
  monthLabel: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: fonts.weights.medium as any,
  },
  monthScroll: {
    maxHeight: 80,
  },
  monthButton: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  monthButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthButtonText: {
    color: colors.textPrimary,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium as any,
  },
  monthButtonTextActive: {
    color: colors.textPrimary,
    fontWeight: fonts.weights.bold as any,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.sm,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },

  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyState: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
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
  dayCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dayDate: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textPrimary,
  },
  daySessions: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
  dayTotal: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  sessionList: {
    gap: spacing.sm,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bgMain,
    borderRadius: borderRadius.md,
  },
  sessionTime: {
    fontSize: fonts.sizes.md,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium as any,
  },
  sessionDuration: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
});

export default MonthlyReportScreen;