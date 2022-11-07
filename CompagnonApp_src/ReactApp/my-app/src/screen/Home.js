import * as React from 'react';
import { Text, View, Image, Box, Heading, VStack, HStack, Center } from 'native-base';
import serreImg from '../../assets/serrepng.png'
import { FontAwesome5 } from '@expo/vector-icons'; 

export function HomeScreen({navigation}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Box bg={{
        linearGradient: {
          colors: ['lightBlue.300', 'blue.500'],
          start: [0, 0],
          end: [1, 0]
        }
      }} p="5" rounded={10}>
      <HStack space={20} justifyContent="center">
          <FontAwesome5 name="faucet" size={50} color="white" />

          <VStack space={5}>
            <Heading color="white">Arrossage</Heading>  
            <Text>le x du x à 10h</Text>
          </VStack>            
        </HStack>
      </Box>
      <Text>Home!</Text>
      <Image source={serreImg} alt="serre" size="2xl" />
    </View>
  );
}