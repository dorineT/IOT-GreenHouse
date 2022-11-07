import React,{useState, useEffect} from 'react';
import { 
  View,
  Text, 
  Heading,
  VStack,
  Image,
  Center,
  Box,
  HStack,
  ScrollView,
Icon,
Divider,
useColorModeValue,
Pressable
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Dimensions, Animated, TouchableOpacity,StatusBar } from "react-native";
import { TabView, SceneMap } from 'react-native-tab-view';
import {deletePlantFromHouse} from '../dbHelper/db-service'
import * as SQLite from "expo-sqlite";
import { FlatGrid } from 'react-native-super-grid';

const db = SQLite.openDatabase('database.db')


export function InfoPlantScreen({route, navigation})  {
  const plante = route.params.item;

  const [emplacementData, setEmplacementData] = useState([]);

  async function deletePlant(){
    await deletePlantFromHouse(plante.plante_id)
    navigation.navigate('Détails',{ screen: 'Mes plantes'})    
  }

  function updateData(){
    db.transaction((tx) => {
      tx.executeSql(
        `select e.*, p.nom from emplacement e
        left join plante p on e.plante_id = p.plante_id;`, null,    
        (_, { rows: { _array } }) => setEmplacementData(_array),
        (_, error) => console.log('Error ', error)
      );
    });
  }

  useEffect(() => {
    updateData()
   }, []);

  const FirstRoute = () => (
    <ScrollView>
    <Box padding={7} margin={5} rounded="xl"  bg={["white"]} >
        
        <HStack  justifyContent="space-between">  
        <Heading> {plante.nom}</Heading>
        <Icon  size="8" color="warning.600" as={<Ionicons name="ios-trash" />} onPress={() =>deletePlant()}/>
        </HStack>
          
      <Text fontSize="md" italic>{plante.type}</Text>
      <VStack>
        <Center>
        <Image source={{
            uri: plante.image
          }} alt="Alternate Text" size="xl" />
        </Center>
        <Divider mt={5} mb={5}></Divider>
          
        <Text>{plante.description}</Text>
        
      <Divider mt={5}></Divider>

        <HStack space={3} marginTop={5}>        
          <Icon  size="9" color="primary.400" as={<Ionicons name="ios-water" />}/>       
          <Text>{plante.eau}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-thermometer-outline" size={34} color="red" />
          <Text>{plante.temperature}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-umbrella" size={34} color="grey" />
          <Text>{plante.humidite}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-filter" size={34} color="grey" />
          <Text>ph: {plante.ph}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-pin" size={34} color="grey" />
          <Text>{plante.terre}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-calendar-outline" size={34} color="grey" />
          <Text>Période de plantation: {plante.plantation}</Text>
        </HStack>

        <HStack space={3} marginTop={5}>          
          <Ionicons name="ios-calendar-outline" size={34} color="grey" />
          <Text>Période de récolte: {plante.recolte}</Text>
        </HStack>


      </VStack>
    </Box>
  </ScrollView>
  );

  const SecondRoute = () => (
    
      <FlatGrid        
        itemDimension={100}
        data={emplacementData}
        //style={styles.gridView}
        spacing={10}
        maxItemsPerRow={2}
        renderItem={({ item }) => {
          if(item.nom === null){
            return(
              <Center  rounded="lg" padding={7}  bg="warmGray.300" _text={{
                fontSize: 'lg',
                fontWeight: 'medium',
                color: 'white',
                textAlign: 'center'
              }}>Vide </Center> 
            )
          }
          else{
            return(
              <Center  rounded="lg" padding={7} bg="#a16207" _text={{
                fontSize: 'lg',
                fontWeight: 'medium',
                color: 'warmGray.50',
                textAlign: 'center'
              }}>{item.nom} </Center> 
            )
          }
        }}
      />

  );

  const initialLayout = { width: Dimensions.get('window').width };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: "Ma plante"},
    { key: 'second', title: 'Emplacement' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
        const opacity = props.position.interpolate({
          inputRange,
          outputRange: inputRange.map(inputIndex => inputIndex === i ? 1 : 0.5)
        });
        const color = index === i ? useColorModeValue('#000', '#e5e5e5') : useColorModeValue('#1f2937', '#a1a1aa');
        const borderColor = index === i ? '#a16207' : useColorModeValue('coolGray.200', 'gray.400');
        return <Box borderBottomWidth="3" borderColor={borderColor} flex={1} alignItems="center" p="3" cursor="pointer">
              <Pressable onPress={() => {          
            setIndex(i);
          }}>
                <Animated.Text style={{
              color
            }}>{route.title}</Animated.Text>
              </Pressable>
            </Box>;
      })}
      </Box>;
  };

  return (   
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        initialLayout={initialLayout}
      />    
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

