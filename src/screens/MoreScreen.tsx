import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, fonts, shadows, glassStyles } from '../theme/colors';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';

// ═══════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════

const InfoIcon = ({ size = 24 }: { size?: number }) => (
  <Image 
    source={require('../../assets/icons/about.png')} 
    style={{ width: size, height: size }} 
    resizeMode="contain"
  />
);

const FeedbackIcon = ({ size = 24 }: { size?: number }) => (
  <Image 
    source={require('../../assets/icons/feedback.png')} 
    style={{ width: size, height: size }} 
    resizeMode="contain"
  />
);

const ShieldIcon = ({ size = 24 }: { size?: number }) => (
  <Image 
    source={require('../../assets/icons/privacy.png')} 
    style={{ width: size, height: size }} 
    resizeMode="contain"
  />
);

const CoffeeIcon = ({ size = 24 }: { size?: number }) => (
  <Image 
    source={require('../../assets/icons/buymeacoffee.png')} 
    style={{ width: size, height: size }} 
    resizeMode="contain"
  />
);

const GlobeIcon = ({ size = 24 }: { size?: number }) => (
  <Image 
    source={require('../../assets/icons/Language.png')} 
    style={{ width: size, height: size }} 
    resizeMode="contain"
  />
);

const ChevronRightIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Navigation item type
interface NavItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  screen: string;
}

const MoreScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'languages',
      title: t('more.languages'),
      subtitle: t('more.languagesSubtitle'),
      icon: <GlobeIcon size={32} />,
      screen: 'Languages',
    },
    {
      id: 'about',
      title: t('more.about'),
      subtitle: t('more.aboutSubtitle'),
      icon: <InfoIcon size={32} />,
      screen: 'About',
    },
    // Feedback temporarily hidden - see issue review for details
    // {
    //   id: 'feedbacks',
    //   title: t('more.feedbacks'),
    //   subtitle: t('more.feedbacksSubtitle'),
    //   icon: <FeedbackIcon size={24} />,
    //   screen: 'Feedbacks',
    // },
    {
      id: 'privacy',
      title: t('more.privacy'),
      subtitle: t('more.privacySubtitle'),
      icon: <ShieldIcon size={32} />,
      screen: 'PrivacyPolicy',
    },
    {
      id: 'coffee',
      title: t('more.coffee'),
      subtitle: t('more.coffeeSubtitle'),
      icon: <CoffeeIcon size={32} />,
      screen: 'BuyMeCoffee',
    },
  ];

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgMain} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('more.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('more.subtitle')}</Text>
      </View>

      {/* Navigation Items */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('common.settings')}</Text>
          <View style={styles.cardContainer}>
            {navItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navItem,
                  index === 0 && styles.navItemFirst,
                  index === navItems.length - 1 && styles.navItemLast,
                ]}
                onPress={() => handleNavigation(item.screen)}
                activeOpacity={0.7}
              >
                <View style={styles.navItemIcon}>
                  {item.icon}
                </View>
                <View style={styles.navItemContent}>
                  <Text style={styles.navItemTitle}>{item.title}</Text>
                  <Text style={styles.navItemSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRightIcon size={20} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Attenary</Text>
          <Text style={styles.footerSubtext}>Time Tracking Made Simple</Text>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl + spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.bgMain,
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
  sectionTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  cardContainer: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navItemFirst: {
    borderTopLeftRadius: borderRadius.card,
    borderTopRightRadius: borderRadius.card,
  },
  navItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: borderRadius.card,
    borderBottomRightRadius: borderRadius.card,
  },
  navItemIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgGlassLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  navItemContent: {
    flex: 1,
  },
  navItemTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.medium as any,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  navItemSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  footerText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium as any,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  footerSubtext: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
});

export default MoreScreen;
