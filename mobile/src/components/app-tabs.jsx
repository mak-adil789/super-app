import { Tabs } from 'expo-router';
import { useColorScheme, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundElement,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="quran/index"
        options={{
          title: 'Quran',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ai/chat"
        options={{
          title: 'Ask AI',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasbeeh/index"
        options={{
          title: 'Tasbeeh',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="finger-print" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="ai/ocr-scanner" options={{ href: null }} />
      <Tabs.Screen name="auth/login" options={{ href: null }} />
      <Tabs.Screen name="auth/register" options={{ href: null }} />
      <Tabs.Screen name="duas/index" options={{ href: null }} />
      <Tabs.Screen name="duas/[category]" options={{ href: null }} />
      <Tabs.Screen name="hajj/guide" options={{ href: null }} />
      <Tabs.Screen name="mosque/locator" options={{ href: null }} />
      <Tabs.Screen name="prayer/qibla" options={{ href: null }} />
      <Tabs.Screen name="profile/family" options={{ href: null }} />
      <Tabs.Screen name="quran/[id]" options={{ href: null }} />
      <Tabs.Screen name="ramadan/index" options={{ href: null }} />
      <Tabs.Screen name="zakat/calculator" options={{ href: null }} />
    </Tabs>
  );
}
