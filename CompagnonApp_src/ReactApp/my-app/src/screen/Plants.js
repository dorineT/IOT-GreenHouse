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
import React, { useState, useEffect } from "react";
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';


//const db = openDatabase();
const db = SQLite.openDatabase('../../assets/www/database.db', 1); // ko ko si 'database.db' => no such table plant

async function openDatabase(){
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require("../../assets/www/database.db")).uri,
    FileSystem.documentDirectory + 'SQLite/database.db'
  );
  return SQLite.openDatabase('database.db'); // si ça erreur undefinded db.transaction ( .. nearby machin)
  // see https://github.com/expo/expo/issues/16776
}



export function PlantsScreen({ navigation }) {
  const [plantsList, setPlantsList ] =  useState(null)

  useEffect(() => {    
    db.transaction(tx => {  
      console.log("hhh")
      tx.executeSql('SELECT * FROM plante', null,    
        (_, { rows: { _array } }) => {
          console.log('coucou')
          setPlantsList(_array)
        },
        (_, error) => console.log('Error ', error)
        )
    })
  }, []);

  return (
    <View style={styles.container}>
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