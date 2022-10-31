import * as React from 'react';
import { Box, Input, VStack, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

export function AddPlantScreen({navigation}) {
  return (
    <Box bg={["white"]}>
        <VStack mt={5} w="90%" space={5} alignSelf="center" >
        <Input placeholder="Search" variant="filled" width="100%" borderRadius="10" py="1" px="2" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
        </VStack>
    </Box>
  );
}