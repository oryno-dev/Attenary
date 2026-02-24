import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';

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
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      id="MainTabs"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="TimeClock"
        component={TimeClockScreen}
      />
      <Tab.Screen
        name="DailyLog"
        component={DailyLogScreen}
      />
      <Tab.Screen
        name="MonthlyReport"
        component={MonthlyReportScreen}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
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