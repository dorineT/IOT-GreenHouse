import * as React from 'react';
import {NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

//screen import
import { HomeScreen } from './src/screen/Home';
import { IntermediaryScreen } from './src/screen/intermediary'
import { HouseScreen } from './src/screen/House';
import { SettingsScreen } from './src/screen/Setting';

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
              }else if (route.name === 'Ma serre') {
                iconName = focused ? 'tree' : 'tree-outline';
                return <MaterialCommunityIcons name={iconName} size={size} color={color} />
              }
              else if (route.name === 'Paramètres') {
                iconName = focused ? 'ios-settings' : 'ios-settings-outline';            
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
          <Tab.Screen name="Ma serre" component={HouseScreen} />
          <Tab.Screen name='Paramètres' component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}