import * as React from "react";
import {
  Text,
  View,
  Image,
  Box,
  Heading,
  VStack,
  HStack,
  Alert,
  Center,
  ScrollView,
  Pressable
} from "native-base";
import serreImg from "../../assets/serrepng.png";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { StyleSheet } from "react-native";
import { dateToString } from "../commons/utils/dateFormater.js";
import { useEffect, useState } from 'react';
import Request from "../api/services/api.request.js";
import {getPlantsInHouse, loadDataGreenHouse} from '../dbHelper/db-service'


export function HomeScreen({ navigation }) {
  const request = new Request();
  // current plants in greenhouse
  const [plants, setPlants] = useState([]);
  const [plantsAlert, setPlantsAlert] = useState([]);
  // set last water time
  const [waterState, setWaterState] = useState({date: "Pas d'arrosage récent", since: "longtemps"});

  useEffect(() => { 
    const willFocusSubscription = navigation.addListener('focus', () => {
      console.log('hello')
      createAlertPlants()
      if(waterState.date === "Pas d'arrosage récent") {        
        getWaterState();
      }
    });
    
    return willFocusSubscription;
  }, []);

  async function createAlertPlants(){
    const plants = await getPlants()
    console.log('return getPlants ' + plants.length) 
    if(plants.length === 0)
      return
    
    const data = await getDataFromApi()
        
    console.log('creation alerte ')   
    let phData = setupPh(data.ph)

    //en fonction des infos renvoyer par l'api et des plantes dans la serre générer des alertes
    // si 0 alerte, info success tout va bien
    //change requete db pour avoir juste les infos necessaire (nouvelle fonction)*/   
    let alerts = []    
    plants.forEach(plant => {
      //humdidity
      if(data.humidity < 40 ){
        if(data.temperature > 20 && data.light > 50000)
          alerts.push('La plante : ' + plant.nom + ' doit être arrosé au soir car il fait trop chaud actuellement!')
        else
          alerts.push('La plante : ' + plant.nom + ' doit être arrosé!')
      }        
      else if(data.humidity > 75 )
        alerts.push('La plante : ' + plant.nom + ' a trop d\'eau!')
      //co2
      if(data.co2 > 1200)
        alerts.push('La plante : ' + plant.nom + ' a besoin d\'air frais!')
      //temp
      if(data.temperature < plant.temperature_min)
        alerts.push('La plante : ' + plant.nom + ' a froid!')
      else if(data.temperature > plant.temperature_max)
        alerts.push('La plante : ' + plant.nom + ' a trop chaud!')
      //ph    
      if(plant.ph !== null && phData !== plant.ph)
        alerts.push('La plante : ' + plant.nom + ' a besoin d\' un sol ' + plant.ph + ' et vous avez un sol ' + phData)
      
    });

    setPlantsAlert(alerts)   
  
  }

  function setupPh(res){    
    if(res < 6.2)      
      return 'alcalin'   
    else if(res > 7.2)
      return 'acide'
    else
      return 'neutre'
  }

  //update data in database
  async function getDataFromApi() {  
    let res = null 
    await request
      .getGreenhouseInfo()
      .then((result) => {                         
        res = result
      })
      .catch((err) => {
        //getfrom database
        console.log("error with api load old data \n" + err);
        res = getDataFromDataBase()
      });    
    return res  
  }

  async function getDataFromDataBase(){
    let res
    await loadDataGreenHouse().then(result => {
      res = result[0]
    })
    .catch(err => console.log(err))  
    return res  
  }

  async function getPlants() {
    let res
    await getPlantsInHouse().then(result =>{
      setPlants(result)         
      res = result
    })    
    return res
  }

  const getWaterState = () => { // add async later on maybe? => pas besoin tu gères déjà avec une promise
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

  const AlertPlant  = () => {
    if(plantsAlert.length > 0){ 
      return (        
        plantsAlert.map(
          (alert, index) => 
          <Alert key={index} variant="left-accent" colorScheme="warning" ml={4} mr={4} mb={2} mt={2} status="warning">
          <VStack space={2} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack space={2} flexShrink={1} alignItems="center">
                <Alert.Icon />
                <Text mr={5} fontSize="md" fontWeight="medium" color="coolGray.800">
                  {alert}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Alert>
        )
        
      )
    }
    else if(plants.length > 0){
      return(
        <Alert variant="left-accent" colorScheme="success" ml={4} mr={4} mb={2} mt={2} status="success">
        <VStack space={2} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
              <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                Vos plantes se portent bien !
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </Alert>
      )
    }
  }

  return (
    <View style={{flex:1}}>
      <Heading p={3}>Les nouvelles !</Heading>
      <ScrollView >
      <Alert variant="left-accent" colorScheme="info" status="info" ml={4} mr={4} mb={2} mt={2}>
          <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                  Dernier arrosage
                </Text>
              </HStack>

            </HStack>
            <Box pl="6" _text={{
            color: "coolGray.600"
          }}>
              <Text>{waterState.date}</Text>
              <Text>Il y a {waterState.since}</Text>
            </Box>
          </VStack>
        </Alert>
        
        <AlertPlant/>

        <Center>      
        
        <Image source={serreImg} alt="serre" size="2xl" />
        </Center>
      </ScrollView>


      <Box
        bg={{
          linearGradient: {
            colors: ["lightBlue.300", "blue.500"],
            start: [0, 0],
            end: [1, 0],
          },
        }}
        p="1"
        rounded={3}
        m={5}
        w='90%'
      >
        <Pressable 
            onPress={() => console.log('plouf')}
        >
        {({isPressed }) => {
        return (
          <Box 
          style={{
            transform: [
              {
                scale: isPressed ? 0.96 : 1,
              },
            ],
          }}>
            <VStack p={5} space={5} alignItems="center">
              <MaterialCommunityIcons name="water-pump" size={50} color="white" />          
            </VStack>
          </Box>
        );}}
        </Pressable>
      </Box>
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
