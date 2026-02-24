import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { Text, View, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme/colors';
import Svg, { Path, Circle } from 'react-native-svg';

// SVG Icons using react-native-svg
const ClockIcon = ({ color = '#94a3b8', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path 
      d="M12 7v5l3 3" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {filled && (
      <Circle cx="12" cy="12" r="9" fill={color} opacity="0.1" />
    )}
  </Svg>
);

const DocumentIcon = ({ color = '#94a3b8', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M4 4h7l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path d="M10 9h4M10 13h4M10 17h2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {filled && (
      <Path 
        d="M4 4h7l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" 
        fill={color} 
        opacity="0.1"
      />
    )}
  </Svg>
);

const ChartIcon = ({ color = '#94a3b8', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 3v18h18" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M7 14l3 3 4-6 4 4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {filled && (
      <Path 
        d="M7 14l3 3 4-6 4 4" 
        fill={color} 
        opacity="0.1"
      />
    )}
  </Svg>
);

const HistoryIcon = ({ color = '#94a3b8', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 8v4l3 3" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path 
      d="M12 3a9 9 0 0 1 9 9" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    {filled && (
      <Circle cx="12" cy="12" r="9" fill={color} opacity="0.1" />
    )}
  </Svg>
);

const AnalyticsIcon = ({ color = '#94a3b8', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 3v18h18" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M7 16l2-2 4 4 6-6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {filled && (
      <Path 
        d="M7 16l2-2 4 4 6-6" 
        fill={color} 
        opacity="0.1"
      />
    )}
  </Svg>
);

const UserIcon = ({ color = '#94a3b8', size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M20 21v-2a8 8 0 1 0-16 0v2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
    {filled && (
      <Path 
        d="M20 21v-2a8 8 0 1 0-16 0v2" 
        fill={color} 
        opacity="0.1"
      />
    )}
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
        tabBarActiveTintColor: '#818cf8',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#334155',
          paddingBottom: 12,
          paddingTop: 12,
          height: 70,
          borderTopWidth: 1,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          borderRadius: 20,
          marginHorizontal: 16,
          marginBottom: 16,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 4,
          paddingVertical: 8,
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
            <ClockIcon color={focused ? '#818cf8' : '#94a3b8'} size={28} filled={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="DailyLog"
        component={DailyLogScreen}
        options={{
          title: 'Daily Log',
          tabBarIcon: ({ color, size, focused }) => (
            <DocumentIcon color={focused ? '#818cf8' : '#94a3b8'} size={28} filled={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="MonthlyReport"
        component={MonthlyReportScreen}
        options={{
          title: 'Monthly',
          tabBarIcon: ({ color, size, focused }) => (
            <ChartIcon color={focused ? '#818cf8' : '#94a3b8'} size={28} filled={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: ({ color, size, focused }) => (
            <HistoryIcon color={focused ? '#818cf8' : '#94a3b8'} size={28} filled={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size, focused }) => (
            <AnalyticsIcon color={focused ? '#818cf8' : '#94a3b8'} size={28} filled={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <UserIcon color={focused ? '#818cf8' : '#94a3b8'} size={28} filled={focused} />
          ),
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;