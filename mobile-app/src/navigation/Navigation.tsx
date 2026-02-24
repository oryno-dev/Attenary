import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { colors, fonts } from '../theme/colors';
import Svg, { Path, Circle, Rect, G, Defs, RadialGradient, Stop } from 'react-native-svg';

// Modern Icons with green active box style
const ClockIcon = ({ color = '#64748b', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <Rect x="-6" y="-6" width="36" height="36" rx="12" fill="#22c55e" />
    ) : null}
    <Circle 
      cx="12" cy="12" r="7" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2" 
      fill={filled ? "none" : "none"}
    />
    <Path 
      d="M12 7v5l3 2" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const DocumentIcon = ({ color = '#64748b', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <Rect x="-6" y="-6" width="36" height="36" rx="12" fill="#22c55e" />
    ) : null}
    <Path 
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M14 2v6h6M16 13H8M16 17H8M10 9H8" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ChartIcon = ({ color = '#64748b', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <Rect x="-6" y="-6" width="36" height="36" rx="12" fill="#22c55e" />
    ) : null}
    <Path 
      d="M18 20V10M12 20V4M6 20v-6" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const HistoryIcon = ({ color = '#64748b', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <Rect x="-6" y="-6" width="36" height="36" rx="12" fill="#22c55e" />
    ) : null}
    <Circle 
      cx="12" cy="12" r="8" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2"
    />
    <Path 
      d="M12 8v4l2 2" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M21 3v5h-5" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const AnalyticsIcon = ({ color = '#64748b', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <Rect x="-6" y="-6" width="36" height="36" rx="12" fill="#22c55e" />
    ) : null}
    <Path 
      d="M21 21H4.6c-.56 0-.84 0-1.05-.11a1 1 0 0 1-.44-.44C3 20.24 3 19.96 3 19.4V3" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M7 14l4-4 4 4 6-6" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Circle cx="17" cy="7" r="2" fill={filled ? "#fff" : color} />
  </Svg>
);

const UserIcon = ({ color = '#64748b', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <Rect x="-6" y="-6" width="36" height="36" rx="12" fill="#22c55e" />
    ) : null}
    <Circle 
      cx="12" cy="8" r="4" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2"
    />
    <Path 
      d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" 
      stroke={filled ? "#fff" : color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const MoreIcon = ({ color = '#64748b', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <Rect x="-6" y="-6" width="36" height="36" rx="12" fill="#22c55e" />
    ) : null}
    <Circle cx="12" cy="6" r="1.5" fill={filled ? "#fff" : color} />
    <Circle cx="12" cy="12" r="1.5" fill={filled ? "#fff" : color} />
    <Circle cx="12" cy="18" r="1.5" fill={filled ? "#fff" : color} />
  </Svg>
);

// Screens
import TimeClockScreen from '../screens/TimeClockScreen';
import DailyLogScreen from '../screens/DailyLogScreen';
import MonthlyReportScreen from '../screens/MonthlyReportScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ManageScreen from '../screens/ManageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MoreScreen from '../screens/MoreScreen';
import AboutScreen from '../screens/AboutScreen';
import FeedbacksScreen from '../screens/FeedbacksScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import BuyMeCoffeeScreen from '../screens/BuyMeCoffeeScreen';

// Components
import CheckInModal from '../components/CheckInModal';
import CheckOutModal from '../components/CheckOutModal';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          borderTopWidth: 1,
          paddingBottom: 12,
          paddingTop: 10,
          height: 72,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.25,
          shadowRadius: 15,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 2,
          paddingVertical: 4,
        },
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#f1f5f9',
        headerTitleStyle: {
          fontSize: fonts.sizes.lg,
          fontWeight: fonts.weights.semibold as any,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="TimeClock"
        component={TimeClockScreen}
        options={{
          title: 'SAS',
          tabBarIcon: ({ color, size, focused }) => (
            <ClockIcon color={focused ? '#22c55e' : '#64748b'} size={26} filled={focused} />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      />
      <Tab.Screen
        name="DailyLog"
        component={DailyLogScreen}
        options={{
          title: 'Daily Log',
          tabBarIcon: ({ color, size, focused }) => (
            <DocumentIcon color={focused ? '#22c55e' : '#64748b'} size={26} filled={focused} />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      />
      <Tab.Screen
        name="MonthlyReport"
        component={MonthlyReportScreen}
        options={{
          title: 'Monthly',
          tabBarIcon: ({ color, size, focused }) => (
            <ChartIcon color={focused ? '#22c55e' : '#64748b'} size={26} filled={focused} />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: ({ color, size, focused }) => (
            <HistoryIcon color={focused ? '#22c55e' : '#64748b'} size={26} filled={focused} />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size, focused }) => (
            <AnalyticsIcon color={focused ? '#22c55e' : '#64748b'} size={26} filled={focused} />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <UserIcon color={focused ? '#22c55e' : '#64748b'} size={26} filled={focused} />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          title: 'More',
          tabBarIcon: ({ color, size, focused }) => (
            <MoreIcon color={focused ? '#22c55e' : '#64748b'} size={26} filled={focused} />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const { appData } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(!appData.onboardingCompleted);

  useEffect(() => {
    setShowOnboarding(!appData.onboardingCompleted);
  }, [appData.onboardingCompleted]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        id="RootStack"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f172a',
          },
          headerTintColor: '#f1f5f9',
          contentStyle: {
            backgroundColor: '#0f172a',
          },
          headerShown: false,
        }}
      >
        {showOnboarding ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen 
          name="CheckInModal" 
          component={CheckInModal}
          options={{ 
            presentation: 'transparentModal',
            headerTitle: 'Check In',
            headerStyle: {
              backgroundColor: '#0f172a',
            },
            headerTintColor: '#f1f5f9',
          }}
        />
        <Stack.Screen 
          name="CheckOutModal" 
          component={CheckOutModal}
          options={{ 
            presentation: 'transparentModal',
            headerTitle: 'Check Out',
            headerStyle: {
              backgroundColor: '#0f172a',
            },
            headerTintColor: '#f1f5f9',
          }}
        />
        <Stack.Screen 
          name="About" 
          component={AboutScreen}
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Feedbacks" 
          component={FeedbacksScreen}
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="PrivacyPolicy" 
          component={PrivacyPolicyScreen}
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="BuyMeCoffee" 
          component={BuyMeCoffeeScreen}
          options={{ 
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;