import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';

// SVG Icons
const ExportIcon = ({ color = '#94a3b8', size = 20 }) => (
  <View style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M4 16a8 8 0 1 1 16 0" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 8v8" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </View>
);

const ManageScreen = () => {
  const { appData, pin, setPin, lock, exportData } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const handleExport = async () => {
    const data = await exportData();
    if (data) {
      Alert.alert('Success', 'Data exported successfully', [
        { text: 'OK', onPress: () => {} }
      ]);
    } else {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleSetPin = async () => {
    if (pinInput.length !== 6) {
      Alert.alert('Error', 'PIN must be exactly 6 digits');
      return;
    }
    setPin(pinInput);
    setPinInput('');
    setModalVisible(false);
  };

  const handleRemovePin = () => {
    setPin('');
    setModalVisible(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Manage</Text>

      {/* Employee Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Employee Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{appData.employeeName || 'Not set'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Sessions:</Text>
          <Text style={styles.infoValue}>{appData.sessions.length}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Active Sessions:</Text>
          <Text style={styles.infoValue}>
            {appData.sessions.filter((s: any) => s.checkOutTime === null).length}
          </Text>
        </View>
      </View>

      {/* Privacy Settings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Privacy Settings</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PIN Protection:</Text>
          <Text style={styles.infoValue}>{pin ? 'Enabled' : 'Disabled'}</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>
              {pin ? 'Change PIN' : 'Set PIN'}
            </Text>
          </TouchableOpacity>
          {pin && (
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={() => {
                Alert.alert(
                  'Remove PIN',
                  'This will remove PIN protection from your data.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Remove', onPress: handleRemovePin }
                  ]
                );
              }}
            >
              <Text style={styles.buttonText}>Remove PIN</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={lock}
          >
            <Text style={styles.buttonText}>Lock Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data Management</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleExport}
        >
          <ExportIcon color="#94a3b8" size={20} />
          <Text style={styles.buttonText}>Export Data</Text>
        </TouchableOpacity>
      </View>

      {/* Set PIN Modal */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {pin ? 'Change PIN' : 'Set PIN'}
            </Text>
            <Text style={styles.modalSubtitle}>
              Enter a 6-digit PIN to protect your data
            </Text>
            <TextInput
              style={styles.pinInput}
              placeholder="Enter 6-digit PIN"
              placeholderTextColor={colors.textMuted}
              value={pinInput}
              onChangeText={setPinInput}
              keyboardType="numeric"
              maxLength={6}
              textAlign="center"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setPinInput('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleSetPin}
              >
                <Text style={styles.confirmButtonText}>Save PIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: fonts.sizes.md,
    color: colors.textMuted,
    fontWeight: fonts.weights.medium as any,
  },
  infoValue: {
    fontSize: fonts.sizes.md,
    color: colors.textPrimary,
    fontWeight: fonts.weights.semibold as any,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dangerButton: {
    backgroundColor: colors.danger,
  },
  secondaryButton: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
  },
  modalTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  pinInput: {
    backgroundColor: colors.bgMain,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cancelButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium as any,
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
  },
});

export default ManageScreen;