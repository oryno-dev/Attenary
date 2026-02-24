import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CompactTimeStats from './src/components/CompactTimeStats';
import { colors } from './src/theme/colors';

// Demo data matching your original component
const timeStatsData = [
  {
    label: 'COMPLETED',
    hours: 0,
    minutes: 0,
    color: 'rgb(19, 236, 91)', // green
    backgroundColor: 'rgba(19, 236, 91, 0.19)',
  },
  {
    label: 'REMAINING',
    hours: 24,
    minutes: 0,
    color: 'rgb(139, 92, 246)', // purple
    backgroundColor: 'rgba(139, 92, 246, 0.19)',
  },
  {
    label: 'OVERTIME',
    hours: 0,
    minutes: 0,
    color: 'rgb(245, 158, 11)', // orange
    backgroundColor: 'rgba(245, 158, 11, 0.19)',
  },
];

const CompactTimeStatsDemo = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <CompactTimeStats stats={timeStatsData} />
      </View>
      
      <View style={styles.content}>
        <CompactTimeStats 
          stats={[
            {
              label: 'TODAY',
              hours: 8,
              minutes: 30,
              color: colors.primary,
              backgroundColor: 'rgba(99, 102, 241, 0.19)',
            },
            {
              label: 'WEEK',
              hours: 42,
              minutes: 15,
              color: colors.success,
              backgroundColor: 'rgba(19, 236, 91, 0.19)',
            },
            {
              label: 'MONTH',
              hours: 168,
              minutes: 45,
              color: colors.warning,
              backgroundColor: 'rgba(245, 158, 11, 0.19)',
            },
          ]} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  header: {
    padding: 16,
    backgroundColor: colors.bgCard,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    padding: 16,
    backgroundColor: colors.bgCard,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default CompactTimeStatsDemo;