import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';
import { formatTime } from '../utils/timeUtils';

const CheckOutModal = ({ navigation, route }: any) => {
  const { appData, checkOut } = useApp();
  const [modalVisible, setModalVisible] = useState(true);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
      setModalVisible(false);
      navigation.dispatch(e.data.action);
    });

    return unsubscribe;
  }, [navigation]);

  const closeModal = () => {
    setModalVisible(false);
    setReason('');
    navigation.goBack();
  };

  const activeSession = appData.sessions.find((s: any) => s.checkOutTime === null);

  const handleConfirmCheckOut = () => {
    if (!activeSession) {
      Alert.alert('Error', 'No active session found.');
      return;
    }

    checkOut(reason.trim());
    Alert.alert('Success', 'Checked out successfully.');
    closeModal();
  };

  if (!modalVisible) {
    return null;
  }

  if (!activeSession) {
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>⚠️</Text>
            <Text style={styles.modalTitle}>No Active Session</Text>
          </View>
          <Text style={styles.modalSubtitle}>
            You are not currently checked in.
          </Text>
          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.cancelButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const checkinTime = new Date(activeSession.checkInTime);
  const elapsed = Math.floor((Date.now() - activeSession.checkInTime) / 1000);

  return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>📋</Text>
            <Text style={styles.modalTitle}>Check Out</Text>
          </View>

          <Text style={styles.modalSubtitle}>
            You have been checked in since {checkinTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          <View style={styles.sessionInfo}>
            <Text style={styles.sessionText}>
              Active for: {formatTime(elapsed)}
            </Text>
          </View>

          <Text style={styles.reasonLabel}>Reason (Optional)</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Enter reason for break or end of shift..."
            placeholderTextColor={colors.textMuted}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmCheckOut}
            >
              <Text style={styles.confirmButtonText}>✓ Confirm Check Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  modalTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.md,
    marginBottom: spacing.lg,
  },
  sessionInfo: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sessionText: {
    fontSize: fonts.sizes.md,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: fonts.weights.medium as any,
  },
  reasonLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  reasonInput: {
    backgroundColor: colors.bgMain,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
    fontSize: fonts.sizes.md,
    minHeight: 80,
  },
  modalFooter: {
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
    flex: 2,
    backgroundColor: 'linear-gradient(135deg, #ef4444, #dc2626)',
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

export default CheckOutModal;