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
import * as SQLite from "expo-sqlite";
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

//bd
import {getPlantes, createTable} from '../dbHelper/db-service'


async function openDatabase2(){
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require("../../database.db")).uri,
    FileSystem.documentDirectory + 'SQLite/database.db'
  );
  return SQLite.openDatabase('database.db');  
}

/**async function removeDatabase() {
    const sqlDir = FileSystem.documentDirectory + "SQLite/";
    await FileSystem.deleteAsync(sqlDir + "dbInStorage.sqlite", {idempotent: true});
}*/


const db = SQLite.openDatabase('database.db')

export function PlantsScreen({ navigation }) {
  const [plantsList, setPlantsList ] =  useState(null)

 useEffect(() => {
    /*    getPlantes().then( (result) =>{
    console.log('plus bas')
    setPlantsList(result)
    console.log(db)*/
    db.transaction((tx) => {
      tx.executeSql(
        `select * from plante p, emplacement e 
        where p.plante_id = e.plante_id ;`, null,    
        (_, { rows: { _array } }) => setPlantsList(_array),
        (_, error) => console.log('Error ', error)
      );
    });
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
        keyExtractor={(item) => item.plante.id}
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