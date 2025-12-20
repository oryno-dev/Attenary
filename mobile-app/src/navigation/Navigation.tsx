import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import TimeClockScreen from '../screens/TimeClockScreen';
import DailyLogScreen from '../screens/DailyLogScreen';
import MonthlyReportScreen from '../screens/MonthlyReportScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ManageScreen from '../screens/ManageScreen';

// Components
import CheckInModal from '../components/CheckInModal';
import CheckOutModal from '../components/CheckOutModal';
import PINModal from '../components/PINModal';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#818cf8',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#334155',
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#f1f5f9',
      }}
    >
      <Tab.Screen 
        name="TimeClock" 
        component={TimeClockScreen}
        options={{
          title: 'Time Clock',
        }}
      />
      <Tab.Screen 
        name="DailyLog" 
        component={DailyLogScreen}
        options={{
          title: 'Daily Log',
        }}
      />
      <Tab.Screen 
        name="MonthlyReport" 
        component={MonthlyReportScreen}
        options={{
          title: 'Monthly Report',
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          title: 'History',
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
        }}
      />
      <Tab.Screen 
        name="Manage" 
        component={ManageScreen}
        options={{
          title: 'Manage',
        }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f172a',
          },
          headerTintColor: '#f1f5f9',
          contentStyle: {
            backgroundColor: '#0f172a',
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
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
          name="PINModal" 
          component={PINModal}
          options={{ 
            presentation: 'transparentModal',
            headerTitle: 'Enter PIN',
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