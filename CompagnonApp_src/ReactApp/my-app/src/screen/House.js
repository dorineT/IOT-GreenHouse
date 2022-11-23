import React, { useState, useEffect } from "react";
import {
  Image,
  Box,
  HStack,
  VStack,
  Heading,
  Fab,
  Center,
  ScrollView,
  View,
  Alert,
  Text,
  Collapse,
  IconButton,
  CloseIcon
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import phscale from "../../assets/phscale.png";
import { StyleSheet,ImageBackground } from "react-native";
import Request from "../api/services/api.request.js";
import { updateDataGreenHouse, loadDataGreenHouse } from "../dbHelper/db-service";
import bgImg from '../../assets/fieldImg.jpg'

export function HouseScreen({ navigation }) {
  const request = new Request();
  const [light, setLight] = useState(null);
  const [lightText, setLightText] = useState("");
  const [humidity, setHumidity] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [ph, setPh] = useState(null);
  const [co2, setCo2] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [show, setShow] = React.useState(true);

  function setupLight(result) {    
    if(result === null){
      setLightText("Pas de données");
      return
    }
      setLight(result);
    if (result < 70) {
      setLightText("Nuit");
    } else if (result < 25000) {
      setLightText("Nuageux");
    } else {
      setLightText("Ensoleillé");
    }
  }

  function getDataFromDataBase(){  
    loadDataGreenHouse().then(result => {
      let res = result[0]
      setupLight(res.c_luminosite);
      setHumidity(res.c_humidite);
      setPh(res.c_ph);
      setCo2(res.c_co2);
      setTemperature(res.c_temperature);
      setTimeData(res.moment);
      setShow(true)
    })
    .catch(err => console.log(err))
  }

  function updateDabase(data){   
    updateDataGreenHouse(data, timeData).then((res) =>{
      console.log('ok')
    })
    .catch(err => console.log(err))
  }

  //update data in database
  function getDataFromApi() {
    request
      .getGreenhouseInfo()
      .then((result) => {
        setupLight(result.light);
        setHumidity(result.humidity);
        setPh(result.ph);
        setCo2(result.co2);
        setTemperature(result.temperature);
        let current = new Date();
        setTimeData(current.toLocaleDateString() + ' à ' + current.toLocaleTimeString()); //from now
        setShow(true)
        updateDabase(result)
      })
      .catch((err) => {
        //getfrom database
        console.log("error with api load old data \n" + err);
        getDataFromDataBase()
      });
  }

  useEffect(() => {
    //get data from api
    getDataFromApi();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={bgImg} resizeMode="cover" style={styles.image}>
      <Fab
        style={{ backgroundColor: "white", position: "absolute" }}
        renderInPortal={false}
        icon={<Ionicons name="ios-reload" size={25} color="gray" />}
        onPress={() => {        
          getDataFromApi();
          //getDataFromDataBase()
        }}
      />

        <Collapse isOpen={show}>
        <Alert variant="left-accent" colorScheme="info" m={4} status="info">
            <VStack space={2} flexShrink={1} w="100%">
              <HStack
                flexShrink={1}
                space={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <HStack space={2} flexShrink={1} alignItems="center">
                  <Alert.Icon />
                  <Text color='coolGray.800'>
                    Dernière mise à jour : {timeData}
                  </Text>
                  <IconButton variant="unstyled" _focus={{
                    borderWidth: 0
                  }} icon={<CloseIcon size="3" />} _icon={{
                    color: "coolGray.600"
                  }} onPress={() => setShow(false)} />
                </HStack>
              </HStack>
            </VStack>
          </Alert>
        </Collapse>
      <ScrollView >
        <HStack space={5} mt={3} justifyContent="center">
          <Box
            bg={{
              linearGradient: {
                colors: ["red.500", "warning.300"],
                start: [0, 0],
                end: [1, 0],
              },
            }}
            p="1"
            rounded={3}
            mb={5}
            width={170}
          >
            <VStack p={5} space={5} alignItems="center">
              <Ionicons name="ios-thermometer-outline" size={40} color="white" />
              {
                temperature !== null ?
                <Heading color="white">{temperature}°C</Heading>
                :
                <Heading color="white">Pas de données</Heading>
              }              
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
            p="1"
            rounded={3}
            mb={5}
            width={170}
          >
            <VStack p={5} space={5} alignItems="center">
              {lightText === "Nuit" ? (
                <Ionicons name="ios-moon" size={40} color="white" />
              ) : lightText === "Nuageux" ? (
                <Ionicons name="ios-cloud" size={40} color="white" />
              ) : (
                <Ionicons name="ios-sunny" size={40} color="white" />
              )}
              <Heading color="white">{lightText}</Heading>
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
            p="1"
            rounded={3}
            mb={5}
            width={170}
          >
            <VStack p={5} space={5} alignItems="center">
              <Ionicons name="ios-water" size={40} color="white" />
              {
                humidity !== null?
                <Heading color="white">{humidity} %</Heading>
                :
                <Heading color="white">Pas de données</Heading>
              }
              
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
            p="1"
            rounded={3}
            mb={5}
            width={170}
          >
            <VStack p={5} space={5} alignItems="center">
              <MaterialCommunityIcons
                name="molecule-co2"
                size={40}
                color="white"
              />
              {
                co2 !== null?
                <Heading color="white">{co2} ppm</Heading>
                :
                <Heading color="white">Pas de données</Heading>
              }
            </VStack>
          </Box>
        </HStack>

        <Center>
          <Box
            bg={{
              linearGradient: {
                colors: ["white", "warmGray.100"],
                start: [0, 0],
                end: [1, 2],
              },
            }}
            borderColor="warmGray.600"
            borderWidth={2}
            p="1"
            rounded={3}
            width={360}
            mb={5}
            height={200}
          >
            <VStack space={1} p="3">
              <HStack space={10} justifyContent="space-between">
                <Heading color="warmGray.700">Ph</Heading>
                {
                  ph != null?
                  <Heading color="warmGray.700">{ph}</Heading>
                  :
                  <Heading color="warmGray.700">Pas de données</Heading>
                }
              </HStack>

              <Image
                source={phscale}
                alt="phscale"
                resizeMode="contain"
                style={styles.canvas}
              />
            </VStack>
          </Box>
        </Center>
      </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    position: "relative",
    top: -70,
    left: 0,
    bottom: 0,
    right: 0,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  }
});
