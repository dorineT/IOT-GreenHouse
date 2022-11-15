import React,{useState, useEffect} from "react";
import { Image,Box, HStack, VStack, Heading, Fab, Center, ScrollView, View } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import phscale from '../../assets/phscale.png'

export function HouseScreen({ navigation }) {
  const [luminosite, setLuminosite] = useState(null);

  useEffect(() => {
    //get data from api
    setLuminosite(1000)
   }, []);

  return (
    <View style={{flex: 1}}>     
      <Fab  style={{backgroundColor: 'white', position:'absolute'}} renderInPortal={false}
       icon={<Ionicons name="ios-reload"  size={25} color="gray" /> }
       onPress={() => {console.log('coucou')}} />
      
      <HStack space={5} mt={10} justifyContent="center">
      <Box
          bg={{
            linearGradient: {
              colors: ["red.500", "warning.300"],
              start: [0, 0],
              end: [1, 0],
            },
          }}
          p="1" rounded={3} mb={5} width={170}
        >
          <VStack p={5} space={5} alignItems="center">
          <Ionicons name="ios-thermometer-outline" size={40} color="white" />
          <Heading color="white">25 °C</Heading>
          </VStack>
        </Box>
        <Box
          bg={{
            linearGradient: {
              colors: ["yellow.300", "warning.300"],
              start: [0, 0],
              end: [1, 0],
            },
          }}
          p="1" rounded={3} mb={5} width={170}
        >
          <VStack p={5} space={5} alignItems="center">
          {
            luminosite === 0 ?
            <Ionicons name="ios-thermometer-outline" size={40} color="white" />
            :
            <Ionicons name="ios-sunny" size={40} color="white" />
          }      
          <Heading color="white">Ensoleillé</Heading>
          </VStack>
        </Box>

      </HStack>

      <HStack space={5} justifyContent="center">
      <Box
          bg={{
            linearGradient: {
              colors: ["lightBlue.300", "blue.500"],
              start: [0, 0],
              end: [1, 0],
            },
          }}
          p="1" rounded={3} mb={5} width={170}
        >
          <VStack p={5} space={5} alignItems="center">
          <Ionicons name="ios-water" size={40} color="white" />
          <Heading color="white">50 %</Heading>
          </VStack>
        </Box>
        <Box
          bg={{
            linearGradient: {
              colors: ["gray.500", "warmGray.200"],
              start: [0, 0],
              end: [1, 0],
            },
          }}
          p="1" rounded={3} mb={5} width={170}
        >
          <VStack p={5} space={5} alignItems="center">
          <MaterialCommunityIcons name="molecule-co2" size={40} color="white" />
          <Heading color="white">XX</Heading>
          </VStack>
        </Box>

      </HStack>

      <Center>      
      <Box
        bg={{
          linearGradient: {
            colors: ["warning.900", "warmGray.100"],
            start: [0, 0],
            end: [1, 2],
          },
        }}
        p="1" rounded={3} width={360} mb={5}
      >
        <VStack space={2} p="3" >
          <HStack space={80} justifyContent="space-around" >
            <Heading color="white">Ph</Heading>
            <Heading color="white">7</Heading>
          </HStack>
            <Center>
            <Image source={phscale} alt="phscale" size="xl" />
            </Center>
        </VStack>
      </Box>
      </Center>
      
    </View>
  );
}
