import * as React from 'react';
import { Text, View } from 'native-base';

export function SettingsScreen({navigation}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Configuration pour accéder à votre serre</Text>
    </View>
  );
}