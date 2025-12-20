import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { colors, spacing, fonts, borderRadius } from '../theme/colors';

interface ProgressDonationTrackerProps {
  title: string;
  targetAmount: number;
  currentAmount: number;
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  centerLabel?: string;
  showAnimation?: boolean;
  interactive?: boolean;
  onSegmentPress?: (index: number, item: any) => void;
  currency?: string;
}

type TabType = 'overview' | 'timeline' | 'breakdown';

const ProgressDonationTracker: React.FC<ProgressDonationTrackerProps> = ({
  title,
  targetAmount,
  currentAmount,
  data,
  centerLabel = 'Progress',
  showAnimation = true,
  interactive = true,
  onSegmentPress,
  currency = '$'
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [animatedValues] = useState([
    new Animated.Value(0), // Progress animation
    new Animated.Value(0), // Bar chart animation
    new Animated.Value(0), // Tab animation
  ]);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  // Calculate progress metrics
  const progressPercentage = Math.min((currentAmount / targetAmount) * 100, 100);
  const remainingAmount = Math.max(targetAmount - currentAmount, 0);
  const overtimeAmount = Math.max(currentAmount - targetAmount, 0);
  const isComplete = currentAmount >= targetAmount;

  // Enhanced data for pie chart
  const pieChartData = [
    {
      name: 'Completed',
      population: progressPercentage,
      color: colors.primary,
      legendFontColor: colors.textSecondary,
      legendFontSize: fonts.sizes.sm,
    },
    {
      name: 'Remaining',
      population: isComplete ? 0 : 100 - progressPercentage,
      color: colors.secondary,
      legendFontColor: colors.textSecondary,
      legendFontSize: fonts.sizes.sm,
    },
    {
      name: 'Overtime',
      population: overtimeAmount > 0 ? (overtimeAmount / targetAmount) * 100 : 0,
      color: colors.warning,
      legendFontColor: colors.textSecondary,
      legendFontSize: fonts.sizes.sm,
    },
  ].filter(item => item.population > 0);

  // Modern chart configuration with enhanced styling
  const chartConfig = {
    backgroundGradientFrom: colors.bgCard,
    backgroundGradientTo: colors.bgCard,
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
      strokeOpacity: 0.3,
    },
    propsForLabels: {
      fontSize: fonts.sizes.xs,
      fontFamily: 'monospace',
    },
  };

  // Enhanced animation system with tab transitions
  useEffect(() => {
    if (showAnimation) {
      Animated.parallel([
        Animated.timing(animatedValues[0], {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValues[1], {
          toValue: 1,
          duration: 1000,
          delay: 500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValues[2], {
          toValue: 1,
          duration: 800,
          delay: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      animatedValues.forEach(value => value.setValue(1));
    }
  }, [showAnimation]);

  const handleSegmentPress = (index: number, item: any) => {
    if (!interactive) return;
    
    setPressedIndex(index);
    setTimeout(() => setPressedIndex(null), 200);
    
    if (onSegmentPress) {
      onSegmentPress(index, item);
    }
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    // Add subtle animation feedback
    Animated.sequence([
      Animated.timing(animatedValues[2], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues[2], {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const getProgressStatus = () => {
    if (isComplete) return { status: 'Goal Achieved!', color: colors.success, icon: '🎉' };
    if (progressPercentage >= 75) return { status: 'Almost There', color: colors.primary, icon: '🚀' };
    if (progressPercentage >= 50) return { status: 'Halfway There', color: colors.warning, icon: '💪' };
    if (progressPercentage >= 25) return { status: 'Getting Started', color: colors.info, icon: '🌱' };
    return { status: 'Just Beginning', color: colors.textMuted, icon: '🌅' };
  };

  const progressStatus = getProgressStatus();
  const filteredData = {
    ...data,
    labels: data.labels.map((label, index) => {
      const hour = parseInt(label.split(':')[0]);
      return (hour % 6 === 0) ? label : '';
    }),
  };

  // Tab configuration
  const tabs = [
    { key: 'overview' as TabType, label: 'Overview', icon: '🎯', color: colors.primary },
    { key: 'timeline' as TabType, label: 'Timeline', icon: '📈', color: colors.info },
    { key: 'breakdown' as TabType, label: 'Breakdown', icon: '📊', color: colors.warning },
  ];

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <View style={styles.overviewCard}>
              <View style={styles.circularProgressContainer}>
                <PieChart
                  data={pieChartData}
                  width={220}
                  height={160}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  center={[50, 10]}
                  absolute={false}
                />
                
                <View style={styles.centerOverlay}>
                  <Text style={styles.centerValue}>
                    {currency}{Math.round(currentAmount).toLocaleString()}
                  </Text>
                  <Text style={styles.centerLabel}>{centerLabel}</Text>
                  <Text style={styles.progressPercent}>
                    {Math.round(progressPercentage)}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {currency}{Math.round(targetAmount).toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>Target</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {currency}{Math.round(remainingAmount).toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>Remaining</Text>
                </View>
                {overtimeAmount > 0 && (
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {currency}{Math.round(overtimeAmount).toLocaleString()}
                    </Text>
                    <Text style={styles.statLabel}>Over Target</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        );

      case 'timeline':
        return (
          <View style={styles.tabContent}>
            <View style={styles.timelineCard}>
              <View style={styles.progressBarBackground}>
                <Animated.View 
                  style={[
                    styles.progressBarFill,
                    {
                      width: animatedValues[0].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', `${Math.min(progressPercentage, 100)}%`],
                      }),
                      backgroundColor: progressStatus.color,
                    }
                  ]}
                />
              </View>
              <View style={styles.progressBarLabels}>
                <Text style={styles.progressStartLabel}>0%</Text>
                <Text style={styles.progressEndLabel}>100%</Text>
              </View>
              
              <View style={styles.milestoneContainer}>
                <View style={styles.milestone}>
                  <View style={[styles.milestoneDot, { backgroundColor: colors.primary }]} />
                  <Text style={styles.milestoneText}>Start</Text>
                </View>
                <View style={styles.milestone}>
                  <View style={[styles.milestoneDot, { backgroundColor: colors.warning }]} />
                  <Text style={styles.milestoneText}>50%</Text>
                </View>
                <View style={styles.milestone}>
                  <View style={[styles.milestoneDot, { backgroundColor: progressStatus.color }]} />
                  <Text style={styles.milestoneText}>Current</Text>
                </View>
                <View style={styles.milestone}>
                  <View style={[styles.milestoneDot, { backgroundColor: colors.success }]} />
                  <Text style={styles.milestoneText}>Goal</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 'breakdown':
        return (
          <View style={styles.tabContent}>
            <View style={styles.breakdownCard}>
              {data.datasets[0]?.data.some(val => val > 0) ? (
                <BarChart
                  data={filteredData}
                  width={350}
                  height={220}
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  fromZero={true}
                  showValuesOnTopOfBars={true}
                  yAxisLabel=""
                  yAxisSuffix=""
                  style={styles.barChartStyle}
                  withInnerLines={true}
                  showBarTops={true}
                  flatColor={false}
                  withHorizontalLabels={true}
                  segments={4}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📊</Text>
                  <Text style={styles.emptyText}>No activity recorded yet</Text>
                  <Text style={styles.emptySubtext}>Start contributing to see breakdown</Text>
                </View>
              )}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusIcon}>{progressStatus.icon}</Text>
            <Text style={[styles.statusText, { color: progressStatus.color }]}>
              {progressStatus.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Modern Tab Navigation */}
      <View style={styles.tabContainer}>
        <Animated.View 
          style={[
            styles.tabNavigation,
            {
              transform: [{ scale: animatedValues[2] }]
            }
          ]}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  isActive && { backgroundColor: tab.color }
                ]}
                onPress={() => handleTabPress(tab.key)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.tabIcon,
                  isActive && { color: colors.bgMain }
                ]}>
                  {tab.icon}
                </Text>
                <Text style={[
                  styles.tabLabel,
                  isActive && { color: colors.bgMain, fontWeight: fonts.weights.bold as any }
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>

      {/* Tab Content with Smooth Transitions */}
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: animatedValues[1].interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            })
          }
        ]}
      >
        {renderTabContent()}
      </Animated.View>

      {/* Interactive Legend */}
      {activeTab === 'overview' && pieChartData.length > 0 && (
        <View style={styles.legendSection}>
          <Text style={styles.legendTitle}>Progress Categories</Text>
          <View style={styles.legend}>
            {pieChartData.map((item, index) => {
              const animatedScale = animatedValues[1].interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              });
              
              const isPressed = pressedIndex === index;
              
              return (
                <Animated.View 
                  key={`legend-${index}`} 
                  style={[
                    styles.legendItem,
                    { transform: [{ scale: animatedScale }] }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.legendContent}
                    onPress={() => handleSegmentPress(index, item)}
                    activeOpacity={interactive ? 0.7 : 1}
                    disabled={!interactive}
                  >
                    <View 
                      style={[
                        styles.legendColor, 
                        { backgroundColor: item.color }
                      ]} 
                    />
                    <View style={styles.legendTextContainer}>
                      <Text style={styles.legendLabel}>{item.name}</Text>
                      <Text style={styles.legendValue}>
                        {item.population.toFixed(1)}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  headerSection: {
    backgroundColor: colors.bgCard,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCardHover,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIcon: {
    fontSize: fonts.sizes.md,
  },
  statusText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium as any,
  },
  tabContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.xl,
    padding: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  tabIcon: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
  },
  tabLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium as any,
    color: colors.textSecondary,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  tabContent: {
    marginBottom: spacing.lg,
  },
  overviewCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  centerOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  centerLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  progressPercent: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  progressBarBackground: {
    height: 16,
    backgroundColor: colors.bgCardHover,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  progressStartLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontWeight: fonts.weights.medium as any,
  },
  progressEndLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontWeight: fonts.weights.medium as any,
  },
  milestoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestone: {
    alignItems: 'center',
    flex: 1,
  },
  milestoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  milestoneText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium as any,
    textAlign: 'center',
  },
  breakdownCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  barChartStyle: {
    borderRadius: borderRadius.lg,
    paddingRight: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: fonts.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
  legendSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  legendTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  legend: {
    gap: spacing.md,
  },
  legendItem: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  legendColor: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLabel: {
    fontSize: fonts.sizes.lg,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium as any,
  },
  legendValue: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
  },
});

export default ProgressDonationTracker;
