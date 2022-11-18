import * as React from "react";
import {
  Text,
  View,
  Image,
  Box,
  Heading,
  VStack,
  HStack,
  Center,
} from "native-base";
import serreImg from "../../assets/serrepng.png";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { dateToString } from "../commons/utils/dateFormater.js";
import { useEffect, useState } from 'react';
import * as SQLite from "expo-sqlite";
import Request from "../api/services/api.request.js";


export function HomeScreen({ navigation }) {

  const request = new Request();
  const db = SQLite.openDatabase('database.db');

  // current plants in greenhouse
  const [plants, setPlants] = useState([]);

  // set last water time
  const [waterState, setWaterState] = useState({date: "Pas d'arrosage récent", since: "longtemps"});

  useEffect(() => {
    getPlants();
    if(waterState.date === "Pas d'arrosage récent") {
      getWaterState();
    }
  }, []);

  const getPlants = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `select distinct p.* from plante p, emplacement e
        where p.plante_id = e.plante_id ;`, null,
        (_, { rows: { _array } }) => setPlants(_array),
        (_, error) => console.log('Error ', error)
      );
    });
  }

  const getWaterState = () => { // add async later on maybe?
    request.getWaterTime().then((result) => {
      const lastWater = result;
      // Will set date string as "No recent watering" and since as "longtemps" if invalid request object
      let currentWater = {date: "Pas d'arrosage récent", since: "longtemps"};

      // If correct watering time
      if(lastWater.last_watering !== null) {
        // Convert unix timestamp
        const lastDate = new Date(lastWater.last_watering * 1000); // Times 1000 to convert in milliseconds
        //lastDate.setSeconds(lastWater.last_watering);
        currentWater.date = dateToString(lastDate);
        // Find time elapsed since last watering
        const localDate = new Date();
        const elapsed = Math.round(Math.abs((localDate - lastDate) / 1000) / (60 * 60));
        currentWater.since = `${elapsed} ${elapsed > 1 ? "heures" : "heure"}`;
      }

      // Update last water time
      setWaterState(currentWater);
      })
    .catch((err) => {
      console.log("error with api load old data \n" + err);
    });
  };

  return (
    <View >
      <Heading p={3}>Les nouvelles !</Heading>
      <Center>
      <Box
        bg={{
          linearGradient: {
            colors: ["lightBlue.300", "blue.500"],
            start: [0, 0],
            end: [1, 0],
          },
        }}
        p="5"
        rounded={5}
        width={350}
      >
        <HStack space={20} justifyContent="center">
          <FontAwesome5 name="faucet" size={50} color="white" />

          <VStack space={5}>
            <Heading color="white">Dernier Arrosage</Heading>
            <Text>{waterState.date}</Text>
            <Text>Il y a {waterState.since}</Text>
          </VStack>
        </HStack>
      </Box>
      <Text style={styles.plantTitle}>Etat de mes plantes :</Text>
      {plants.map((plant, index) => <Text key={index} style={styles.plantInfo}> - {plant.nom} n°{index} : Rien à signaler</Text>)}
      <Image source={serreImg} alt="serre" size="2xl" />
      </Center>
    </View>
  );
}

const styles = StyleSheet.create({
  plantTitle: {
    marginTop: 30,
    lineHeight: 30,
    fontSize: 30,
    fontWeight: "bold"
  },

  plantInfo: {
    marginTop: 15,
    fontSize: 18,
  }
});
