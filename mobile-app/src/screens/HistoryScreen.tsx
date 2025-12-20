import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';
import { formatTime, getDateString, formatTimeReversed } from '../utils/timeUtils';

// SVG Icons
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

const DeleteIcon = ({ color = '#94a3b8', size = 20 }) => (
  <View style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M10 11v6M14 11v6" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </View>
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>History</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by date or duration..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
            All ({appData.sessions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'checked-in' && styles.filterButtonActive]}
          onPress={() => setFilter('checked-in')}
        >
          <Text style={[styles.filterButtonText, filter === 'checked-in' && styles.filterButtonTextActive]}>
            Checked In ({totalCheckedIn})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'checked-out' && styles.filterButtonActive]}
          onPress={() => setFilter('checked-out')}
        >
          <Text style={[styles.filterButtonText, filter === 'checked-out' && styles.filterButtonTextActive]}>
            Checked Out ({totalCheckedOut})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Showing {filteredSessions.length} of {appData.sessions.length} sessions
        </Text>
      </View>

      {/* Sessions List */}
      <View style={styles.sessionsContainer}>
        {filteredSessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No sessions found</Text>
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
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionDate}>
                    {new Date(session.checkInTime).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Text>
                  <Text style={[
                    styles.sessionStatus,
                    session.checkOutTime === null && styles.sessionStatusActive
                  ]}>
                    {session.checkOutTime === null ? 'Active' : 'Completed'}
                  </Text>
                </View>
                
                <View style={styles.sessionTimes}>
                  <Text style={styles.sessionTime}>
                    Check-in: {formatTimeReversed(new Date(session.checkInTime))}
                  </Text>
                  <Text style={styles.sessionTime}>
                    {session.checkOutTime
                      ? `Check-out: ${formatTimeReversed(new Date(session.checkOutTime))}`
                      : 'Still checked in'
                    }
                  </Text>
                </View>

                <View style={styles.sessionDuration}>
                  <Text style={styles.sessionDurationText}>
                    Duration: {formatTime(Math.floor(duration / 1000))}
                  </Text>
                </View>

                {session.reason && (
                  <View style={styles.sessionReason}>
                    <Text style={styles.sessionReasonText}>
                      Reason: {session.reason}
                    </Text>
                  </View>
                )}

                <View style={styles.sessionActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleExportSession(session)}
                  >
                    <ExportIcon color="#94a3b8" size={20} />
                    <Text style={styles.actionButtonText}>Export</Text>
                  </TouchableOpacity>
                  {session.checkOutTime !== null && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteSession(session.sessionId)}
                    >
                      <DeleteIcon color="#94a3b8" size={20} />
                      <Text style={styles.actionButtonText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
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
    marginBottom: spacing.lg,
  },
  searchContainer: {
    marginBottom: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: fonts.sizes.md,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    color: colors.textPrimary,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium as any,
  },
  filterButtonTextActive: {
    fontWeight: fonts.weights.bold as any,
  },
  summaryContainer: {
    marginBottom: spacing.lg,
  },
  summaryText: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.md,
  },
  sessionsContainer: {
    gap: spacing.md,
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
  sessionCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sessionDate: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textPrimary,
  },
  sessionStatus: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontWeight: fonts.weights.medium as any,
  },
  sessionStatusActive: {
    color: colors.success,
    fontWeight: fonts.weights.bold as any,
  },
  sessionTimes: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  sessionTime: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  sessionDuration: {
    marginBottom: spacing.sm,
  },
  sessionDurationText: {
    fontSize: fonts.sizes.md,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium as any,
  },
  sessionReason: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.bgMain,
    borderRadius: borderRadius.md,
  },
  sessionReasonText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.bgMain,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  actionButtonText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium as any,
    color: colors.textPrimary,
  },
});

export default HistoryScreen;