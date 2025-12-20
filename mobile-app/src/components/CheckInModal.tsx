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

const CheckInModal = ({ navigation, route }: any) => {
  const { appData, checkIn, setEmployeeName } = useApp();
  const [modalVisible, setModalVisible] = useState(true);
  const [name, setName] = useState(appData.employeeName || '');

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
    navigation.goBack();
  };

  const handleCheckIn = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }

    try {
      if (!appData.employeeName) {
        await setEmployeeName(name.trim());
      }
      checkIn();
      Alert.alert('Success', 'Checked in successfully.');
      closeModal();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check in.');
    }
  };

  if (!modalVisible) {
    return null;
  }

  return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>👤</Text>
            <Text style={styles.modalTitle}>Check In</Text>
          </View>

          <Text style={styles.modalMessage}>
            Enter your name to check in
          </Text>

          <TextInput
            style={styles.nameInput}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleCheckIn}>
              <Text style={styles.confirmButtonText}>✓ Check In</Text>
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
    marginBottom: spacing.lg,
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
  modalMessage: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  nameInput: {
    backgroundColor: colors.bgMain,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
    fontSize: fonts.sizes.md,
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

export default CheckInModal;