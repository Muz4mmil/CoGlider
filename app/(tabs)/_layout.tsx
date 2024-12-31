import React from 'react';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface TabIconProps {
  name: string;
  focused: boolean;
  iconName: string;
}

const TabIcon = ({ name, focused, iconName }: TabIconProps) => {
  return (
    <View className="w-20 gap-1 items-center justify-center">
      <View className={`${focused ? 'bg-[#C8E9FD]' : 'bg-[#f7fcff]'} w-[66px] rounded-full py-1 flex items-center justify-center`}>
        {focused ?
          <MaterialCommunityIcons name={iconName as any} size={26} color="black" />
          : <MaterialCommunityIcons name={`${iconName}-outline` as any} size={26} color="black" />}
      </View>
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-sm`}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 72,
            paddingBottom: 10,
            paddingTop: 16,
            shadowColor: 'transparent',
            backgroundColor: '#f7fcff',
          },
          tabBarButton: (props) => (
            <TouchableWithoutFeedback {...props}>
              <View className='flex-1 items-center mt-[5px]'>
                {props.children}
              </View>
            </TouchableWithoutFeedback>
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon name="Find" focused={focused} iconName="map-marker-account" />
            ),
          }}
        />
        <Tabs.Screen
          name="my-chats"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon name="My Chats" focused={focused} iconName="message" />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="requests"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="Requests"
                focused={focused}
                iconName="account-multiple-plus"
              />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon name="Profile" focused={focused} iconName="account-cog" />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="dark" />
    </>
  );
};

export default TabsLayout;
