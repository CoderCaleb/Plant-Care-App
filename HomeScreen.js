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
import React, { useEffect, useState, useContext, useRef } from "react";
import { PlantContext } from "./LoggedIn";
import { createStackNavigator } from "@react-navigation/stack";
import { getDatabase, ref, set, get, onValue, update } from "firebase/database";
import AddScreen from "./AddScreen";
import PlantScreen from "./PlantScreen";
import { getAuth } from "firebase/auth";
import Toast from 'react-native-toast-message'
const Stack = createStackNavigator();
export default function Navigator(props) {
  useEffect(()=>{
    
  },[])
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="PlantScreen" component={PlantScreen}></Stack.Screen>
      <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
      <Stack.Screen name="EditScreen" component={AddScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

function HomeScreen(props) {
  const { userPlants, setUserPlants, flagToast } = useContext(PlantContext);
  const firstRender = useRef(true)
  const colourScheme = ["#c9d3ee", "#f7d4da", "#e9dbc2", "#caf4ed"];

  const plantsArr = Object.keys(userPlants);
  useEffect(()=>{
    if(!firstRender.current){
      Toast.show(flagToast.toastInfo)
    }
    firstRender.current = false
  },[flagToast])
  console.log(plantsArr);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => props.navigation.navigate("Add")}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <View>
      <Text style={styles.nameText}>Hello, {getAuth().currentUser.displayName} 👋</Text>
      </View>
      <Text style={styles.subText}>My Plants 🌱</Text>
      <Text style={styles.infoText}>You have {plantsArr.length} plants</Text>
      <ScrollView>
        <View style={styles.plantMainContainer}>
          {plantsArr.length !== 0 ? (
            plantsArr.map((value, index) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.plantContainer,
                    {
                      backgroundColor:
                        colourScheme[index % colourScheme.length],
                    },
                  ]}
                  onPress={() => {
                    props.navigation.navigate("PlantScreen",{
                      name: userPlants[value]['name'],
                      light: userPlants[value]['light'],
                      temp: userPlants[value]['temp'],
                      humidity: userPlants[value]['humidity'],
                      water: userPlants[value]['schedule'],
                      plantKey: value
                    });
                  }}
                >
                  <Text style={styles.plantTitle}>
                    {userPlants[value]["name"]}
                  </Text>
                  <Image
                    source={{ uri: userPlants[value]["image"] }}
                    style={styles.plantImage}
                  ></Image>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <View style={styles.infoContainer}>
                      <View>
                        <View style={styles.topInfoContainer}>
                          <Image
                            style={styles.iconImage}
                            source={require("./assets/images/droplet-icon.png")}
                          ></Image>
                          <Text style={styles.numberText}>
                            {userPlants[value]["humidity"] !== 0
                              ? userPlants[value]["humidity"] + "%"
                              : "—"}
                          </Text>
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
                          <Text style={styles.numberText}>
                            {userPlants[value]["temp"] !== 0
                              ? userPlants[value]["temp"] + "°C"
                              : "—"}
                          </Text>
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
                          <Text style={styles.numberText}>
                            {userPlants[value]["light"] !== 0
                              ? userPlants[value]["light"] + "%"
                              : "—"}
                          </Text>
                        </View>
                        <Text style={styles.greyText}>Sunlight</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={{ width: 300, height: 300 }}>
              <Image
                source={require("./assets/images/3dplant.png")}
                style={styles.imagePlant}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
      <Toast/>
    </SafeAreaView>
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
    marginTop: 30,
    marginBottom:10,
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
    borderRadius: 10,
    backgroundColor: "#f2f4e7",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    gap: 10,
  },
  plantMainContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    justifyContent: "center",
  },
  plantImage: {
    width: "70%",
    aspectRatio: 1,
  },
  plantTitle: {
    fontWeight: 600,
    fontSize: 15,
    textAlign:'center',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 200,
    backgroundColor: "#59c78b",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 15,
    zIndex: 100,
  },
  buttonText: {
    fontSize: 35,
    fontWeight: "300",
  },
  infoContainer: {
    width: 80,
    alignItems: "center",
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
  greyText: {
    color: "#646464",
    marginTop: 2,
  },
  imagePlant: {
    flex: 1,
    aspectRatio: 1,
    transform:[{rotate:'30deg'}]
  },
  welcomeText:{
    fontSize:25,
    color:'white',
  },
  nameText:{
    color:'white',
    fontSize:25,
    marginTop:30,
  }
});
