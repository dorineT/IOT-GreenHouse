import * as React from 'react';
import { Text, View } from 'native-base';

export function InfoPlantScreen({route}) {
  const id = route.params.id;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{JSON.stringify(id)}</Text>
    </View>
  );
}