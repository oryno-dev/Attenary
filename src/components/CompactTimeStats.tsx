import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fonts, shadows } from '../theme/colors';
import Svg, { Circle, Path } from 'react-native-svg';

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

// Status Icons
const CheckIcon = ({ color }: { color: string }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M8 12l3 3 5-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon = ({ color }: { color: string }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AlertIcon = ({ color }: { color: string }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CompactTimeStats: React.FC<CompactTimeStatsProps> = ({ stats }) => {
  const formatTime = (hours: number, minutes: number) => {
    const h = hours.toString();
    const m = minutes.toString().padStart(2, '0');
    return { hours: h, minutes: m };
  };

  const getIcon = (label: string, color: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('completed') || lowerLabel.includes('done')) {
      return <CheckIcon color={color} />;
    } else if (lowerLabel.includes('remaining') || lowerLabel.includes('left')) {
      return <ClockIcon color={color} />;
    } else if (lowerLabel.includes('overtime') || lowerLabel.includes('extra')) {
      return <AlertIcon color={color} />;
    }
    return <ClockIcon color={color} />;
  };

  const getCardStyle = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('completed') || lowerLabel.includes('done')) {
      return styles.statCardCompleted;
    } else if (lowerLabel.includes('overtime') || lowerLabel.includes('extra')) {
      return styles.statCardOvertime;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => {
        const time = formatTime(stat.hours, stat.minutes);
        const cardStyle = getCardStyle(stat.label);
        
        return (
          <View 
            key={index} 
            style={[
              styles.statCard, 
              cardStyle,
              { borderColor: stat.color + '40' }
            ]}
          >
            {/* Status indicator and label */}
            <View style={styles.headerRow}>
              <View style={[styles.statusDot, { backgroundColor: stat.color + '30' }]}>
                {getIcon(stat.label, stat.color)}
              </View>
              <Text style={[styles.label, { color: stat.color }]}>
                {stat.label}
              </Text>
            </View>
            
            {/* Time display */}
            <View style={styles.timeRow}>
              <Text style={[styles.timeText, { color: stat.color }]}>
                {time.hours}
              </Text>
              <Text style={[styles.timeUnit, { color: stat.color + '80' }]}>h</Text>
              <Text style={[styles.timeText, { color: stat.color }]}>
                {time.minutes}
              </Text>
              <Text style={[styles.timeUnit, { color: stat.color + '80' }]}>m</Text>
            </View>

            {/* Progress indicator line */}
            <View style={styles.progressLineContainer}>
              <View style={[styles.progressLine, { backgroundColor: stat.color + '30' }]}>
                <View style={[styles.progressLineFill, { backgroundColor: stat.color }]} />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 95,
    ...shadows.glass,
  },
  statCardCompleted: {
    backgroundColor: 'rgba(0, 255, 136, 0.08)',
    borderWidth: 1.5,
  },
  statCardOvertime: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  statusDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  timeText: {
    fontSize: fonts.sizes.lg,
    fontWeight: '800' as const,
    fontFamily: 'monospace',
  },
  timeUnit: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600' as const,
    marginRight: spacing.xs,
  },
  progressLineContainer: {
    width: '100%',
    marginTop: spacing.sm,
  },
  progressLine: {
    height: 3,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressLineFill: {
    height: '100%',
    width: '70%',
    borderRadius: 2,
  },
});

export default CompactTimeStats;
