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
  Image,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, fonts, shadows } from '../theme/colors';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';

// ═══════════════════════════════════════════════════════════════════
// FUTURISTIC 2026 GLASSMORPHISM ICONS
// ═══════════════════════════════════════════════════════════════════

const UserIcon = ({ size = 24 }: { size?: number }) => (
  <Image 
    source={require('../../assets/icons/profile.png')} 
    style={{ width: size, height: size }} 
    resizeMode="contain"
  />
);

const EditIcon = ({ size = 16, color = colors.textMuted }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 20h9M13.5 6.5l-7 7-3 3 3.5-3 6.5-6.5z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const EmailIcon = ({ size = 20 }: { size?: number }) => (
  <Image 
    source={require('../../assets/icons/email.png')} 
    style={{ width: size, height: size }} 
    resizeMode="contain"
  />
);

const BriefcaseIcon = ({ size = 20 }: { size?: number }) => (
  <Image 
    source={require('../../assets/icons/job.png')} 
    style={{ width: size, height: size }} 
    resizeMode="contain"
  />
);

const BuildingIcon = ({ size = 20 }: { size?: number }) => (
  <Image 
    source={require('../../assets/icons/department.png')} 
    style={{ width: size, height: size }} 
    resizeMode="contain"
  />
);

const NameIcon = ({ size = 20 }: { size?: number }) => (
  <Image 
    source={require('../../assets/icons/name.png')} 
    style={{ width: size, height: size }} 
    resizeMode="contain"
  />
);

const ChevronRightIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ProfileScreen = () => {
  const { appData, setEmployeeName, setEmail, setJobTitle, setDepartment } = useApp();
  const { t } = useLanguage();
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [jobTitleModalVisible, setJobTitleModalVisible] = useState(false);
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false);
  const [employeeName, setEmployeeNameInput] = useState(appData.employeeName);
  const [email, setEmailInput] = useState(appData.email);
  const [jobTitle, setJobTitleInput] = useState(appData.jobTitle);
  const [department, setDepartmentInput] = useState(appData.department);

  const saveEmployeeName = () => {
    if (!employeeName.trim()) {
      Alert.alert(t('common.error'), t('profile.pleaseEnterName'));
      return;
    }
    setEmployeeName(employeeName.trim());
    setNameModalVisible(false);
  };

  const saveEmail = () => {
    if (!email.trim()) {
      Alert.alert(t('common.error'), t('profile.pleaseEnterEmail'));
      return;
    }
    if (!email.includes('@')) {
      Alert.alert(t('common.error'), t('profile.pleaseEnterValidEmail'));
      return;
    }
    setEmail(email.trim());
    setEmailModalVisible(false);
  };

  const saveJobTitle = () => {
    if (!jobTitle.trim()) {
      Alert.alert(t('common.error'), t('profile.pleaseEnterJobTitle'));
      return;
    }
    setJobTitle(jobTitle.trim());
    setJobTitleModalVisible(false);
  };

  const saveDepartment = () => {
    if (!department.trim()) {
      Alert.alert(t('common.error'), t('profile.pleaseEnterDepartment'));
      return;
    }
    setDepartment(department.trim());
    setDepartmentModalVisible(false);
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
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatar}>
              <UserIcon size={80} />
            </View>
          </View>
          <Text style={styles.title}>{t('profile.title')}</Text>
          <Text style={styles.subtitle}>{t('profile.subtitle')}</Text>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            PERSONAL INFO CARD - Glass Panel
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('profile.personalInformation')}</Text>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>{t('profile.editable')}</Text>
            </View>
          </View>

          {/* Name Row */}
          <TouchableOpacity 
            style={styles.profileRow} 
            onPress={() => setNameModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.profileRowLeft}>
              <View style={styles.profileIconContainer}>
                <NameIcon size={28} />
              </View>
              <View style={styles.profileInfo}>
                  <Text style={styles.profileLabel}>{t('profile.fullName')}</Text>
                  <Text style={styles.profileValue}>
                    {appData.employeeName || t('profile.tapToSetYourName')}
                  </Text>
                </View>
            </View>
            <View style={styles.profileRowRight}>
              <EditIcon size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Email Row */}
          <TouchableOpacity 
            style={styles.profileRow} 
            onPress={() => setEmailModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.profileRowLeft}>
              <View style={[styles.profileIconContainer, styles.profileIconContainerSecondary]}>
                <EmailIcon size={28} />
              </View>
              <View style={styles.profileInfo}>
                  <Text style={styles.profileLabel}>{t('profile.emailAddress')}</Text>
                  <Text style={styles.profileValue}>
                    {appData.email || t('profile.defaultEmail')}
                  </Text>
                </View>
            </View>
            <View style={styles.profileRowRight}>
              <EditIcon size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Job Title Row */}
          <TouchableOpacity 
            style={styles.profileRow} 
            onPress={() => setJobTitleModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.profileRowLeft}>
              <View style={[styles.profileIconContainer, styles.profileIconContainerTertiary]}>
                <BriefcaseIcon size={28} />
              </View>
              <View style={styles.profileInfo}>
                  <Text style={styles.profileLabel}>{t('profile.jobTitle')}</Text>
                  <Text style={styles.profileValue}>
                    {appData.jobTitle || t('profile.jobTitlePlaceholder')}
                  </Text>
                </View>
            </View>
            <View style={styles.profileRowRight}>
              <EditIcon size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Department Row */}
          <TouchableOpacity 
            style={styles.profileRow} 
            onPress={() => setDepartmentModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.profileRowLeft}>
              <View style={[styles.profileIconContainer, styles.profileIconContainerQuaternary]}>
                <BuildingIcon size={28} />
              </View>
              <View style={styles.profileInfo}>
                  <Text style={styles.profileLabel}>{t('profile.department')}</Text>
                  <Text style={styles.profileValue}>
                    {appData.department || t('profile.departmentPlaceholder')}
                  </Text>
                </View>
            </View>
            <View style={styles.profileRowRight}>
              <EditIcon size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            STATS CARD - Glass Panel
            ═══════════════════════════════════════════════════════════ */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>{t('profile.activitySummary')}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{appData.sessions.length}</Text>
              <Text style={styles.statLabel}>{t('profile.totalSessions')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.statValueActive]}>
                {appData.sessions.filter((s: any) => s.checkOutTime === null).length}
              </Text>
              <Text style={styles.statLabel}>{t('profile.activeSessions')}</Text>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════
            MODALS - Glass Modals
            ═══════════════════════════════════════════════════════════ */}
        
        {/* Name Modal */}
        {nameModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{t('profile.updateYourName')}</Text>
              <Text style={styles.modalSubtitle}>{t('profile.enterFullName')}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t('profile.enterFullName')}
                placeholderTextColor={colors.textMuted}
                value={employeeName}
                onChangeText={setEmployeeNameInput}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={() => setNameModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirmButton} 
                  onPress={saveEmployeeName}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalConfirmText}>{t('common.save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Email Modal */}
        {emailModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{t('profile.updateYourEmail')}</Text>
              <Text style={styles.modalSubtitle}>{t('profile.enterEmailAddress')}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t('profile.enterEmailAddress')}
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={() => setEmailModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirmButton} 
                  onPress={saveEmail}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalConfirmText}>{t('common.save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Job Title Modal */}
        {jobTitleModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{t('profile.updateYourJobTitle')}</Text>
              <Text style={styles.modalSubtitle}>{t('profile.enterJobTitle')}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t('profile.enterJobTitle')}
                placeholderTextColor={colors.textMuted}
                value={jobTitle}
                onChangeText={setJobTitleInput}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={() => setJobTitleModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirmButton} 
                  onPress={saveJobTitle}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalConfirmText}>{t('common.save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Department Modal */}
        {departmentModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{t('profile.updateYourDepartment')}</Text>
              <Text style={styles.modalSubtitle}>{t('profile.enterDepartment')}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t('profile.enterDepartment')}
                placeholderTextColor={colors.textMuted}
                value={department}
                onChangeText={setDepartmentInput}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={() => setDepartmentModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirmButton} 
                  onPress={saveDepartment}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalConfirmText}>{t('common.save')}</Text>
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
    paddingBottom: 120, // Extra padding to ensure content is visible above tab bar
  },

  // ═══════════════════════════════════════════════════════════════
  // HEADER SECTION
  // ═══════════════════════════════════════════════════════════════
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  avatarGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 100,
    backgroundColor: colors.primaryGlow,
    opacity: 0.3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.bgCard,
    borderWidth: 2,
    borderColor: colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.neonGlowSubtle,
  },
  title: {
    fontSize: fonts.sizes.hero,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    letterSpacing: -1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  cardBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  cardBadgeText: {
    fontSize: fonts.sizes.xs,
    color: colors.primary,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Profile Row
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  profileRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  profileIconContainerSecondary: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  profileIconContainerTertiary: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  profileIconContainerQuaternary: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
  },
  profileInfo: {
    flex: 1,
  },
  profileLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  profileValue: {
    fontSize: fonts.sizes.md,
    color: colors.textPrimary,
    fontWeight: '500' as const,
  },
  profileRowRight: {
    marginLeft: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },

  // ═══════════════════════════════════════════════════════════════
  // STATS CARD
  // ═══════════════════════════════════════════════════════════════
  statsCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fonts.sizes.display,
    fontWeight: '900' as const,
    color: colors.textPrimary,
    fontFamily: 'monospace',
    marginBottom: spacing.xs,
  },
  statValueActive: {
    color: colors.primary,
  },
  statLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  modalInput: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    color: colors.textPrimary,
    fontSize: fonts.sizes.md,
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

export default ProfileScreen;
