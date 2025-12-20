import React, { useState, useEffect } from 'react';
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
import { formatHoursMinutes, getTodayString, getDateString } from '../utils/timeUtils';

const DailyLogScreen = ({ navigation }: any) => {
  const { appData, unlocked } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const today = getTodayString();
  const sessions = appData.sessions.filter((s: any) => getDateString(s.checkInTime) === today);

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Today's Sessions</Text>

      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
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
                  <Text style={styles.sessionName} numberOfLines={1}>
                    {maskData(appData.employeeName || 'Employee')}
                  </Text>
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
                      {maskData(
                        checkin.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                      )}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Check Out:</Text>
                    <Text style={styles.detailValue}>
                      {maskData(
                        checkout
                          ? checkout.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })
                          : '—'
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