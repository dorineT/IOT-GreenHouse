import * as React from 'react';
import { 
  Text, 
  Container,
  Heading,
  VStack,
  Image,
  Center,
  Box,
  HStack,
  Spacer,  
  ScrollView,
Icon,
Divider
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';




export function InfoPlantScreen({route}) {
  const plante = route.params.item;
  return (
    <ScrollView>
      <Box padding={7} margin={5} rounded="xl"  bg={["white"]} >
        <Heading>{plante.nom}</Heading>
        <Text fontSize="md" italic>{plante.type}</Text>
        <VStack>
          <Center>
          <Image source={{
              uri: plante.image
            }} alt="Alternate Text" size="xl" />
          </Center>

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
}