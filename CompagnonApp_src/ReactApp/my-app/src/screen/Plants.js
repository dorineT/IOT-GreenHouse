import * as React from "react";
import {
  View,
  Box,
  Heading,
  Avatar,
  HStack,
  FlatList,
  Pressable,
  Fab,
} from "native-base";
import { Ionicons } from '@expo/vector-icons';
import data from "../../dataPlants.json";
import { StyleSheet } from "react-native";

export function PlantsScreen({ navigation }) {
  return (
    <View style={styles.container}>
    <Fab  style={{backgroundColor: 'white', position:'absolute'}} renderInPortal={false} shadow={6} 
     icon={<Ionicons name="ios-add" size={25} color="green" />} 
     onPress={() => {navigation.navigate('Mes plantes',{
      screen: 'Nouvelle plante'        
     })}} />
    <Box>
      
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Box
            _dark={{
              borderColor: "muted.50",
            }}

            py={1}
          >
            <Pressable 
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
                        ? "lime.100"
                        : "white"
                    }
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}
                    p="5"
                    rounded="4"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,      
  },
  floatinBtn: {
    
    position: 'absolute',
    bottom: 10,
    right: 10,
  }
});