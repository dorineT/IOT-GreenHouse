import * as React from "react";
import {
  Text,
  Box,
  VStack,
  Heading,
  Avatar,
  HStack,
  Spacer,
  FlatList,
  Pressable,
  Fab
} from "native-base";
import { Ionicons } from '@expo/vector-icons';
import data from "../../dataPlants.json";

export function PlantsScreen({ navigation }) {
  return (
    <Box>
      <Fab placement="top-right"  style={{backgroundColor: 'white'}} renderInPortal={false} shadow={6} 
       icon={<Ionicons name="ios-add" size={25} color="green" />} 
       onPress={() => {navigation.navigate('Mes plantes',{
        screen: 'Nouvelle plante'        
       })}} />
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Box
            _dark={{
              borderColor: "muted.50",
            }}
            borderColor="muted.800"
            marginLeft={4}
            marginRight={4}
            py={2}
          >
            <Pressable maxW="96"
                onPress={() => {navigation.navigate('Mes plantes',{
                    screen: 'Détails',               
                    params: {item: item}
                })}}
            >
              {({ isHovered, isFocused, isPressed }) => {
                return (
                  <Box
                    bg={
                      isPressed
                        ? "coolGray.200"
                        : isHovered
                        ? "coolGray.200"
                        : "coolGray.100"
                    }
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}
                    p="5"
                    rounded="8"
                    shadow={3}
                    borderWidth="1"
                    borderColor="coolGray.300"
                  >
                    <HStack space={6} justifyContent="flex-start">
                      <Avatar
                        size="48px"
                        source={{
                          uri: item.image
                        }}
                      />                     
                        <Heading
                          _dark={{
                            color: "warmGray.50",
                          }}
                          color="coolGray.800"
                          bold
                          italic
                        >
                          {item.nom}
                        </Heading>
                    </HStack>
                  </Box>
                );
              }}
            </Pressable>
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
}
