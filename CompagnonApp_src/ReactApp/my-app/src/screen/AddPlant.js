import React, { useState } from 'react';
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
  Button
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import data from "../../dataPlants.json";




export function AddPlantScreen({navigation}) {

  const [text, setText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  
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

  const DialogBox = () => {

    return <Center>
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Ajouter la plante</AlertDialog.Header>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
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
        <Divider/>
        <Text>{text}</Text>
        <FlatList 
          data={filteredData}
          renderItem={({item}) =>(
            <Box
            _dark={{
              borderColor: "muted.50",
            }}
            borderColor="muted.800"
            marginLeft={4}
            marginRight={4}
            py={2}
          >
            <Pressable maxW="96"
                onPress={() => setIsOpen(!isOpen)}
            >
              {({ isHovered, isFocused, isPressed }) => {
                return (
                  <Box
                    bg={
                      isPressed
                        ? "coolGray.200"
                        : isHovered
                        ? "coolGray.200"
                        : "coolGray.100"
                    }
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}
                    p="5"
                    rounded="8"
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
  );
}