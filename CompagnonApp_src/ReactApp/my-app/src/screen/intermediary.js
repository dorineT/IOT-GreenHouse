import * as React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { PlantsScreen } from './Plants';
import { InfoPlantScreen } from './InfoPlant';
import { AddPlantScreen } from './AddPlant';

const Stack = createNativeStackNavigator();

export function IntermediaryScreen({ navigation }) {
    return (
        <Stack.Navigator>
          <Stack.Screen
            name="plantes"
            component={PlantsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Détails" component={InfoPlantScreen} />
          <Stack.Screen name="Nouvelle plante" component={AddPlantScreen} />
        </Stack.Navigator>
   );
}