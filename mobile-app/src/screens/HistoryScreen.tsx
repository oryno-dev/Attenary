import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fonts, shadows } from '../theme/colors';
import { formatTime, getDateString, formatTimeReversed } from '../utils/timeUtils';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// ═══════════════════════════════════════════════════════════════════
// FUTURISTIC 2026 GLASSMORPHISM ICONS
// ═══════════════════════════════════════════════════════════════════

const HistoryIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={colors.primary} strokeWidth="2" />
    <Path d="M12 7v5l3 3" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={colors.textMuted} strokeWidth="2" />
    <Path d="M21 21l-4.35-4.35" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ExportIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 17a8 8 0 1016 0" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const DeleteIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={colors.danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke={colors.textSecondary} strokeWidth="2" />
    <Path d="M3 10h18M8 2v4M16 2v4" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ClockIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={colors.textMuted} strokeWidth="2" />
    <Path d="M12 7v5l3 3" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HistoryScreen = () => {
  const { appData, deleteSession } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'checked-in' | 'checked-out'>('all');

  const filteredSessions = useMemo(() => {
    let sessions = [...appData.sessions];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sessions = sessions.filter((s: any) => {
        const date = new Date(s.checkInTime).toLocaleDateString();
        const duration = s.checkOutTime
          ? formatTime(Math.floor((s.checkOutTime - s.checkInTime) / 1000))
          : 'Active';
        return date.toLowerCase().includes(query) || duration.toLowerCase().includes(query);
      });
    }

    // Apply status filter
    if (filter === 'checked-in') {
      sessions = sessions.filter((s: any) => s.checkOutTime === null);
    } else if (filter === 'checked-out') {
      sessions = sessions.filter((s: any) => s.checkOutTime !== null);
    }

    // Sort by check-in time (newest first)
    return sessions.sort((a: any, b: any) => b.checkInTime - a.checkInTime);
  }, [appData.sessions, searchQuery, filter]);

  const handleDeleteSession = async (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteSession(sessionId);
            if (!success) {
              Alert.alert('Error', 'Failed to delete session. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleExportSession = (session: any) => {
    const exportData = {
      sessionId: session.sessionId,
      checkInTime: new Date(session.checkInTime).toISOString(),
      checkOutTime: session.checkOutTime ? new Date(session.checkOutTime).toISOString() : null,
      duration: session.checkOutTime
        ? formatTime(Math.floor((session.checkOutTime - session.checkInTime) / 1000))
        : 'Active',
      reason: session.reason
    };

    Alert.alert(
      'Session Details',
      `Session ID: ${exportData.sessionId}\nCheck-in: ${exportData.checkInTime}\nCheck-out: ${exportData.checkOutTime || 'Not checked out'}\nDuration: ${exportData.duration}`,
      [{ text: 'OK' }]
    );
  };

  const totalCheckedIn = appData.sessions.filter((s: any) => s.checkOutTime === null).length;
  const totalCheckedOut = appData.sessions.filter((s: any) => s.checkOutTime !== null).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════════════════════════════════════════════════════════
            HEADER SECTION
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.headerSection}>
          <View style={styles.headerIconContainer}>
            <HistoryIcon size={28} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>History</Text>
            <Text style={styles.subtitle}>Your session records</Text>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            SEARCH BAR - Glass Input
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <SearchIcon size={20} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by date or duration..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* ═══════════════════════════════════════════════════════════
            FILTER BUTTONS - Glass Pills
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
              All ({appData.sessions.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filter === 'checked-in' && styles.filterButtonActive]}
            onPress={() => setFilter('checked-in')}
            activeOpacity={0.8}
          >
            <View style={styles.filterDotActive} />
            <Text style={[styles.filterButtonText, filter === 'checked-in' && styles.filterButtonTextActive]}>
              Active ({totalCheckedIn})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filter === 'checked-out' && styles.filterButtonActive]}
            onPress={() => setFilter('checked-out')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterButtonText, filter === 'checked-out' && styles.filterButtonTextActive]}>
              Done ({totalCheckedOut})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            SUMMARY - Glass Card
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            Showing <Text style={styles.summaryHighlight}>{filteredSessions.length}</Text> of{' '}
            <Text style={styles.summaryHighlight}>{appData.sessions.length}</Text> sessions
          </Text>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            SESSIONS LIST - Glass Cards
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.sessionsContainer}>
          {filteredSessions.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <HistoryIcon size={40} />
              </View>
              <Text style={styles.emptyStateTitle}>No sessions found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start checking in to see your session history'}
              </Text>
            </View>
          ) : (
            filteredSessions.map((session: any) => {
              const duration = session.checkOutTime
                ? Math.floor((session.checkOutTime - session.checkInTime) / 1000)
                : Date.now() - session.checkInTime;
              
              return (
                <View key={session.sessionId} style={styles.sessionCard}>
                  {/* Session Header */}
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionHeaderLeft}>
                      <View style={[
                        styles.sessionStatusDot,
                        session.checkOutTime === null && styles.sessionStatusDotActive
                      ]} />
                      <View>
                        <Text style={styles.sessionDate}>
                          {new Date(session.checkInTime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Text>
                        <Text style={styles.sessionYear}>
                          {new Date(session.checkInTime).getFullYear()}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={[
                      styles.sessionStatusBadge,
                      session.checkOutTime === null && styles.sessionStatusBadgeActive
                    ]}>
                      <Text style={[
                        styles.sessionStatusText,
                        session.checkOutTime === null && styles.sessionStatusTextActive
                      ]}>
                        {session.checkOutTime === null ? 'Active' : 'Completed'}
                      </Text>
                    </View>
                  </View>

                  {/* Session Times */}
                  <View style={styles.sessionTimesContainer}>
                    <View style={styles.sessionTimeRow}>
                      <ClockIcon size={14} />
                      <Text style={styles.sessionTimeLabel}>Check In:</Text>
                      <Text style={styles.sessionTimeValue}>
                        {formatTimeReversed(new Date(session.checkInTime))}
                      </Text>
                    </View>
                    
                    <View style={styles.sessionTimeRow}>
                      <ClockIcon size={14} />
                      <Text style={styles.sessionTimeLabel}>Check Out:</Text>
                      <Text style={styles.sessionTimeValue}>
                        {session.checkOutTime
                          ? formatTimeReversed(new Date(session.checkOutTime))
                          : '—'
                        }
                      </Text>
                    </View>
                  </View>

                  {/* Session Duration */}
                  <View style={styles.sessionDurationContainer}>
                    <Text style={styles.sessionDurationLabel}>Duration</Text>
                    <Text style={[
                      styles.sessionDurationValue,
                      session.checkOutTime === null && styles.sessionDurationValueActive
                    ]}>
                      {formatTime(Math.floor(duration / 1000))}
                    </Text>
                  </View>

                  {/* Session Reason */}
                  {session.reason && (
                    <View style={styles.sessionReasonContainer}>
                      <Text style={styles.sessionReasonText}>
                        {session.reason}
                      </Text>
                    </View>
                  )}

                  {/* Session Actions */}
                  <View style={styles.sessionActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleExportSession(session)}
                      activeOpacity={0.7}
                    >
                      <ExportIcon size={16} />
                      <Text style={styles.actionButtonText}>Export</Text>
                    </TouchableOpacity>
                    
                    {session.checkOutTime !== null && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonDanger]}
                        onPress={() => handleDeleteSession(session.sessionId)}
                        activeOpacity={0.7}
                      >
                        <DeleteIcon size={16} />
                        <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
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
  // SEARCH SECTION
  // ═══════════════════════════════════════════════════════════════
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.glass,
  },
  searchIconContainer: {
    marginRight: spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.lg,
    color: colors.textPrimary,
    fontSize: fonts.sizes.md,
  },

  // ═══════════════════════════════════════════════════════════════
  // FILTER SECTION
  // ═══════════════════════════════════════════════════════════════
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.sm,
    fontWeight: '500' as const,
  },
  filterButtonTextActive: {
    color: colors.bgMain,
    fontWeight: '700' as const,
  },
  filterDotActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  // ═══════════════════════════════════════════════════════════════
  // SUMMARY SECTION
  // ═══════════════════════════════════════════════════════════════
  summaryCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  summaryHighlight: {
    color: colors.primary,
    fontWeight: '700' as const,
  },

  // ═══════════════════════════════════════════════════════════════
  // SESSIONS LIST
  // ═══════════════════════════════════════════════════════════════
  sessionsContainer: {
    gap: spacing.md,
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

  // ═══════════════════════════════════════════════════════════════
  // SESSION CARD
  // ═══════════════════════════════════════════════════════════════
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
  sessionDate: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  sessionYear: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
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

  // Session Times
  sessionTimesContainer: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sessionTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sessionTimeLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    flex: 1,
  },
  sessionTimeValue: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },

  // Session Duration
  sessionDurationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sessionDurationLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sessionDurationValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  sessionDurationValueActive: {
    color: colors.primary,
  },

  // Session Reason
  sessionReasonContainer: {
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sessionReasonText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  // Session Actions
  sessionActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.button,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonDanger: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderColor: 'rgba(255, 51, 102, 0.3)',
  },
  actionButtonText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  actionButtonTextDanger: {
    color: colors.danger,
  },
});

export default HistoryScreen;
