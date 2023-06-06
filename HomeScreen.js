import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
export default function Navigator(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
      <Stack.Screen name="Plant" component={PlantScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

function HomeScreen(props) {
  const colourScheme = ["#c9d3ee", "#f7d4da", "#e9dbc2", "#caf4ed"];
  const [userPlants, setUserPlants] = useState({
    
  });

  const plantsArr = Object.keys(userPlants);

  console.log(plantsArr);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          props.navigation.navigate("Add", {
            setUserPlants: setUserPlants,
            userPlants: userPlants,
          })
        }
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.subText}>My Plants 🌱</Text>
      <Text style={styles.infoText}>You have {plantsArr.length} plants</Text>
      <ScrollView>
        <View style={styles.plantMainContainer}>
          {plantsArr.map((value, index) => {
            return (
              <TouchableOpacity
                style={[
                  styles.plantContainer,
                  {
                    backgroundColor: colourScheme[index % colourScheme.length],
                  },
                ]}
                onPress={() => {
                  props.navigation.navigate("PlantScreen");
                }}
              >
                <Text style={styles.plantTitle}>
                  {userPlants[value]["name"]}
                </Text>
                <Image
                  source={{ uri: userPlants[value]["image"] }}
                  style={styles.plantImage}
                ></Image>
                <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap',justifyContent:'center'}}>
                  <View style={styles.infoContainer}>
                    <View>
                      <View style={styles.topInfoContainer}>
                        <Image
                          style={styles.iconImage}
                          source={require("./assets/images/droplet-icon.png")}
                        ></Image>
                        <Text style={styles.numberText}>{userPlants[value]['humidity']!==0?userPlants[value]['humidity']+'%':'—'}</Text>
                      </View>
                      <Text style={styles.greyText}>Humidity</Text>
                    </View>
                  </View>
                  <View style={styles.infoContainer}>
                    <View>
                      <View style={styles.topInfoContainer}>
                        <Image
                          style={styles.iconImage}
                          source={require("./assets/images/temp-icon.png")}
                        ></Image>
                        <Text style={styles.numberText}>{userPlants[value]['temp']!==0?userPlants[value]['temp']+'°C':'—'}</Text>
                      </View>
                      <Text style={styles.greyText}>Temp</Text>
                    </View>
                  </View>
                  <View style={styles.infoContainer}>
                    <View>
                      <View style={styles.topInfoContainer}>
                        <Image
                          style={styles.iconImage}
                          source={require("./assets/images/sun-icon.png")}
                        ></Image>
                        <Text style={styles.numberText}>{userPlants[value]['light']!==0?userPlants[value]['light']+'%':'—'}</Text>
                      </View>
                      <Text style={styles.greyText}>Sunlight</Text>
                    </View>
                  </View>
                  </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
function PlantScreen(props) {
  return (
    <View>
      <Text>PlantScreen</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    gap: 10,
    paddingHorizontal: 10,
  },
  introText: {
    fontSize: 25,
    fontWeight: 500,
    color: "white",
  },
  subText: {
    marginVertical: 30,
    fontSize: 30,
    color: "white",
    fontWeight: 500,
  },
  infoText: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
  plantContainer: {
    width: "48%",
    height: 250,
    borderRadius: 10,
    backgroundColor: "#f2f4e7",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  plantMainContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  plantImage: {
    width: "70%",
    flex: 0.9,
  },
  plantTitle: {
    fontWeight: 600,
    fontSize: 15,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 200,
    backgroundColor: "#59c78b",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 100,
  },
  buttonText: {
    fontSize: 35,
    fontWeight: "300",
  },
  infoContainer: {
    width:80,
    alignItems:'center'
  },
  iconImage: {
    width: 23,
    height: 23,
  },
  topInfoContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  numberText: {
    fontSize: 17,
    fontWeight: 600,
  },
  greyText:{
    color:'#646464',
    marginTop:2
  }
});
