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
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import {set, ref, getDatabase, update} from 'firebase/database'
import HomeScreen from "./HomeScreen";
import PlantScreen from "./PlantScreen";
import AddScreen from "./AddScreen";
import SearchScreen from "./SearchScreen";
import LoggedIn from "./LoggedIn";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";
import firebase from "firebase/compat/app";
const Stack = createStackNavigator();
const firebaseConfig = {
  apiKey: "AIzaSyDP4NZ7s4sCmOzvoL2C5t25y67fTYXOEZQ",
  authDomain: "plant-care-app-7883b.firebaseapp.com",
  databaseURL: "https://plant-care-app-7883b-default-rtdb.firebaseio.com",
  projectId: "plant-care-app-7883b",
  storageBucket: "plant-care-app-7883b.appspot.com",
  messagingSenderId: "947636991805",
  appId: "1:947636991805:web:cefebb5eb6d6d665a23754"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
else{
  console.log('no app found')
}
export default function App() {
  const dbRef = ref(getDatabase(),'/')
  useEffect(()=>{
    
  },[])
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignInScreen}></Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUpScreen}></Stack.Screen>
        <Stack.Screen name="LoggedIn" component={LoggedIn} options={{headerShown:false}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
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
