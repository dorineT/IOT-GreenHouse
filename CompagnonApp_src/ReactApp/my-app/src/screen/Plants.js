import * as React from "react";
import {
  Text,
  Box,
  VStack,
  Heading,
  Avatar,
  HStack,
  Spacer,
  FlatList,
  Pressable,
} from "native-base";

import data from "../../dataPlants.json";

export function PlantsScreen({ navigation }) {
  return (
    <Box>
      <Heading fontSize="xl" p="4" pb="3">
        Inbox
      </Heading>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Box
            _dark={{
              borderColor: "muted.50",
            }}
            borderColor="muted.800"
            pl={["0", "4"]}
            pr={["0", "5"]}
            py="2"
          >
            <Pressable maxW="96"
                onPress={() => {navigation.navigate('Mes plantes',{
                    screen: 'InfoPlante',               
                    params: {id: item.id}
                })}}
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
                    <HStack space={[2, 3]} justifyContent="space-between">
                      <Avatar
                        size="48px"
                        source={{
                          uri: item.avatarUrl,
                        }}
                      />
                      <VStack>
                        <Text
                          _dark={{
                            color: "warmGray.50",
                          }}
                          color="coolGray.800"
                          bold
                        >
                          {item.fullName}
                        </Text>
                        <Text
                          color="coolGray.600"
                          _dark={{
                            color: "warmGray.200",
                          }}
                        >
                          {item.recentText}
                        </Text>
                      </VStack>
                      <Spacer />
                      <Text
                        fontSize="xs"
                        _dark={{
                          color: "warmGray.50",
                        }}
                        color="coolGray.800"
                        alignSelf="flex-start"
                      >
                        {item.timeStamp}
                      </Text>
                    </HStack>{" "}
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
