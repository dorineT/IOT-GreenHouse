import * as React from 'react';
import { Text, View } from 'native-base';

export function HouseScreen({navigation}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Informations de votre serre !</Text>
    </View>
  );
}