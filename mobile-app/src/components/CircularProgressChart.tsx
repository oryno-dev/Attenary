import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, spacing, fonts, borderRadius } from '../theme/colors';
import CompactTimeStats from './CompactTimeStats';

interface CircularProgressChartProps {
  data: {
    label: string;
    value: number;
    color: string;
    ringIndex?: number;
  }[];
  centerLabel?: string;
  centerValue?: string;
  title?: string;
  showAnimation?: boolean;
  interactive?: boolean;
  onSegmentPress?: (index: number, item: any) => void;
  darkMode?: boolean;
}

const CircularProgressChart: React.FC<CircularProgressChartProps> = ({
  data,
  centerLabel,
  centerValue,
  title,
  showAnimation = true,
  interactive = true,
  onSegmentPress,
  darkMode = true
}) => {
  const [animatedValues] = useState(data.map(() => new Animated.Value(0)));
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const theme = {
    background: darkMode ? '#1a2035' : colors.bgCard,
    cardBackground: darkMode ? '#1f2937' : colors.bgCard,
    textPrimary: darkMode ? '#f3f4f6' : colors.textPrimary,
    textSecondary: darkMode ? '#9ca3af' : colors.textSecondary,
    border: darkMode ? 'rgba(255, 255, 255, 0.1)' : colors.border,
    circleBg: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
  };

  const svgSize = 224;
  const center = svgSize / 2;
  
  const circles = [
    { radius: 63.8, strokeWidth: 8, bgStrokeWidth: 4 },
    { radius: 50, strokeWidth: 8, bgStrokeWidth: 4 },
    { radius: 36, strokeWidth: 8, bgStrokeWidth: 4 },
  ];
  
  const getCircumference = (radius: number) => 2 * Math.PI * radius;

  useEffect(() => {
    if (showAnimation) {
      const animations = data.map((_, index) => 
        Animated.timing(animatedValues[index], {
          toValue: 1,
          duration: 1000 + index * 300,
          useNativeDriver: false,
        })
      );
      
      Animated.stagger(200, animations).start();
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

  const renderCircularChart = () => {
    return (
      <View style={styles.chartContainer}>
        <Svg 
          width={svgSize} 
          height={svgSize} 
          style={{ transform: [{ rotate: '-90deg' }] }}
        >
          {circles.map((circleConfig, index) => {
            const dataItem = data[index] || { value: 0, color: colors.textMuted };
            const circumference = getCircumference(circleConfig.radius);
            const strokeDasharray = `${(dataItem.value / 100) * circumference}, ${circumference}`;
            
            return (
              <React.Fragment key={index}>
                <Circle
                  cx={center}
                  cy={center}
                  r={circleConfig.radius}
                  fill="none"
                  stroke={theme.circleBg}
                  strokeWidth={circleConfig.bgStrokeWidth}
                />
                <Circle
                  cx={center}
                  cy={center}
                  r={circleConfig.radius}
                  fill="none"
                  stroke={dataItem.color}
                  strokeWidth={circleConfig.strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                />
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      {title && (
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
        </View>
      )}
      
      {/* Chart positioned with relative positioning */}
      <View style={styles.chartPositionContainer}>
        <View style={styles.leftChartContainer}>
          {renderCircularChart()}
          
          <View style={styles.centerOverlay}>
            <TouchableOpacity
              style={styles.centerTouchable}
              activeOpacity={1}
            >
              {/* Removed centerValue and centerLabel to clean up the rings */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Compact Time Stats positioned absolutely */}
      <CompactTimeStats
        stats={data.map((item, index) => {
          const hours = Math.floor(item.value * 24 / 100);
          const minutes = Math.floor((item.value * 24 % 100) * 0.6);
          return {
            label: item.label.toUpperCase(),
            hours,
            minutes,
            color: item.color,
            backgroundColor: `${item.color}30`,
          };
        })}
      />
      
      {/* Legend and Progress Summary */}
      <View style={styles.legendContainer}>
        <View style={styles.legend}>
          {data.map((item, index) => {
            const animatedScale = animatedValues[index].interpolate({
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
                    opacity: isPressed ? 0.7 : 1,
                  }
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
                      { backgroundColor: item.color },
                      isPressed && styles.legendColorPressed
                    ]} 
                  />
                  <View style={styles.legendTextContainer}>
                    <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.legendValue, { color: theme.textPrimary }]}>
                      {item.value}%
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View style={[styles.progressSummary, { borderTopColor: theme.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Progress</Text>
            <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{Math.round(total)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressBarBackground, { backgroundColor: theme.circleBg }]}>
              <Animated.View 
                style={[
                  styles.progressBarFill,
                  {
                    width: animatedValues[0].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: data[0]?.color || colors.primary,
                  }
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a2035',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f3f4f6',
    flex: 1,
  },
  chartPositionContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  leftChartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    zIndex: 5,
    elevation: 5,
    paddingTop: 20, // Move chart up from top
    marginTop: -60, // Added negative margin to move rings 60px higher
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  centerOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  centerValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f3f4f6',
    textAlign: 'center',
  },
  centerLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 2,
  },
  legendContainer: {
    gap: 12,
  },
  legend: {
    gap: 12,
    marginBottom: 24,
  },
  legendItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  legendContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legendColorPressed: {
    transform: [{ scale: 0.9 }],
    opacity: 0.8,
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f3f4f6',
  },
  progressSummary: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f3f4f6',
  },
  progressBar: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default CircularProgressChart;
