import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, fonts, shadows } from '../theme/colors';
import Svg, { Path } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';

// ═══════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════

const BackIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CoffeeIcon = ({ size = 80 }: { size?: number }) => (
  <Image
    source={require('../../assets/icons/buymeacoffee.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

const HeartIcon = ({ size = 24 }: { size?: number }) => (
  <Image
    source={require('../../assets/icons/buymeacoffee.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

const ExternalLinkIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke={colors.bgMain} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BuyMeCoffeeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { t } = useLanguage();

  const handleBuyCoffee = () => {
    const url = 'https://buymeacoffee.com/attenary';
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(t('buymecoffee.error'), t('buymecoffee.unableToOpenLink'));
      }
    });
  };

  const supportOptions = [
    {
      id: 1,
      title: t('buymecoffee.oneTimeSupport'),
      description: t('buymecoffee.oneTimeDescription'),
      icon: '☕',
    },
    {
      id: 2,
      title: t('buymecoffee.monthlySupport'),
      description: t('buymecoffee.monthlyDescription'),
      icon: '⭐',
    },
    {
      id: 3,
      title: t('buymecoffee.shareApp'),
      description: t('buymecoffee.shareDescription'),
      icon: '📢',
    },
  ];

  const benefits = [
    t('buymecoffee.benefit1'),
    t('buymecoffee.benefit2'),
    t('buymecoffee.benefit3'),
    t('buymecoffee.benefit4'),
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
        <Text style={styles.headerTitle}>{t('buymecoffee.supportDevelopment')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <CoffeeIcon size={90} />
          </View>
          <Text style={styles.title}>{t('buymecoffee.heroTitle')}</Text>
          <Text style={styles.subtitle}>
            {t('buymecoffee.heroSubtitle')}
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('buymecoffee.whySupport')}</Text>
          <View style={styles.card}>
            {benefits.map((benefit, index) => (
              <View 
                key={index}
                style={[
                  styles.benefitItem,
                  index < benefits.length - 1 && styles.benefitItemBorder
                ]}
              >
                <View style={styles.benefitIcon}>
                  <HeartIcon size={16} />
                </View>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Support Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('buymecoffee.waysToSupport')}</Text>
          {supportOptions.map((option) => (
            <View key={option.id} style={styles.optionCard}>
              <View style={styles.optionHeader}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text style={styles.optionTitle}>{option.title}</Text>
              </View>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          ))}
        </View>

        {/* CTA Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.coffeeButton}
            onPress={handleBuyCoffee}
            activeOpacity={0.8}
          >
            <CoffeeIcon size={24} />
            <Text style={styles.coffeeButtonText}>{t('buymecoffee.ctaButton')}</Text>
            <ExternalLinkIcon size={16} />
          </TouchableOpacity>
        </View>

        {/* Message */}
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            {t('buymecoffee.communityMessage')}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('buymecoffee.footer')}
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
    borderTopWidth: 3,
    borderTopColor: colors.success,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  benefitItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  benefitText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    flex: 1,
  },
  optionCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.card,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  optionIcon: {
    fontSize: fonts.sizes.xl,
    marginRight: spacing.sm,
  },
  optionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textPrimary,
  },
  optionDescription: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  coffeeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderRadius: borderRadius.button,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    ...shadows.button,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  coffeeButtonText: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold as any,
    color: colors.bgMain,
    marginHorizontal: spacing.md,
  },
  messageCard: {
    backgroundColor: colors.success + '15',
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.success + '40',
    padding: spacing.lg,
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  messageText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
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

export default BuyMeCoffeeScreen;
