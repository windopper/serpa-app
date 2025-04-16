import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabLayout() {
  const tint = useThemeColor({}, 'tint')
  const tabIconDefault = useThemeColor({}, 'tabIconDefault')
  const border = useThemeColor({}, 'border')
  const card = useThemeColor({}, 'card')

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: { 
          // display: 'none', // 바텀 탭바 보이게 설정
          height: 85,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: card,
          borderTopColor: border,
        },
        headerTitle: '', // 헤더 타이틀 비우기
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'New Chat',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-inquiries"
        options={{
          title: 'My Inqueries',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="faq"
        options={{
          title: 'FAQ',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="questionmark.circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
