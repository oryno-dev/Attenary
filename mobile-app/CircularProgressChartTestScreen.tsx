import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import CircularProgressChart from './src/components/CircularProgressChart';

const CircularProgressChartTestScreen = () => {
  // Test data for 2025-12 Progress
  const sampleData = [
    { label: 'Completed', value: 0, color: '#13ec5b' },
    { label: 'Remaining', value: 100, color: '#8b5cf6' },
    { label: 'Overtime', value: 0, color: '#f59e0b' }
  ];

  const progressData = [
    { label: 'Completed', value: 75, color: '#13ec5b' },
    { label: 'Remaining', value: 20, color: '#8b5cf6' },
    { label: 'Overtime', value: 5, color: '#f59e0b' }
  ];

  const [currentData, setCurrentData] = useState('sample');
  const [showAnimation, setShowAnimation] = useState(true);

  const handleSegmentPress = (index: number, item: any) => {
    Alert.alert(
      'Segment Pressed',
      `${item.label}: ${item.value}%`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Circular Progress Chart UI/UX Improvements</Text>
      
      <View style={styles.controls}>
        <Button 
          title="Sample Data (0%)" 
          onPress={() => setCurrentData('sample')}
        />
        <Button 
          title="Progress Data (75%)" 
          onPress={() => setCurrentData('progress')}
        />
      </View>
      
      <View style={styles.controls}>
        <Button 
          title="With Animation" 
          onPress={() => setShowAnimation(true)}
        />
        <Button 
          title="No Animation" 
          onPress={() => setShowAnimation(false)}
        />
      </View>

      <View style={styles.chartContainer}>
        <CircularProgressChart
          data={currentData === 'sample' ? sampleData : progressData}
          centerLabel="Hours"
          centerValue={currentData === 'sample' ? "00:00" : "180:00"}
          title="2025-12 Progress"
          showAnimation={showAnimation}
          interactive={true}
          onSegmentPress={handleSegmentPress}
        />
      </View>

      <View style={styles.improvements}>
        <Text style={styles.sectionTitle}>UI/UX Improvements Made:</Text>
        <Text style={styles.improvement}>✅ Enhanced status indicators with icons</Text>
        <Text style={styles.improvement}>✅ Interactive legend with press feedback</Text>
        <Text style={styles.improvement}>✅ Smooth entrance animations</Text>
        <Text style={styles.improvement}>✅ Progress summary with animated bar</Text>
        <Text style={styles.improvement}>✅ Better visual hierarchy and spacing</Text>
        <Text style={styles.improvement}>✅ Enhanced shadows and visual depth</Text>
        <Text style={styles.improvement}>✅ Improved color contrast and typography</Text>
        <Text style={styles.improvement}>✅ Responsive layout and touch targets</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216',
    padding: 20,
  },
  title: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  chartContainer: {
    marginBottom: 30,
  },
  improvements: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 12,
  },
  sectionTitle: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  improvement: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default CircularProgressChartTestScreen;
