import React from "react";
import { View, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";
import { useNavigation } from '@react-navigation/native';
import { useSession } from "@/context/ctx";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { signOut, session } = useSession();

  const HeaderRight = () => (
    <Pressable onPress={() => signOut()} style={styles.logoutButton}>
      <MaterialIcons name="location-exit" color="#fafafa" size={30} />
    </Pressable>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#1BB6C8" style="light" />
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#1699B4' },
          headerTintColor: '#fafafa',
          headerRight: HeaderRight,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "APP Mallon",
            tabBarIcon: ({ color, focused, size }) => {
              if (focused) {
                return <MaterialIcons name="home-circle" color="#1BB6C8" size={35} />
              }
              return <MaterialIcons name="home-circle-outline" color={color} size={size} />
            }
          }}
        />
        <Tabs.Screen
          name="scm/index"
          options={{
            title: "SCM",
            tabBarIcon: ({ color, focused, size }) => {
              if (focused) {
                return <Ionicons name="ticket" color="#1BB6C8" size={35} />
              }
              return <Ionicons name="ticket-outline" color={color} size={size} />
            }
          }}
        />
        <Tabs.Screen
          name="indicadores"
          options={{
            title: "Indicadores",
            tabBarIcon: ({ color, focused, size }) => {
              if (focused) {
                return <Ionicons name="bar-chart" color="#1BB6C8" size={35} />
              }
              return <Ionicons name="bar-chart-outline" color={color} size={size} />
            }
          }}
        />
        <Tabs.Screen
          name="novos"
          options={{
            title: "Novos",
            tabBarIcon: ({ color, focused, size }) => {
              if (focused) {
                return <MaterialIcons name="truck-check" color="#1BB6C8" size={35} />
              }
              return <MaterialIcons name="truck-check-outline" color={color} size={size} />
            }
          }}
        />
        <Tabs.Screen
          name="usados"
          options={{
            title: "Usados",
            tabBarIcon: ({ color, focused, size }) => {
              if (focused) {
                return <MaterialIcons name="truck" color="#1BB6C8" size={35} />
              }
              return <MaterialIcons name="truck-outline" color={color} size={size} />
            }
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 20,
  },
  logoutText: {
    color: '#fafafa',
    fontSize: 16,
  },
});
