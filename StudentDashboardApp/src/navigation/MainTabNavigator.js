import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import NoticesScreen from '../screens/notices/NoticesScreen';
import JobsScreen from '../screens/jobs/JobsScreen';
import RoundsScreen from '../screens/rounds/RoundsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PlacementReportsScreen from '../screens/reports/PlacementReportsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const unreadNotices = useSelector(state => 
    state.notice.notices.filter(notice => !notice.isRead).length
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Notices') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Rounds') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Notices" 
        component={NoticesScreen}
        options={{
          tabBarBadge: unreadNotices > 0 ? unreadNotices : null,
          title: 'Notices'
        }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen}
        options={{ title: 'Job Opportunities' }}
      />
      <Tab.Screen 
        name="Rounds" 
        component={RoundsScreen}
        options={{ title: 'Interview Rounds' }}
      />
      <Tab.Screen 
        name="Reports" 
        component={PlacementReportsScreen}
        options={{ title: 'Placement Reports' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}