import React,{useEffect} from 'react';
import {NativeBaseProvider, Text } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//screen import
import { HomeScreen } from './src/screen/Home';
import { IntermediaryScreen } from './src/screen/intermediary'
import { HouseScreen } from './src/screen/House';
import { SettingsScreen } from './src/screen/Setting';

import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as SQLite from "expo-sqlite";
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTable } from './src/dbHelper/db-service'

const Tab = createBottomTabNavigator();

async function openDatabase2(){
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require("./database.db")).uri,
    FileSystem.documentDirectory + 'SQLite/database.db'
  );
  return SQLite.openDatabase('database.db');
}

/**async function removeDatabase() {
    const sqlDir = FileSystem.documentDirectory + "SQLite/";
    await FileSystem.deleteAsync(sqlDir + "dbInStorage.sqlite", {idempotent: true});
}*/


//const db = openDatabase2()

const config = {
  dependencies: {
    'linear-gradient': LinearGradient
  }
};

export default function App() {

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('firstLaunch', value)
    } catch (e) {
      // saving error
    }
  }


  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('firstLaunch')
      if(value !== null) {
        console.log('db exist')
      }
      else{
        storeData('true')
        createTable().then((result) =>{
          console.log(result)
        }).catch(err => console.log(err))
      }
    } catch(e) {
      console.log('error',e)
    }
  }
  
  getData()

  useEffect(() => {

    (async () => {      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      console.log('Location permission granted', location);
    })();
  }, []);


  return (    
    <NativeBaseProvider config={config}>
      
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route})=> ({
            headerStyle: {
              backgroundColor: 'green',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontStyle: 'italic'
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Accueil') {
                iconName = focused
                  ? 'ios-home'
                  : 'ios-home-outline';
              }

              else if (route.name === 'Mes plantes') {
                iconName = focused ? 'ios-leaf' : 'ios-leaf-outline';
              }

              else if (route.name === 'Ma serre') {
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
