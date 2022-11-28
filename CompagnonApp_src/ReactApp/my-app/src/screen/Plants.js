import {
  View,
  Box,
  Heading,
  Avatar,
  HStack,
  FlatList,
  Pressable,
  Fab,
  Text,
  Center,
} from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, ImageBackground } from "react-native";
import React, { useState, useEffect } from "react";
import {getPlantsInHouse} from '../dbHelper/db-service'
import bgImg from '../../assets/fieldImg.jpg'

export function PlantsScreen({ navigation }) {
  const [plantsList, setPlantsList ] =  useState([])

  useEffect(() => {   
    const willFocusSubscription = navigation.addListener('focus', () => {
      fetchData();
    });

  return willFocusSubscription;

  }, []);

  function fetchData(){
    getPlantsInHouse().then(result =>{     
      setPlantsList(result)
    })
  }

  if(plantsList.length > 0){
    return (
      <View style={styles.container}>
      <ImageBackground source={bgImg} resizeMode="cover" style={styles.image}>
      <Fab  style={{backgroundColor: 'white', position:'absolute'}} renderInPortal={false} shadow={6} 
       icon={<Ionicons name="ios-add" size={25} color="green" />} 
       onPress={() => {navigation.navigate('Mes plantes',{
        screen: 'Nouvelle plante'        
       })}} />
      <Box>      
        <FlatList
          data={plantsList}
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
          keyExtractor={(item) => item.plante_id}
        />
      </Box>
      </ImageBackground>
      </View>
    );
  }
  else{
    return (
      <View style={{ flex: 1}}>
      <ImageBackground source={bgImg} resizeMode="cover" style={styles.imageCenter}>
      <Fab  style={{backgroundColor: 'white', position:'absolute'}} renderInPortal={false} shadow={6} 
       icon={<Ionicons name="ios-add" size={25} color="green" />} 
       onPress={() => {navigation.navigate('Mes plantes',{
        screen: 'Nouvelle plante'        
       })}} />
        <Center mt={200}>
        <Text fontSize="xl" fontWeight="bold" color="coolGray.200">
        Ajoutez une plante dans votre serre !
        </Text>      
        </Center>
      </ImageBackground>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,      
  },
  floatinBtn: {
    
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  image: {
    flex: 1,
    
  },
  imageCenter:{
    flex:1,
    justifyContent: 'center'

  }
});