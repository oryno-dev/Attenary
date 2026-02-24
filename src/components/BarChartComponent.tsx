import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors, spacing, fonts, borderRadius } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

interface BarChartComponentProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  title?: string;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  showValuesOnTopOfBars?: boolean;
  width?: number;
  height?: number;
  showAllLabels?: boolean;
  use12HourFormat?: boolean;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  title,
  yAxisLabel = '',
  yAxisSuffix = '',
  showValuesOnTopOfBars = true,
  width,
  height = 240,
  showAllLabels = false,
  use12HourFormat = false
}) => {
  // Convert to 12-hour format if requested
  const formatTimeLabel = (label: string) => {
    if (!use12HourFormat) return label;
    
    const hour = parseInt(label.split(':')[0]);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${displayHour}${ampm}`;
  };

  // Add visual separator between AM and PM
  const formatTimeLabelWithSeparator = (label: string, index: number) => {
    if (!use12HourFormat) return label;
    
    const hour = parseInt(label.split(':')[0]);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    
    // Add extra space before PM section (at hour 12)
    if (hour === 12) {
      return ` ${displayHour}${ampm}`; // Leading space for PM section
    }
    
    return `${displayHour}${ampm}`;
  };

  // Filter labels to show every 3rd or 4th hour for better readability
  // Insert empty columns between AM and PM sections for visual separation
  const insertSeparator = (labels: string[], data: number[]) => {
    const amLabels = labels.slice(0, 12); // 12AM to 11AM
    const pmLabels = labels.slice(12);    // 12PM to 11PM
    const amData = data.slice(0, 12);
    const pmData = data.slice(12);
    
    return {
      labels: [...amLabels, '', ...pmLabels], // Empty string creates visual gap
      data: [...amData, 0, ...pmData]        // 0 height bar creates gap
    };
  };
  
  const processedData = insertSeparator(data.labels, data.datasets[0].data);
  
  const filteredData = {
    datasets: [{ data: processedData.data }],
    labels: showAllLabels 
      ? processedData.labels.map((label, index) => formatTimeLabelWithSeparator(label, index))
      : processedData.labels.map((label, index) => {
          // Show labels at 0, 6, 12, 18 hours (every 6 hours)
          const hour = parseInt(label.split(':')[0]) || 0;
          if (hour % 6 === 0 && label !== '') {
            return formatTimeLabelWithSeparator(label, index);
          }
          return label; // Keep empty strings for separator
        }),
  };

  // Calculate dynamic width accounting for the separator column
  const chartWidth = width || Math.max(
    screenWidth * 1.5, 
    (data.labels.length + 1) * 25 + 50 // +1 for separator column, +50 for extra space
  );

  const chartConfig = {
    backgroundGradientFrom: colors.bgCard,
    backgroundGradientTo: colors.bgCard,
    backgroundGradientFromOpacity: 1,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(19, 236, 91, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(241, 245, 249, ${opacity * 0.8})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    decimalPlaces: 0,
    fromZero: true,
    fillShadowGradient: colors.primary,
    fillShadowGradientOpacity: 0.8,
    fillShadowGradientFrom: colors.primary,
    fillShadowGradientTo: colors.primary,
    propsForBackgroundLines: {
      stroke: colors.border,
      strokeDasharray: '4, 4',
      strokeWidth: 1,
      strokeOpacity: 0.5,
    },
    propsForLabels: {
      fontSize: fonts.sizes.xs,
      fontFamily: 'monospace',
    },
  };

  // Calculate if we have any activity
  const hasActivity = data.datasets[0]?.data.some(val => val > 0);
  const maxValue = Math.max(...(data.datasets[0]?.data || [0]));
  const totalSessions = data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0;

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
          {hasActivity && (
            <View style={styles.statsContainer}>
              <View style={styles.statBadge}>
                <Text style={styles.statValue}>{totalSessions}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statValue}>{maxValue}</Text>
                <Text style={styles.statLabel}>Peak</Text>
              </View>
            </View>
          )}
        </View>
      )}
      
      {!hasActivity ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>No activity recorded today</Text>
          <Text style={styles.emptySubtext}>Check in to start tracking</Text>
        </View>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
          snapToAlignment="start"
          decelerationRate="fast"
          pagingEnabled={false}
        >
          <View style={styles.chartWrapper}>
            <BarChart
              data={filteredData}
              width={chartWidth}
              height={height}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              fromZero={true}
              showValuesOnTopOfBars={showValuesOnTopOfBars}
              yAxisLabel={yAxisLabel}
              yAxisSuffix={yAxisSuffix}
              style={styles.chartStyle}
              withInnerLines={true}
              showBarTops={true}
              flatColor={false}
              withHorizontalLabels={true}
              segments={4}
            />
          </View>
        </ScrollView>
      )}
      
      {hasActivity && (
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Sessions per hour</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBadge: {
    backgroundColor: colors.bgCard,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minWidth: 50,
  },
  statValue: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold as any,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingRight: spacing.md,
    paddingLeft: spacing.md,
  },
  chartWrapper: {
    alignItems: 'center',
    marginLeft: -spacing.md,
  },
  chartStyle: {
    borderRadius: borderRadius.lg,
    paddingRight: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium as any,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
});

export default BarChartComponent;
