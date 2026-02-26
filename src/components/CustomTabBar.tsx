import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Platform, Pressable, Text } from 'react-native';
import Svg, { Path, Circle, Line, Polyline } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';

// Navbar colors - Green Dark Theme
const NAVBAR_COLORS = {
  activeContainer: 'rgba(30, 80, 50, 0.6)',   // Dark green pill background
  activeIcon: '#4ade80',        // Bright green text/icon
  inactiveIcon: '#888',         // Inactive grey
  navbarBackground: '#111111',  // Slightly lighter black
  navbarBorder: '#222',         // Border color
  hoverBackground: '#1a1a1a',   // Hover state background
  iconFill: 'rgba(74, 222, 128, 0.2)', // Subtle fill for active icons
};

// Animation duration matching the CSS transition (0.4s = 400ms)
const ANIMATION_DURATION = 400;

// Tab Item Component with Animation
interface TabItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ icon, label, isActive, onPress }) => {
  // Animated values for text expansion
  const textWidthAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const marginLeftAnim = useRef(new Animated.Value(0)).current;
  const paddingRightAnim = useRef(new Animated.Value(10)).current;
  
  // Track hover state for non-active items
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Parallel animations for smooth transition matching CSS
    Animated.parallel([
      // Opacity animation for text
      Animated.timing(opacityAnim, {
        toValue: isActive ? 1 : 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      }),
      // Margin left animation for text
      Animated.timing(marginLeftAnim, {
        toValue: isActive ? 10 : 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      }),
      // Padding right animation for container
      Animated.timing(paddingRightAnim, {
        toValue: isActive ? 20 : 10,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isActive]);

  // Determine background color based on state
  const getBackgroundColor = () => {
    if (isActive) return NAVBAR_COLORS.activeContainer;
    if (isHovered) return NAVBAR_COLORS.hoverBackground;
    return 'transparent';
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.tabItemTouchable,
        pressed && styles.tabItemPressed,
      ]}
    >
      <Animated.View
        style={[
          styles.tabItem,
          {
            backgroundColor: getBackgroundColor(),
            paddingRight: paddingRightAnim,
          },
        ]}
      >
        {icon}
        {isActive && (
          <Animated.Text
            style={[
              styles.navText,
              {
                opacity: opacityAnim,
                marginLeft: marginLeftAnim,
                color: NAVBAR_COLORS.activeIcon,
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

// Icon Components matching the HTML design
const HomeIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? NAVBAR_COLORS.iconFill : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const SearchIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

const StatsIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? NAVBAR_COLORS.iconFill : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <Path d="M22 12A10 10 0 0 0 12 2v10z" />
  </Svg>
);

const HistoryIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? NAVBAR_COLORS.iconFill : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const ProfileIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? NAVBAR_COLORS.iconFill : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

// Clock Icon for Time Clock
const ClockIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? NAVBAR_COLORS.iconFill : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

// Document Icon for Daily Log
const DocumentIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? NAVBAR_COLORS.iconFill : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
    <Polyline points="10 9 9 9 8 9" />
  </Svg>
);

// Chart Icon for Monthly Report
const ChartIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? NAVBAR_COLORS.iconFill : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="20" x2="18" y2="10" />
    <Line x1="12" y1="20" x2="12" y2="4" />
    <Line x1="6" y1="20" x2="6" y2="14" />
  </Svg>
);

// Analytics Icon
const AnalyticsIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? NAVBAR_COLORS.iconFill : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <Path d="M22 12A10 10 0 0 0 12 2v10z" />
  </Svg>
);

// User Icon for Profile
const UserIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? NAVBAR_COLORS.iconFill : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

// More Icon
const MoreIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? NAVBAR_COLORS.iconFill : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="5" r="1.5" />
    <Circle cx="12" cy="12" r="1.5" />
    <Circle cx="12" cy="19" r="1.5" />
  </Svg>
);

// Tab configuration
const getTabs = (t: (key: string) => string) => [
  { name: 'TimeClock', labelKey: 'nav.timeclock', icon: HomeIcon },
  { name: 'DailyLog', labelKey: 'nav.dailylog', icon: DocumentIcon },
  { name: 'MonthlyReport', labelKey: 'nav.monthlyreport', icon: ChartIcon },
  { name: 'History', labelKey: 'nav.history', icon: HistoryIcon },
  { name: 'Analytics', labelKey: 'nav.analytics', icon: AnalyticsIcon },
  { name: 'Profile', labelKey: 'nav.profile', icon: UserIcon },
  { name: 'More', labelKey: 'nav.more', icon: MoreIcon },
];

interface CustomTabBarProps {
  state: any;
  navigation: any;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, navigation }) => {
  const { t } = useLanguage();
  const tabs = getTabs(t);
  
  return (
    <View style={styles.navbar}>
      {state.routes.map((route: any, index: number) => {
        const { name } = route;
        const tab = tabs.find(t => t.name === name);
        if (!tab) return null;

        const isFocused = state.index === index;
        const IconComponent = tab.icon;
        const color = isFocused ? NAVBAR_COLORS.activeIcon : NAVBAR_COLORS.inactiveIcon;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(name);
          }
        };

        return (
          <TabItem
            key={name}
            icon={<IconComponent color={color} filled={isFocused} />}
            label={t(tab.labelKey)}
            isActive={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: NAVBAR_COLORS.navbarBackground,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: NAVBAR_COLORS.navbarBorder,
    alignItems: 'center',
    justifyContent: 'space-between',
    // Subtle green glow shadow matching CSS
    ...Platform.select({
      ios: {
        shadowColor: '#4ade80',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 30,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  tabItemTouchable: {
    // Container for touch handling
  },
  tabItemPressed: {
    opacity: 0.8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 30, // Pill shape matching CSS border-radius: 30px
  },
  navText: {
    fontWeight: '600',
    fontSize: 14,
    maxWidth: 100, // Matching CSS max-width: 100px
  },
});

export default CustomTabBar;
