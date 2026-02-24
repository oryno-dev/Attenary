import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import ProgressTracker from './src/components/ProgressTracker';

const ProgressTrackerTestScreen = () => {
  // Test scenarios
  const [currentScenario, setCurrentScenario] = useState('in-progress');

  const scenarios = {
    'in-progress': {
      title: 'Christmas Charity Fund 2025',
      targetAmount: 10000,
      currentAmount: 6500,
      data: {
        labels: [
          '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', 
          '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
          '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ],
        datasets: [{
          data: [0, 0, 0, 0, 0, 0, 1, 2, 3, 5, 4, 2, 1, 3, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0]
        }]
      }
    },
    'completed': {
      title: 'Animal Shelter Fundraiser',
      targetAmount: 5000,
      currentAmount: 5200,
      data: {
        labels: [
          '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', 
          '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
          '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ],
        datasets: [{
          data: [2, 1, 0, 0, 0, 1, 3, 4, 6, 8, 7, 5, 4, 6, 5, 3, 2, 1, 1, 0, 0, 0, 0, 0]
        }]
      }
    },
    'empty': {
      title: 'Community Garden Project',
      targetAmount: 8000,
      currentAmount: 0,
      data: {
        labels: [
          '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', 
          '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
          '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ],
        datasets: [{
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
      }
    }
  };

  const currentData = scenarios[currentScenario as keyof typeof scenarios];

  const handleSegmentPress = (index: number, item: any) => {
    Alert.alert(
      'Segment Details',
      `${item.name}: ${item.population.toFixed(1)}%`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modern ProgressTracker - Tabbed Interface</Text>
      
      <View style={styles.controls}>
        <Button 
          title="In Progress (65%)" 
          onPress={() => setCurrentScenario('in-progress')}
        />
        <Button 
          title="Completed (104%)" 
          onPress={() => setCurrentScenario('completed')}
        />
        <Button 
          title="Not Started (0%)" 
          onPress={() => setCurrentScenario('empty')}
        />
      </View>

      <View style={styles.chartContainer}>
        <ProgressTracker
          title={currentData.title}
          targetAmount={currentData.targetAmount}
          currentAmount={currentData.currentAmount}
          data={currentData.data}
          centerLabel="Raised"
          showAnimation={true}
          interactive={true}
          onSegmentPress={handleSegmentPress}
          currency="$"
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.sectionTitle}>Modern Tabbed Interface:</Text>
        <Text style={styles.infoItem}>🎯 1. Overview Tab - Circular progress with center stats</Text>
        <Text style={styles.infoItem}>📈 2. Timeline Tab - Animated progress bar with milestones</Text>
        <Text style={styles.infoItem}>📊 3. Breakdown Tab - Detailed activity bar chart</Text>
        
        <Text style={styles.featuresTitle}>2025 Modern Enhancements:</Text>
        <Text style={styles.feature}>✨ Clean tabbed navigation with smooth transitions</Text>
        <Text style={styles.feature}>✨ Enhanced visual design with modern shadows & spacing</Text>
        <Text style={styles.feature}>✨ Multi-layer animation system with staggered timing</Text>
        <Text style={styles.feature}>✨ Interactive legend with press feedback</Text>
        <Text style={styles.feature}>✨ Enhanced empty states with larger icons</Text>
        <Text style={styles.feature}>✨ Mobile-optimized responsive design</Text>
        <Text style={styles.feature}>✨ Color-coded tabs matching visualization themes</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216',
  },
  title: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  chartContainer: {
    flex: 1,
  },
  info: {
    backgroundColor: '#1e293b',
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },
  sectionTitle: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 8,
  },
  featuresTitle: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  feature: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 3,
  },
});

export default ProgressTrackerTestScreen;
