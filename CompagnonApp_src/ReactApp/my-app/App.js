import * as React from 'react';
import {NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

//screen import
import { HomeScreen } from './src/screen/Home';
import { IntermediaryScreen } from './src/screen/intermediary'

const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route})=> ({
            headerStyle: {
              backgroundColor: '#84cc16',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Accueil') {
                iconName = focused
                  ? 'ios-home'
                  : 'ios-home-outline';
              } else if (route.name === 'Mes plantes') {
                iconName = focused ? 'ios-leaf' : 'ios-leaf-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'green',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Accueil" component={HomeScreen} />
          <Tab.Screen name="Mes plantes" component={IntermediaryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}