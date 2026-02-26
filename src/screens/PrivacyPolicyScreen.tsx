import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, fonts, shadows } from '../theme/colors';
import Svg, { Path, Circle } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';

// ═══════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════

const BackIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShieldIcon = ({ size = 48 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={colors.warning} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 12l2 2 4-4" stroke={colors.warning} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { t } = useLanguage();

  const sections = [
    {
      id: 'data-collection',
      titleKey: 'privacypolicy.dataCollection',
      contentKey: 'privacypolicy.dataCollectionText',
    },
    {
      id: 'local-storage',
      titleKey: 'privacypolicy.localStorage',
      contentKey: 'privacypolicy.localStorageText',
    },
    {
      id: 'no-account-required',
      titleKey: 'privacypolicy.noAccountRequired',
      contentKey: 'privacypolicy.noAccountRequiredText',
    },
    {
      id: 'export-data',
      titleKey: 'privacypolicy.dataExport',
      contentKey: 'privacypolicy.dataExportText',
    },
    {
      id: 'third-party',
      titleKey: 'privacypolicy.thirdPartyServices',
      contentKey: 'privacypolicy.thirdPartyServicesText',
    },
    {
      id: 'security',
      titleKey: 'privacypolicy.security',
      contentKey: 'privacypolicy.securityText',
    },
    {
      id: 'children',
      titleKey: 'privacypolicy.childrenPrivacy',
      contentKey: 'privacypolicy.childrenPrivacyText',
    },
    {
      id: 'changes',
      titleKey: 'privacypolicy.changesToPrivacyPolicy',
      contentKey: 'privacypolicy.changesToPrivacyPolicyText',
    },
  ];

  const highlights = [
    t('privacypolicy.highlightNoDataCollection'),
    t('privacypolicy.highlightNoExternalServers'),
    t('privacypolicy.highlightNoAccountRequired'),
    t('privacypolicy.highlightNoThirdPartyTracking'),
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgMain} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('privacypolicy.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon Section */}
        <View style={styles.iconSection}>
          <View style={styles.iconContainer}>
            <ShieldIcon size={48} />
          </View>
          <Text style={styles.title}>{t('privacypolicy.yourPrivacyMatters')}</Text>
          <Text style={styles.subtitle}>
            {t('privacypolicy.lastUpdated')}
          </Text>
        </View>

        {/* Highlights */}
        <View style={styles.highlightsCard}>
          {highlights.map((highlight, index) => (
            <View key={index} style={styles.highlightItem}>
              <View style={styles.highlightIcon}>
                <CheckIcon size={14} />
              </View>
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.introText}>
              {t('privacypolicy.intro')}
            </Text>
          </View>
        </View>

        {/* Policy Sections */}
        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{t(section.titleKey)}</Text>
            <View style={styles.card}>
              <Text style={styles.sectionContent}>{t(section.contentKey)}</Text>
            </View>
          </View>
        ))}

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacypolicy.contactUs')}</Text>
          <View style={styles.card}>
            <Text style={styles.sectionContent}>
              {t('privacypolicy.contactUsText')}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('privacypolicy.footer')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl + spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.bgMain,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.huge,
  },
  iconSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.bgGlassLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
  highlightsCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highlightIcon: {
    marginRight: spacing.xs,
  },
  highlightText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium as any,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  introText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionContent: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  footerText: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default PrivacyPolicyScreen;
