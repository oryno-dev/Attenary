import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fonts, shadows } from '../theme/colors';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// ═══════════════════════════════════════════════════════════════════
// FUTURISTIC 2026 GLASSMORPHISM ICONS
// ═══════════════════════════════════════════════════════════════════

const SettingsIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={colors.primary} strokeWidth="2" />
    <Path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const LockIcon = ({ size = 20, color = colors.textSecondary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const UnlockIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={colors.primary} strokeWidth="2" />
    <Path d="M7 11V7a5 5 0 0 1 9.9-1" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ShieldIcon = ({ size = 20, color = colors.textSecondary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const KeyIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={colors.textSecondary} strokeWidth="2" />
    <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ManageScreen = () => {
  const { appData, pin, setPin, lock } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState('');

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════════════════════════════════════════════════════════
            HEADER SECTION
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.headerSection}>
          <View style={styles.headerIconContainer}>
            <SettingsIcon size={28} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Manage</Text>
            <Text style={styles.subtitle}>Settings & security</Text>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            EMPLOYEE INFO CARD - Glass Panel
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <UserIcon size={20} />
            </View>
            <Text style={styles.cardTitle}>Employee Information</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{appData.employeeName || 'Not set'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoRowLeft}>
              <Text style={styles.infoLabel}>Total Sessions</Text>
            </View>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>{appData.sessions.length}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Active Sessions</Text>
            <Text style={[styles.infoValue, styles.infoValueActive]}>
              {appData.sessions.filter((s: any) => s.checkOutTime === null).length}
            </Text>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            PRIVACY SETTINGS CARD - Glass Panel
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconContainer, styles.cardIconContainerSecurity]}>
              <ShieldIcon size={20} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Privacy Settings</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoRowLeft}>
              <LockIcon size={18} color={pin ? colors.primary : colors.textMuted} />
              <Text style={styles.infoLabel}>PIN Protection</Text>
            </View>
            <View style={[
              styles.statusBadge,
              pin ? styles.statusBadgeActive : styles.statusBadgeInactive
            ]}>
              <Text style={[
                styles.statusBadgeText,
                pin ? styles.statusBadgeTextActive : styles.statusBadgeTextInactive
              ]}>
                {pin ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <KeyIcon size={18} />
              <Text style={styles.actionButtonPrimaryText}>
                {pin ? 'Change PIN' : 'Set PIN'}
              </Text>
            </TouchableOpacity>

            {pin && (
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonDanger]}
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
                activeOpacity={0.8}
              >
                <UnlockIcon size={18} />
                <Text style={styles.actionButtonDangerText}>Remove PIN</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary, styles.lockButton]}
            onPress={lock}
            activeOpacity={0.8}
          >
            <LockIcon size={18} color={colors.textSecondary} />
            <Text style={styles.actionButtonSecondaryText}>Lock Data</Text>
          </TouchableOpacity>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            PIN MODAL - Glass Modal
            ═══════════════════════════════════════════════════════════ */}
        {modalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              
              <View style={styles.modalIconContainer}>
                <ShieldIcon size={32} color={colors.primary} />
              </View>
              
              <Text style={styles.modalTitle}>
                {pin ? 'Change PIN' : 'Set PIN'}
              </Text>
              <Text style={styles.modalSubtitle}>
                Enter a 6-digit PIN to protect your data
              </Text>
              
              <TextInput
                style={styles.pinInput}
                placeholder="• • • • • •"
                placeholderTextColor={colors.textMuted}
                value={pinInput}
                onChangeText={setPinInput}
                keyboardType="numeric"
                maxLength={6}
                textAlign="center"
                secureTextEntry
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setModalVisible(false);
                    setPinInput('');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleSetPin}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalConfirmText}>Save PIN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.xl,
    paddingTop: spacing.huge,
    paddingBottom: spacing.huge,
  },

  // ═══════════════════════════════════════════════════════════════
  // HEADER SECTION
  // ═══════════════════════════════════════════════════════════════
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
    ...shadows.neonGlowSubtle,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: fonts.sizes.hero,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // ═══════════════════════════════════════════════════════════════
  // CARD STYLES
  // ═══════════════════════════════════════════════════════════════
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardIconContainerSecurity: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
  },
  cardTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoLabel: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  infoValue: {
    fontSize: fonts.sizes.md,
    color: colors.textPrimary,
    fontWeight: '600' as const,
  },
  infoValueActive: {
    color: colors.primary,
  },
  infoBadge: {
    backgroundColor: colors.bgElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  infoBadgeText: {
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
    fontWeight: '700' as const,
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
  },
  statusBadgeInactive: {
    backgroundColor: colors.bgElevated,
  },
  statusBadgeText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600' as const,
  },
  statusBadgeTextActive: {
    color: colors.primary,
  },
  statusBadgeTextInactive: {
    color: colors.textMuted,
  },

  // ═══════════════════════════════════════════════════════════════
  // BUTTON STYLES
  // ═══════════════════════════════════════════════════════════════
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.button,
    padding: spacing.lg,
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonDanger: {
    flex: 1,
    backgroundColor: 'rgba(255, 51, 102, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 102, 0.3)',
  },
  lockButton: {
    marginTop: spacing.sm,
  },
  actionButtonPrimaryText: {
    fontSize: fonts.sizes.md,
    fontWeight: '700' as const,
    color: colors.bgMain,
  },
  actionButtonSecondaryText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  actionButtonDangerText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600' as const,
    color: colors.danger,
  },

  // ═══════════════════════════════════════════════════════════════
  // MODAL STYLES
  // ═══════════════════════════════════════════════════════════════
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
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
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.glassElevated,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  pinInput: {
    backgroundColor: colors.bgElevated,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    color: colors.primary,
    fontSize: 28,
    fontWeight: '900' as const,
    fontFamily: 'monospace',
    letterSpacing: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.button,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.button,
    padding: spacing.lg,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: fonts.sizes.md,
    fontWeight: '700' as const,
    color: colors.bgMain,
  },
});

export default ManageScreen;
