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
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors, spacing, borderRadius, fonts, shadows } from '../theme/colors';
import { useLanguage, Language } from '../context/LanguageContext';

// ═══════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════

const GlobeIcon = ({ size = 24, color = colors.primary }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ size = 20, color = colors.success }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BackIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ═══════════════════════════════════════════════════════════════════
// LANGUAGE DATA
// ═══════════════════════════════════════════════════════════════════

interface LanguageOption {
  code: Language;
  name: string;
  subtitle: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    subtitle: 'Left to right (LTR)',
    flag: '🇺🇸',
  },
  {
    code: 'ar',
    name: 'العربية',
    subtitle: 'Right to left (RTL)',
    flag: '🇸🇦',
  },
];

const LanguagesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { language: currentLanguage, setLanguage, t, isRTL } = useLanguage();

  const handleLanguageSelect = async (langCode: Language) => {
    await setLanguage(langCode);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgMain} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <BackIcon size={24} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{t('languages.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('languages.subtitle')}</Text>
        </View>
      </View>

      {/* Language Options */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.cardContainer}>
            {languageOptions.map((option, index) => {
              const isSelected = currentLanguage === option.code;
              return (
                <TouchableOpacity
                  key={option.code}
                  style={[
                    styles.languageItem,
                    index === 0 && styles.languageItemFirst,
                    index === languageOptions.length - 1 && styles.languageItemLast,
                    isSelected && styles.languageItemSelected,
                  ]}
                  onPress={() => handleLanguageSelect(option.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageItemLeft}>
                    <View style={[
                      styles.flagContainer,
                      isSelected && styles.flagContainerSelected,
                    ]}>
                      <Text style={styles.flagEmoji}>{option.flag}</Text>
                    </View>
                    <View style={styles.languageItemContent}>
                      <View style={styles.languageNameRow}>
                        <Text style={[
                          styles.languageName,
                          isSelected && styles.languageNameSelected,
                        ]}>
                          {option.name}
                        </Text>
                        {isSelected && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>{t('languages.current')}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.languageSubtitle}>{option.subtitle}</Text>
                    </View>
                  </View>
                  {isSelected && (
                    <CheckIcon size={24} color={colors.success} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <GlobeIcon size={24} color={colors.info} />
          <Text style={styles.infoText}>
            {currentLanguage === 'ar' 
              ? 'سيؤدي تغيير اللغة إلى إعادة تحميل التطبيق لتطبيق التغييرات.'
              : 'Changing language will reload the app to apply the changes.'}
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl + spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.bgMain,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    ...shadows.card,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fonts.sizes.hero,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textMuted,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  cardContainer: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageItemFirst: {
    borderTopLeftRadius: borderRadius.card,
    borderTopRightRadius: borderRadius.card,
  },
  languageItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: borderRadius.card,
    borderBottomRightRadius: borderRadius.card,
  },
  languageItemSelected: {
    backgroundColor: colors.bgGlassLight,
  },
  languageItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgMain,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  flagContainerSelected: {
    backgroundColor: colors.primary + '20',
  },
  flagEmoji: {
    fontSize: 24,
  },
  languageItemContent: {
    flex: 1,
  },
  languageNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  languageName: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.medium as any,
    color: colors.textPrimary,
  },
  languageNameSelected: {
    color: colors.primary,
  },
  languageSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
  currentBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  currentBadgeText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium as any,
    color: colors.success,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.info + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.info + '30',
  },
  infoText: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: colors.info,
    marginLeft: spacing.md,
    lineHeight: 20,
  },
});

export default LanguagesScreen;
