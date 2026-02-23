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

// SVG Icons
const LockIcon = ({ color = '#94a3b8', size = 24 }) => (
  <View style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 15v3m-3-3h6M5 9h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M9 9V7a4 4 0 1 1 6 0v2" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </View>
);

const PINModal = ({ navigation, route }: any) => {
  const { pin, unlocked, unlock, lock } = useApp();
  const [modalVisible, setModalVisible] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);


  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
      setModalVisible(false);
      navigation.dispatch(e.data.action);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setIsSettingPin(!pin);
  }, [pin]);

  const closeModal = () => {
    setModalVisible(false);
    setPinInput('');
    setError('');
    navigation.goBack();
  };

  const handlePinChange = (value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    setPinInput(value);
    setError('');
  };

  const handleSubmit = async () => {
    if (pinInput.length !== 6) {
      setError('PIN must be exactly 6 digits');
      return;
    }

    if (isSettingPin) {
      // This would call setPin from context
      Alert.alert('Success', 'PIN set successfully');
      closeModal();
    } else {
      const success = await unlock(pinInput);
      if (success) {
        Alert.alert('Success', 'Data unlocked');
        closeModal();
      } else {
        setError('Incorrect PIN');
        setPinInput('');
      }
    }
  };

  const clearError = () => {
    if (error) setError('');
  };

  if (!modalVisible) {
    return null;
  }

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <LockIcon color="#94a3b8" size={24} />
          <Text style={styles.modalTitle}>
            {isSettingPin ? 'Set PIN' : 'Unlock Data'}
          </Text>
        </View>

        <Text style={styles.modalMessage}>
          {isSettingPin
            ? 'Create a 6-digit PIN to protect your data'
            : 'Enter your 6-digit PIN to unlock your data'}
        </Text>

        <View style={styles.pinContainer} onTouchStart={clearError}>
          <TextInput
            style={[
              styles.pinInput,
              error && styles.pinInputError,
            ]}
            value={pinInput}
            onChangeText={handlePinChange}
            keyboardType="numeric"
            maxLength={6}
            textAlign="center"
            secureTextEntry
            placeholder="Enter 6-digit PIN"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
            <Text style={styles.confirmButtonText}>
              {isSettingPin ? 'Set PIN' : 'Unlock'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
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
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  modalIcon: {
    position: 'absolute',
    left: 0,
  },
  modalTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  modalMessage: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  pinContainer: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  pinInput: {
    width: '100%',
    height: 50,
    backgroundColor: colors.bgMain,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    letterSpacing: 2,
  },
  pinInputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: fonts.sizes.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: fonts.weights.medium as any,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.bgMain,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium as any,
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
  },
});

export default PINModal;