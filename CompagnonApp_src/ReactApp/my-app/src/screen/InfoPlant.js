import React,{useState} from 'react';
import { 
  View,
  Text, 
  Heading,
  VStack,
  Image,
  Center,
  Box,
  HStack,
  ScrollView,
Icon,
Divider
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap } from 'react-native-tab-view';
import {deletePlantFromHouse} from '../dbHelper/db-service'


export function InfoPlantScreen({route, navigation})  {
  const plante = route.params.item;

  async function deletePlant(){
    await deletePlantFromHouse(plante.plante_id)
    navigation.navigate('Détails',{ screen: 'Mes plantes'})    
  }

  const FirstRoute = () => (
    <ScrollView>
    <Box padding={7} margin={5} rounded="xl"  bg={["white"]} >
        
        <HStack  justifyContent="space-between">  
        <Heading> {plante.nom}</Heading>
        <Icon  size="8" color="warning.600" as={<Ionicons name="ios-trash" />} onPress={() =>deletePlant()}/>
        </HStack>
          
      <Text fontSize="md" italic>{plante.type}</Text>
      <VStack>
        <Center>
        <Image source={{
            uri: plante.image
          }} alt="Alternate Text" size="xl" />
        </Center>
        <Divider mt={5} mb={5}></Divider>
          
        <Text>{plante.description}</Text>
        
      <Divider mt={5}></Divider>

        <HStack space={3} marginTop={5}>        
          <Icon  size="9" color="primary.400" as={<Ionicons name="ios-water" />}/>       
          <Text>{plante.eau}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-thermometer-outline" size={34} color="red" />
          <Text>{plante.temperature}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-umbrella" size={34} color="grey" />
          <Text>{plante.humidite}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-filter" size={34} color="grey" />
          <Text>ph: {plante.ph}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-pin" size={34} color="grey" />
          <Text>{plante.terre}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-calendar-outline" size={34} color="grey" />
          <Text>Période de plantation: {plante.plantation}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-calendar-outline" size={34} color="grey" />
          <Text>Période de récolte: {plante.recolte}</Text>
        </HStack>


      </VStack>
    </Box>
  </ScrollView>
  );

  const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
  );

  const initialLayout = { width: Dimensions.get('window').width };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (   
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />    
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});