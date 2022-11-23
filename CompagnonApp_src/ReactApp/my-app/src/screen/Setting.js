import React, {useEffect} from 'react';
import { Button, Text, View } from 'native-base';
import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location'

export function SettingsScreen({navigation}) {
  
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

  function wifi(){
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      console.log('Is connected?', state.details.ssid);
    });
  }
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Configuration pour accéder à votre serre</Text>
      <Button onPress={ () => wifi()} > WIFI informations</Button>
    </View>
  );
}