import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import BarChartComponent from './src/components/BarChartComponent';

const BarChartTestScreen = () => {
  // Test data with some activity
  const sampleData = {
    labels: [
      '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', 
      '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
      '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 1, 0, 2, 3, 2, 1, 0, 1, 2, 1, 3, 2, 1, 0, 0, 0, 0, 0]
    }]
  };

  const emptyData = {
    labels: [
      '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', 
      '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
      '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }]
  };

  const [showData, setShowData] = useState('sample');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BarChart Component UI/UX Improvements</Text>
      
      <View style={styles.controls}>
        <Button 
          title="Show Sample Data" 
          onPress={() => setShowData('sample')}
        />
        <Button 
          title="Show Empty Data" 
          onPress={() => setShowData('empty')}
        />
      </View>

      <View style={styles.chartContainer}>
        <BarChartComponent
          data={showData === 'sample' ? sampleData : emptyData}
          title="Hourly Activity"
          yAxisLabel=""
          yAxisSuffix=" sessions"
          showValuesOnTopOfBars={true}
          width={380}
          height={280}
        />
      </View>

      <View style={styles.improvements}>
        <Text style={styles.sectionTitle}>UI/UX Improvements Made:</Text>
        <Text style={styles.improvement}>✅ Smart label filtering (every 6 hours)</Text>
        <Text style={styles.improvement}>✅ Scrollable chart for better mobile experience</Text>
        <Text style={styles.improvement}>✅ Empty state with helpful messaging</Text>
        <Text style={styles.improvement}>✅ Statistics badges (Total & Peak)</Text>
        <Text style={styles.improvement}>✅ Better spacing and typography</Text>
        <Text style={styles.improvement}>✅ Legend for better understanding</Text>
        <Text style={styles.improvement}>✅ Improved shadows and visual hierarchy</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
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

export default BarChartTestScreen;
