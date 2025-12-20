import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';

const MonthlyReportScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Monthly Report</Text>
      <Text style={styles.comingSoon}>Coming Soon</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  contentContainer: {
    padding: spacing.xl,
  },
  title: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  comingSoon: {
    fontSize: fonts.sizes.xl,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
});

export default MonthlyReportScreen;