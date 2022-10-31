import * as React from 'react';
import {NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//screen import
import { HomeScreen } from './src/screen/Home';
import { IntermediaryScreen } from './src/screen/intermediary'

const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Accueil" component={HomeScreen} />
          <Tab.Screen name="Mes plantes" component={IntermediaryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}