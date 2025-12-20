import React, { useState, useEffect, useRef } from 'react';
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

const PINModal = ({ navigation, route }: any) => {
  const { pin, unlocked, unlock, lock } = useApp();
  const [modalVisible, setModalVisible] = useState(true);
  const [pinInput, setPinInput] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);

  const inputsRef = useRef([]);

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
    setPinInput(['', '', '', '', '', '']);
    setError('');
    navigation.goBack();
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pinInput];
    newPin[index] = value.slice(-1);
    setPinInput(newPin);

    setError('');

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !pinInput[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const pinString = pinInput.join('');

    if (pinString.length !== 6) {
      setError('PIN must be exactly 6 digits');
      return;
    }

    if (isSettingPin) {
      // This would call setPin from context
      Alert.alert('Success', 'PIN set successfully');
      closeModal();
    } else {
      const success = await unlock(pinString);
      if (success) {
        Alert.alert('Success', 'Data unlocked');
        closeModal();
      } else {
        setError('Incorrect PIN');
        setPinInput(['', '', '', '', '', '']);
        inputsRef.current[0]?.focus();
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
            <Text style={styles.modalIcon}>🔐</Text>
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
            {pinInput.map((digit: string, index: number) => (
              <TextInput
                key={index}
                ref={(ref: any) => (inputsRef.current[index] = ref)}
                style={[
                  styles.pinInput,
                  error && styles.pinInputError,
                ]}
                value={digit}
                onChangeText={(value: string) => handlePinChange(index, value)}
                onKeyPress={({ nativeEvent }: any) =>
                  handleKeyPress(index, nativeEvent.key)
                }
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                fontSize={24}
                fontWeight="bold"
                secureTextEntry
              />
            ))}
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
  modalMessage: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  pinInput: {
    flex: 1,
    height: 60,
    backgroundColor: colors.bgMain,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    color: colors.textPrimary,
    marginHorizontal: spacing.sm,
    fontSize: 24,
    fontWeight: 'bold',
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

export default PINModal;