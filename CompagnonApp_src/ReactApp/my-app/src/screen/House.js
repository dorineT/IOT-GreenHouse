import React,{useState, useEffect} from "react";
import { Text,Box, HStack, VStack, Heading, Fab, Center, ScrollView } from "native-base";
import { Ionicons } from '@expo/vector-icons';

export function HouseScreen({ navigation }) {
  const [luminosite, setLuminosite] = useState(null);

  useEffect(() => {
    //get data from api
    setLuminosite(1000)
   }, []);

  return (
    <ScrollView>     
      <Fab  style={{backgroundColor: 'white'}}  renderInPortal={false}
       icon={<Ionicons name="ios-reload"  size={25} color="gray" /> }
       onPress={() => {console.log('coucou')}} />
      
      <Center mt={10}>
      <Box
        bg={{
          linearGradient: {
            colors: ["yellow.300", "warning.300"],
            start: [0, 0],
            end: [1, 0],
          },
        }}
        p="5" rounded={5} width={350} mb={5}
      >
        <HStack space={20} justifyContent="center">
          <Ionicons name="ios-thermometer-outline" size={50} color="white" />
          <VStack space={5}>
            <Heading color="white">Température</Heading>
            <Text>25 °C</Text>
          </VStack>
        </HStack>
      </Box>
      <Box
        bg={{
          linearGradient: {
            colors: ["green.400", "green.100"],
            start: [0, 0],
            end: [1, 0],
          },
        }}
        p="5" rounded={5} width={350} mb={5}
      >
        <HStack space={20} justifyContent="center">
          {
            luminosite === 0 ?
            <Ionicons name="ios-thermometer-outline" size={50} color="white" />
            :
            <Ionicons name="ios-sunny" size={50} color="white" />
          }
        

          <VStack space={5}>
            <Heading color="white">Luminosité</Heading>
            <Text>Ensoleillé</Text>
          </VStack>
        </HStack>
      </Box>
      <Box
        bg={{
          linearGradient: {
            colors: ["lightBlue.300", "blue.500"],
            start: [0, 0],
            end: [1, 0],
          },
        }}
        p="5" rounded={5} width={350} mb={5}
      >
        <HStack space={20} justifyContent="center">
          <Ionicons name="ios-water" size={50} color="white" />

          <VStack space={5}>
            <Heading color="white">Humidité</Heading>
            <Text>50 %</Text>
          </VStack>
        </HStack>
      </Box>
      <Box
        bg={{
          linearGradient: {
            colors: ["warning.900", "warmGray.100"],
            start: [0, 0],
            end: [1, 0],
          },
        }}
        p="5" rounded={5} width={350} mb={5}
      >
        <HStack space={20} justifyContent="center">
          <Ionicons name="ios-filter" size={50} color="white" />

          <VStack space={5}>
            <Heading color="white">Ph</Heading>
            <Text>7</Text>
            <Text>+ image</Text>
          </VStack>
        </HStack>
      </Box>
      </Center>
    </ScrollView>
  );
}
