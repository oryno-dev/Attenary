import React from 'react';
import { View, StyleSheet } from 'react-native';
import CircularProgressChart from './src/components/CircularProgressChart';

const MultiRingChartTestScreen: React.FC = () => {
  // Test data matching the reference HTML design with hours format
  const testData = [
    {
      label: 'Sleep',
      value: 62, // 62% of 24h = ~15h
      color: '#fbbf24', // Yellow
      ringIndex: 0,
    },
    {
      label: 'Snoring',
      value: 42, // 42% of 24h = ~10h
      color: '#6366f1', // Purple
      ringIndex: 1,
    },
    {
      label: 'Interruption',
      value: 34, // 34% of 24h = ~8h
      color: '#f43f5e', // Red
      ringIndex: 2,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <CircularProgressChart
          data={testData}
          centerLabel="Total"
          centerValue="46%"
          title="Sleep Metrics Dashboard"
          showAnimation={true}
          interactive={true}
          darkMode={true}
        />
      </View>
      
      <View style={styles.chartContainer}>
        <CircularProgressChart
          data={[
            { label: 'Completed', value: 85, color: '#10b981' },
            { label: 'In Progress', value: 10, color: '#f59e0b' },
            { label: 'Not Started', value: 5, color: '#6b7280' },
          ]}
          centerLabel="Tasks"
          centerValue="85%"
          title="Project Progress"
          showAnimation={true}
          interactive={true}
          darkMode={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 20,
    justifyContent: 'center',
  },
  chartContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
});

export default MultiRingChartTestScreen;