import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';

interface StatItem {
  label: string;
  hours: number;
  minutes: number;
  color: string;
  backgroundColor: string;
}

interface CompactTimeStatsProps {
  stats: StatItem[];
}

const CompactTimeStats: React.FC<CompactTimeStatsProps> = ({ stats }) => {
  const formatTime = (hours: number, minutes: number) => {
    const h = hours.toString();
    const m = minutes.toString().padStart(2, '0');
    return { hours: h, minutes: m };
  };

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => {
        const time = formatTime(stat.hours, stat.minutes);
        return (
          <View key={index} style={styles.statCard}>
            {/* Status indicator and label */}
            <View style={styles.headerRow}>
              <View style={[styles.statusDot, { backgroundColor: stat.backgroundColor }]}>
                <Text style={[styles.statusIcon, { color: stat.color }]}>●</Text>
              </View>
              <Text style={styles.label}>{stat.label}</Text>
            </View>
            
            {/* Time display */}
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>
                {time.hours} <Text style={styles.timeUnit}>h</Text>
              </Text>
              <Text style={styles.timeText}>
                {time.minutes} <Text style={styles.timeUnit}>m</Text>
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '36%', // Moved higher from 38% to 36% (approximately 5px higher)
    left: '0%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    zIndex: 999, // Very high z-index for absolute positioning
    elevation: 20, // High Android elevation
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 85,
    minWidth: 85,
    zIndex: 999, // Ensure cards stay above
    elevation: 20, // High Android elevation
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  statusIcon: {
    fontSize: 9,
    lineHeight: 9,
  },
  label: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    fontWeight: fonts.weights.medium as any,
    letterSpacing: 0.02,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  timeText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  timeUnit: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontWeight: fonts.weights.normal as any,
  },
});

export default CompactTimeStats;