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
//import * as FileSystem from 'expo-file-system';
//import { Asset } from 'expo-asset';

//bd
import {getPlantes, createTable} from '../dbHelper/db-service'


function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db =  SQLite.openDatabase("dbplant.db");

  const query1 = `CREATE TABLE IF NOT EXISTS plante (
    plante_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    type_plante TEXT NOT NULL,
    plantation TEXT NOT NULL,
    recolte TEXT NOT NULL,
    terre TEXT NOT NULL,
    eau TEXT NOT NULL,
    ph TEXT NOT NULL,
    humidite TEXT NOT NULL,
    temperature TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    lien TEXT
);`;

const query2 = `CREATE TABLE IF NOT EXISTS serre (
    id_serre INTEGER PRIMARY KEY,
    type_action TEXT CHECK( type_action  IN ('arrosage','c_humidite','c_luminosite', 'c_temperature','c_ph') ) NOT NULL,
    moment datetime default current_timestamp
);`;

const query3 = `CREATE TABLE IF NOT EXISTS emplacement (
    label INTEGER PRIMARY KEY AUTOINCREMENT,
    plante_id  INTEGER  NOT NULL,
    FOREIGN KEY (plante_id) 
      REFERENCES plante (plante_id) 
);`;


const query4 = `INSERT INTO plante (nom,type_plante,plantation,recolte,terre,eau,ph,humidite,temperature,image, description)
VALUES 
('Basilic','Comestible, aromatique','février - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drainé','> 10 degrés c','https://www.tomatopiu.com/wp-content/uploads/2016/08/BASILICO-GRECOsmall.png','Le basilic est une plante aromatique facile à cultiver en extérieur ou en intérieur, en pot ou en pleine terre. Très apprécié pour sa fraicheur et sa saveur, il relève les plats de l''été. C''est un réel plaisir de le cueillir selon ses besoins.'),
('Thym','Comestible, aromatique','février - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drainé','> 10 degrés c','https://www.tomatopiu.com/wp-content/uploads/2016/08/BASILICO-GRECOsmall.png','Le basilic est une plante aromatique facile à cultiver en extérieur ou en intérieur, en pot ou en pleine terre. Très apprécié pour sa fraicheur et sa saveur, il relève les plats de l''été. C''est un réel plaisir de le cueillir selon ses besoins.'),
('Fleur','Comestible, aromatique','février - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drainé','> 10 degrés c','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxaRQ_b37aFTSkwh8OKmhTqf6zlJHHMbG4GByIG-VYzg&s','Le basilic est une plante aromatique facile à cultiver en extérieur ou en intérieur, en pot ou en pleine terre. Très apprécié pour sa fraicheur et sa saveur, il relève les plats de l''été. C''est un réel plaisir de le cueillir selon ses besoins.');
`;

 /* db.transaction(tx => {  
        
    tx.executeSql(query1)
    tx.executeSql(query2)
    tx.executeSql(query3)
    tx.executeSql(query4)
})*/
  console.log("fin creation")
  return db
}

/*async function openDatabase2(){
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require("../../database.db")).uri,
    FileSystem.documentDirectory + 'SQLite/database.db'
  );
  return SQLite.openDatabase('database.db'); // si ça erreur undefinded db.transaction ( .. nearby machin)
  // see https://github.com/expo/expo/issues/16776
}*/

/*async function openDatabaseIShipWithApp() {
  const internalDbName = "databaseInternal.db"; // Call whatever you want
  const sqlDir = FileSystem.documentDirectory + "SQLite/";
  if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
      await FileSystem.makeDirectoryAsync(sqlDir, {intermediates: true});
      const asset = Asset.fromModule(require("../../database.db"));
      await FileSystem.downloadAsync(asset.uri, sqlDir + internalDbName);
  }
  return SQLite.openDatabase(internalDbName);
}*/

/**async function removeDatabase() {
    const sqlDir = FileSystem.documentDirectory + "SQLite/";
    await FileSystem.deleteAsync(sqlDir + "dbInStorage.sqlite", {idempotent: true});
}*/


const db = openDatabaseIShipWithApp()

export function PlantsScreen({ navigation }) {
  const [plantsList, setPlantsList ] =  useState(null)


  useEffect(() => {
    /*    getPlantes().then( (result) =>{
    console.log('plus bas')
    setPlantsList(result)*/
    console.log(db)
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM plante;', null,    
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