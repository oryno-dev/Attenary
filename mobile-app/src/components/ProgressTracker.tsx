import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { colors, spacing, fonts, borderRadius, shadows } from '../theme/colors';
import Svg, { Circle, Path } from 'react-native-svg';

interface ProgressTrackerProps {
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

// ═══════════════════════════════════════════════════════════════════
// FUTURISTIC 2026 GLASSMORPHISM ICONS
// ═══════════════════════════════════════════════════════════════════

const TargetIcon = ({ size = 20, color = colors.primary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

const ClockIcon = ({ size = 20, color = colors.info }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AlertIcon = ({ size = 20, color = colors.warning }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
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

  // Enhanced data for pie chart with glassmorphism colors
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
      color: colors.info,
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

  // Modern chart configuration with glassmorphism styling
  const chartConfig = {
    backgroundGradientFrom: colors.bgCard,
    backgroundGradientTo: colors.bgCard,
    color: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(241, 245, 249, ${opacity * 0.8})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    decimalPlaces: 0,
    fromZero: true,
    fillShadowGradient: colors.primary,
    fillShadowGradientOpacity: 0.8,
    fillShadowGradientFrom: colors.primary,
    fillShadowGradientTo: colors.primaryDark,
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
    if (isComplete) return { status: 'Goal Achieved!', color: colors.success, icon: '✓' };
    if (progressPercentage >= 75) return { status: 'Almost There', color: colors.primary, icon: '→' };
    if (progressPercentage >= 50) return { status: 'Halfway There', color: colors.warning, icon: '◆' };
    if (progressPercentage >= 25) return { status: 'Getting Started', color: colors.info, icon: '○' };
    return { status: 'Just Beginning', color: colors.textMuted, icon: '◇' };
  };

  const progressStatus = getProgressStatus();
  const filteredData = {
    ...data,
    labels: data.labels.map((label, index) => {
      const hour = parseInt(label.split(':')[0]);
      return (hour % 6 === 0) ? label : '';
    }),
  };

  // Tab configuration with glassmorphism styling
  const tabs = [
    { key: 'overview' as TabType, label: 'Overview', icon: '◎', color: colors.primary },
    { key: 'timeline' as TabType, label: 'Timeline', icon: '◈', color: colors.info },
    { key: 'breakdown' as TabType, label: 'Breakdown', icon: '◆', color: colors.warning },
  ];

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <View style={styles.overviewCard}>
              {/* Chart with glow effect */}
              <View style={styles.circularProgressContainer}>
                <View style={styles.chartGlow} />
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
                  <View style={styles.percentBadge}>
                    <Text style={styles.progressPercent}>
                      {Math.round(progressPercentage)}%
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Stats Grid with glass cards */}
              <View style={styles.statsGrid}>
                <View style={[styles.statItem, styles.statItemCompleted]}>
                  <View style={styles.statIconContainer}>
                    <TargetIcon size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.statValue, styles.statValuePrimary]}>
                    {currency}{Math.round(targetAmount).toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>Target</Text>
                </View>
                
                <View style={[styles.statItem, styles.statItemRemaining]}>
                  <View style={[styles.statIconContainer, styles.statIconContainerInfo]}>
                    <ClockIcon size={16} color={colors.info} />
                  </View>
                  <Text style={[styles.statValue, styles.statValueInfo]}>
                    {currency}{Math.round(remainingAmount).toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>Remaining</Text>
                </View>
                
                {overtimeAmount > 0 && (
                  <View style={[styles.statItem, styles.statItemOvertime]}>
                    <View style={[styles.statIconContainer, styles.statIconContainerWarning]}>
                      <AlertIcon size={16} color={colors.warning} />
                    </View>
                    <Text style={[styles.statValue, styles.statValueWarning]}>
                      {currency}{Math.round(overtimeAmount).toLocaleString()}
                    </Text>
                    <Text style={styles.statLabel}>Overtime</Text>
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
              {/* Progress bar with glow */}
              <View style={styles.progressBarContainer}>
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
                  <Animated.View 
                    style={[
                      styles.progressBarGlow,
                      {
                        width: animatedValues[0].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', `${Math.min(progressPercentage, 100)}%`],
                        }),
                      }
                    ]}
                  />
                </View>
                <View style={styles.progressBarLabels}>
                  <Text style={styles.progressStartLabel}>0%</Text>
                  <Text style={styles.progressEndLabel}>100%</Text>
                </View>
              </View>
              
              {/* Milestones with neon indicators */}
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
                  <View style={styles.emptyIconContainer}>
                    <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <Path d="M3 3v18h18" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <Path d="M7 16l4-4 4 4 5-6" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
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
      {/* Glass Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>Track your progress</Text>
          </View>
          <View style={[styles.statusBadge, { borderColor: progressStatus.color + '40' }]}>
            <Text style={[styles.statusIcon, { color: progressStatus.color }]}>
              {progressStatus.icon}
            </Text>
            <Text style={[styles.statusText, { color: progressStatus.color }]}>
              {progressStatus.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Glass Tab Navigation */}
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
                  isActive && { color: colors.bgMain, fontWeight: '700' as const }
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

      {/* Interactive Legend with glass cards */}
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
                    { 
                      transform: [{ scale: animatedScale }],
                      borderColor: item.color + '30',
                    }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.legendContent}
                    onPress={() => handleSegmentPress(index, item)}
                    activeOpacity={interactive ? 0.7 : 1}
                    disabled={!interactive}
                  >
                    <View style={styles.legendLeft}>
                      <View 
                        style={[
                          styles.legendColor, 
                          { backgroundColor: item.color }
                        ]} 
                      />
                      <Text style={styles.legendLabel}>{item.name}</Text>
                    </View>
                    <View style={[styles.legendValueContainer, { backgroundColor: item.color + '15' }]}>
                      <Text style={[styles.legendValue, { color: item.color }]}>
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
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.card,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
    borderWidth: 1,
  },
  statusIcon: {
    fontSize: fonts.sizes.md,
    fontWeight: '700' as const,
  },
  statusText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600' as const,
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
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.glass,
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
    fontWeight: '500' as const,
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
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  chartGlow: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    marginLeft: -60,
    marginTop: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryGlow,
    opacity: 0.2,
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
    fontWeight: '800' as const,
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  centerLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  percentBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  progressPercent: {
    fontSize: fonts.sizes.lg,
    fontWeight: '800' as const,
    color: colors.primary,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItemCompleted: {
    backgroundColor: 'rgba(0, 255, 136, 0.08)',
    borderColor: colors.primary + '30',
  },
  statItemRemaining: {
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderColor: colors.info + '30',
  },
  statItemOvertime: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderColor: colors.warning + '30',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statIconContainerInfo: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
  },
  statIconContainerWarning: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  statValue: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  statValuePrimary: {
    color: colors.primary,
  },
  statValueInfo: {
    color: colors.info,
  },
  statValueWarning: {
    color: colors.warning,
  },
  statLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  progressBarContainer: {
    marginBottom: spacing.lg,
  },
  progressBarBackground: {
    height: 20,
    backgroundColor: colors.bgElevated,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressBarGlow: {
    position: 'absolute',
    top: -4,
    height: 28,
    backgroundColor: colors.primaryGlow,
    opacity: 0.4,
    borderRadius: 14,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  progressStartLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontWeight: '500' as const,
  },
  progressEndLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontWeight: '500' as const,
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
    width: 14,
    height: 14,
    borderRadius: 7,
    marginBottom: spacing.xs,
    ...shadows.neonGlowSubtle,
  },
  milestoneText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  breakdownCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadows.card,
  },
  barChartStyle: {
    borderRadius: borderRadius.lg,
    paddingRight: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
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
  emptyText: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
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
    fontWeight: '600' as const,
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
    ...shadows.glass,
  },
  legendContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: spacing.md,
    ...shadows.neonGlowSubtle,
  },
  legendLabel: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  legendValueContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  legendValue: {
    fontSize: fonts.sizes.md,
    fontWeight: '700' as const,
    fontFamily: 'monospace',
  },
});

export default ProgressTracker;