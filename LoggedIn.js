import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, createContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getDatabase, ref, set, get, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import HomeScreen from "./HomeScreen";
import CareScreen from "./CareScreen";
import PlantScreen from "./PlantScreen";
import AddScreen from "./AddScreen";
import SearchScreen from "./SearchScreen";
const Tab = createBottomTabNavigator();
export const PlantContext = createContext({});

export default function LoggedIn() {
  const [userPlants, setUserPlants] = useState(
    {humidity: 10,
    image: 'https://bs.plantnet.org/image/o/38d4346034e89f4e5917357f2bc62cdcd150a3af',
    lastWatered: {
      number: Date.now(),
      day: new Date().getDay(),
    },
    light: 0,
    name: 'Tarovine',
    schedule: {
      M: true,
      T: false,
      W:true,
      Th:false,
      F:false,
      Sa:true,
      S:false
    },
    temp: 5,
  lastWaterDate:new Date().getDay()});
  const [flagToast, setFlagToast] = useState(false)
  const [isWatered, setIsWatered] = useState(false)
  useEffect(()=>{
    const auth = getAuth()
    onValue(ref(getDatabase(),`/users/${auth.currentUser.uid}/plants`),(snapshot)=>{

        if(snapshot.exists()){
            const data = snapshot.val()
            setUserPlants(data)
            console.log('plant info fetched')
        }
        else{
          setUserPlants({})
          console.log('plant info fetched FAILED')
        }
    })
  },[])
  /*
  useEffect(()=>{
    const auth = getAuth()
    const userRef = ref(getDatabase(),`/users/${auth.currentUser.uid}`)
    set(userRef,userPlants)
    .then((value)=>{
        console.log('DB UPDATED')
    })
  },[userPlants])
  */
  return (
    <PlantContext.Provider value={{ userPlants, setUserPlants, flagToast,setFlagToast }}>
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel:false,
            headerShown:false,
            tabBarStyle: {
              backgroundColor:'white',
              borderWidth:0,
              height:60,
            },
          }}
        >

          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => {
                return (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Image
                      source={require("./assets/images/home.png")}
                      style={[
                        styles.tabIcon,
                        { tintColor: focused ? "#59c78b" : "#748c94" },
                      ]}
                    ></Image>
                    <Text style={{ color: focused ? "#59c78b" : "#748c94" }}>
                      Home
                    </Text>
                  </View>
                );
              },
            }}
          ></Tab.Screen>
          <Tab.Screen
            name="Add"
            component={SearchScreen}
            options={{
              tabBarIcon: ({ focused }) => {
                return (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Image
                      source={require("./assets/images/add.png")}
                      style={[
                        styles.tabIcon,
                        { tintColor: focused ? "#59c78b" : "#748c94" },
                      ]}
                    />
                    <Text style={{ color: focused ? "#59c78b" : "#748c94" }}>
                      Add
                    </Text>
                  </View>
                );
              },
            }}
          ></Tab.Screen>
          
        </Tab.Navigator>
    </PlantContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    gap: 10,
    paddingLeft: 100,
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
    gap: 10,
  },
  plantImage: {
    width: "70%",
    flex: 0.9,
  },
  plantTitle: {
    fontWeight: 600,
    fontSize: 15,
  },
  tabIcon: {
    width: 25,
    height: 25,
  },
});
