import * as React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { PlantsScreen } from './Plants';
import { InfoPlantScreen } from './InfoPlant';

const Stack = createNativeStackNavigator();

export function IntermediaryScreen({ navigation }) {
    return (
        <Stack.Navigator>
          <Stack.Screen
            name="plantes"
            component={PlantsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="InfoPlante" component={InfoPlantScreen} />
        </Stack.Navigator>
   );
}