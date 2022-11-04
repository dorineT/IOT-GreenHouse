import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Input, 
  VStack, 
  Icon, 
  Divider, 
  FlatList,
  Text, 
  Pressable , 
  HStack, 
  Avatar, 
  Heading,
  AlertDialog,
  Center,
  Button,
  View
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import SelectableGrid from 'react-native-selectable-grid'
import { StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
//import data from "../../dataPlants.json";


const db = SQLite.openDatabase('database.db')

export function AddPlantScreen({navigation}) {

  const [text, setText] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const [emplacementData, setEmplacementData] = useState([]);

  const fakeData = [{ label: '1', nom:'vide' }, 
  { label: '2',nom:'vide' }, { label: '3',nom:'carotte' }, 
  { label: '4',nom:'carotte' }, { label: '5',nom:'carotte' },{ label: '6',nom:'vide' }];
 

  
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);

  const searchFilterFunction = (text) => {
      if(text){  
          const newData = data.filter(item => {
              const itemData = item.nom ? item.nom.toUpperCase() : ''.toUpperCase();
              const textData = text.toUpperCase();
              return itemData.indexOf(textData) > -1;
          })
          setFilteredData(newData);
      } else {
          setFilteredData([]);
      }
  }

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from plante p, 
        where plante_id not in (select plante_id from emplacement e where plante_id is not null);`, null,    
        (_, { rows: { _array } }) => setData(_array),
        (_, error) => console.log('Error ', error)
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        `select label, p.plante_id, nom from plante p, emplacement e 
        where
          p.plante_id = e.plante_id 
        ;`, null,    
        (_, { rows: { _array } }) => setEmplacementData(_array),
        (_, error) => console.log('Error ', error)
      );
    });
   }, []);

  const DialogBox = () => {

    return <Center>
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Ajouter la plante</AlertDialog.Header>
            <AlertDialog.Body>Vous avez choisi: {selectedItem}
            
            <View margin={5} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <SelectableGrid    
                  maxSelect={fakeData.length}
                  data={emplacementData} 
                 // onSelect={selectedData => alert(selectedData)}
                  selectedStyle={styles.boxSelected}
                  unselectedStyle={styles.boxUnselected}
                  unselectedRender={data => (
                    <View>
                      <Text style={{ color: 'gray', fontSize: 20 }}>{data.nom}</Text>
                    </View>
                  )}

                  selectedRender={data => (
                    <View>
                      <Text style={{ color: 'white', fontSize: 20 }}>{data.nom}</Text>
                    </View>
                  )}
                />
              </View>
            
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button variant="unstyled" colorScheme="coolGray.200" onPress={onClose} ref={cancelRef}>
                  Annuler
                </Button>
                <Button colorScheme="success" onPress={onClose}>
                  Ajouter
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>;
  };


  return (
    <Box bg={["white"]}>
        <DialogBox/>
        <VStack mt={5} w="90%" space={5} alignSelf="center" >
        <Input 
          placeholder="Rechercher une plante" 
          variant="filled" 
          width="100%" borderRadius="10" py="1" px="2" 
          InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} 
          defaultvalue={text}
          onChangeText={(text) => searchFilterFunction(text)}
        />
        </VStack>
        <Divider mt={4}/>
        <Text>{text}</Text>
        <FlatList 
          data={filteredData}
          renderItem={({item}) =>(
            <Box
            _dark={{
              borderColor: "muted.50",
            }}
            borderColor="muted.800"
            py={1}
          >
            <Pressable
                onPress={() => {              
                  setSelectedItem(item.nom)
                  setIsOpen(!isOpen)
                }}
                
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
  );
}

const styles = StyleSheet.create({
  boxSelected: {
    backgroundColor: '#a16207'   
     
  },
  boxUnselected: {
    backgroundColor: 'white',  
    borderRadius: 20,
    margin: 3,
    elevation: 20,
    shadowColor: '#525252', 
  },
});