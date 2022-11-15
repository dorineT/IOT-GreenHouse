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
Pressable,
useToast
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Dimensions, Animated, TouchableOpacity,StatusBar } from "react-native";
import { TabView, SceneMap } from 'react-native-tab-view';
import {deletePlantFromHouse} from '../dbHelper/db-service'
import * as SQLite from "expo-sqlite";
import { FlatGrid } from 'react-native-super-grid';
import {getEmplacement} from '../dbHelper/db-service'
const db = SQLite.openDatabase('database.db')



export function InfoPlantScreen({route, navigation})  {
  const plante = route.params.item;
  const toast = useToast();
  const [emplacementData, setEmplacementData] = useState([]);

  function deletePlant(){
    deletePlantFromHouse(plante.plante_id).then(result =>{
      if(result > 0){
        toast.show({
          render: () => {
            return <Box bg="#a16207" opacity="75" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">Plante supprimée</Text> 
                  </Box>;
          }
        });
        navigation.goBack()
      }
    })    
  }

  function updateData(){
    getEmplacement().then(result => {
      setEmplacementData(result)
    })
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
        style={styles.gridView}
        spacing={20}
        maxItemsPerRow={2}
        renderItem={({ item }) => {
          if(item.nom === null){
            return(
              <View style={[styles.itemContainer]}  bg="warmGray.300" >
              <Text style={styles.itemName}>Vide</Text>
            </View>
            )
          }
          else{
            return(
              <View style={[styles.itemContainer, { backgroundColor: "#a16207" }]}>
              <Text style={styles.itemName}>{item.nom}</Text>
            </View>
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
        return <Box key={i} borderBottomWidth="3" borderColor={borderColor} flex={1} alignItems="center" p="3" cursor="pointer">
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
  gridView: {
    marginTop: 10,
    flex: 1,    
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    height: 150,
    elevation: 20,
    shadowColor: '#525252', 
  },
  itemName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
});

