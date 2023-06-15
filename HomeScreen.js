import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useContext, useRef } from "react";
import { PlantContext } from "./LoggedIn";
import { createStackNavigator } from "@react-navigation/stack";
import { getDatabase, ref, set, get, onValue, update } from "firebase/database";
import AddScreen from "./AddScreen";
import PlantScreen from "./PlantScreen";
import { getAuth } from "firebase/auth";
import Toast from "react-native-toast-message";
const Stack = createStackNavigator();
export default function Navigator(props) {
  useEffect(() => {}, []);
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
  const [screen, setScreen] = useState("care");
  const [DATA, setDATA] = useState([userPlants]);
  const [allWatered, setAllWatered] = useState(false)
  const firstRender = useRef(true);
  const colourScheme = ["#c9d3ee", "#f7d4da", "#e9dbc2", "#caf4ed"];
  const auth = getAuth()
  const plantsArr = Object.keys(userPlants);
  useEffect(() => {
    const newArr = plantsArr.map((value, index) => {
      return {
        id: index,
        userPlants: userPlants[value],
        plantKey: value,
      };
    });
    console.log("newArr:", newArr);
    setDATA(newArr);
  }, [userPlants]);
  function lastWatered(lastWatered) {
    return Math.floor((Date.now() - lastWatered) / 86400000);
  }

  function nextWater(lastWatered, schedule) {
    let dayFound = false;
    const days = Object.keys(schedule);
    let lastWateredDay;
    days.sort((a, b) => {
      const order = ["M", "T", "W", "Th", "F", "Sa", "S"];
      return order.indexOf(a) - order.indexOf(b);
    });
    if (lastWatered == 0) {
      lastWateredDay = "S";
    } else {
      lastWateredDay = days[lastWatered - 1];
    }

    const newArray = days.slice(days.indexOf(lastWateredDay));
    console.log("NEW ARRAY", lastWateredDay);
    let daysToWater = 0;

    for (let i of newArray) {
      console.log(schedule[i]);
      if (!dayFound) {
        if (schedule[i]) {
          dayFound = true;
          console.log("Day:", days);
          return daysToWater;
        } else {
          daysToWater++;
        }
      }
    }
    for (let i of days) {
      if (!dayFound) {
        if (schedule[i]) {
          dayFound = true;
          console.log("Day:", days);
          return daysToWater;
        } else {
          daysToWater++;
        }
      }
    }
  }
  useEffect(() => {

      const watered = DATA.every(item => item.lastWatered !== 0);
      console.log('watered',watered)
      setAllWatered(watered);

    
  }, [DATA]);
  useEffect(()=>{
    console.log('All watered:',allWatered)
  },[allWatered])
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
        <Text style={styles.nameText}>
          <Text style={styles.helloText}>Hello</Text>,{" "}
          {getAuth().currentUser.displayName} 👋
        </Text>
      </View>
      <View style={styles.navigatorContainer}>
        <TouchableOpacity
          style={[
            styles.subContainer,
            { borderColor: screen == "care" ? "#59c78b" : "#a6a7a7" },
          ]}
          onPress={() => {
            setScreen("care");
          }}
        >
          <Text
            style={[
              styles.navigatorText,
              { color: screen == "care" ? "#59c78b" : "#a6a7a7" },
            ]}
          >
            Care
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.subContainer,
            { borderColor: screen == "plants" ? "#59c78b" : "#a6a7a7" },
          ]}
          onPress={() => {
            setScreen("plants");
          }}
        >
          <Text
            style={[
              styles.navigatorText,
              { color: screen == "plants" ? "#59c78b" : "#a6a7a7" },
            ]}
          >
            Plants
          </Text>
        </TouchableOpacity>
      </View>
      {screen == "plants" ? (
        <>
          <Text style={styles.subText}>My Plants 🌱</Text>
          <Text style={styles.infoText}>
            You have {plantsArr.length} plants
          </Text>
          <View style={styles.plantMainContainer}>
            {plantsArr.length !== 0 ? (
              <FlatList
                data={DATA}
                renderItem={({ item }) => (
                  <PlantBox
                    value={item.userPlants}
                    id={item.id}
                    navigation={props.navigation}
                    lastWatered={
                      item.userPlants.lastWatered
                        ? lastWatered(item.userPlants.lastWatered.number)
                        : null
                    }
                    nextWater={
                      item.userPlants.lastWatered && item.userPlants.schedule
                        ? nextWater(
                            item.userPlants.lastWatered.day,
                            item.userPlants.schedule
                          )
                        : null
                    }
                    plantKey={item.plantKey}
                  />
                )}
              />
            ) : (
              <View style={{ width: 300, height: 300 }}>
                <Image
                  source={require("./assets/images/3dplant.png")}
                  style={styles.imagePlant}
                />
              </View>
            )}
          </View>
        </>
      ) : (
        <>
          <SafeAreaView style={styles.container}>
            <Text style={styles.subText}>Water Today 🌿</Text>
            {allWatered?<View style={{ width: 300, height: 300 }}>
              <Text style={styles.infoText}>You watered all your plants today 👍</Text>
              <Image style={styles.imagePlant} source={require('./assets/images/3dplant.png')}/>
            </View>:null}

            <FlatList
              data={DATA}
              renderItem={({ item }) =>
                item.userPlants ? (
                  
                  <PlantWaterBox
                    value={item.userPlants}
                    id={item.id}
                    navigation={props.navigation}
                    lastWatered={
                      item.userPlants.lastWatered
                        ? lastWatered(item.userPlants.lastWatered.number)
                        : null
                    }
                    nextWater={
                      item.userPlants.lastWatered && item.userPlants.schedule
                        ? nextWater(
                            item.userPlants.lastWatered.day,
                            item.userPlants.schedule
                          )
                        : null
                    }
                    plantKey={item.plantKey}
                  />
                ) : null
              }
            />
          </SafeAreaView>
        </>
      )}
      <StatusBar style="auto" />
      <Toast />
    </SafeAreaView>
  );
  function PlantWaterBox(props) {
    useEffect(() => {
      console.log("day:", props.nextWater);
    }, []);
    return (
      <>
      {props.lastWatered!==0&&props.nextWater==0?
      <TouchableOpacity
        style={[
          styles.plantContainer,
          {
            backgroundColor: "#1d1d1d",
            height: 80,
            paddingLeft:0,
          },
        ]}
        onPress={() => {
          props.navigation.navigate("PlantScreen", {
            name: props.value["name"],
            light: props.value["light"],
            temp: props.value["temp"],
            humidity: props.value["humidity"],
            water: props.value["schedule"],
            plantKey: props.plantKey,
          });
        }}
      >
        <View style={styles.listContainer}>
          <Image
            style={styles.plantWaterImage}
            source={{ uri: props.value.image }}
          />
          <View style={{height:40}}>
            <Text style={styles.plantTitle}>{props.value["name"]}</Text>
            <Text style={styles.greyText}>
              {props.lastWatered == 0
                ? "Watered today"
                : `Watered ${props.lastWatered} days ago`}
            </Text>
          </View>

          <TouchableOpacity style={styles.wateredButton} onPress={()=>{
            const date = new Date()
            const userRef = ref(
              getDatabase(),
              `/users/${auth.currentUser.uid}/plants/${props.plantKey}`
            );
            update(userRef,{
              lastWatered:{
                day:date.getDay(),
                number: Date.now()
              }
            })
            .then((value)=>{
              console.log('PLANT WATERED')
            })
            .catch((err)=>{
              console.log(err)
            })
          }}>
            <Image source={require('./assets/images/grey-drop.png')} style={styles.buttonIcon}/>
          </TouchableOpacity>
          </View>
      </TouchableOpacity>:null
        }
        </>
    );
  }
  function PlantBox(props) {
    useEffect(() => {
      console.log("day:", props.nextWater);
    }, []);
    return (
      <TouchableOpacity
        style={[
          styles.plantContainer,
          {
            backgroundColor: "#1d1d1d",
          },
        ]}
        onPress={() => {
          props.navigation.navigate("PlantScreen", {
            name: props.value["name"],
            light: props.value["light"],
            temp: props.value["temp"],
            humidity: props.value["humidity"],
            water: props.value["schedule"],
            plantKey: props.plantKey,
          });
        }}
      >
        <View style={styles.listContainer}>
          <Image
            style={styles.plantImage}
            source={{ uri: props.value.image }}
          />
          <View>
            <Text style={styles.plantTitle}>{props.value["name"]}</Text>
            <Text style={styles.greyText}>
              {props.lastWatered == 0
                ? "Watered today"
                : `Watered ${props.lastWatered} days ago`}
            </Text>
            <View style={styles.statsContainer}>
              <View
                style={[
                  styles.iconContainer,
                  props.nextWater == 0&&props.lastWatered>0
                    ? { backgroundColor: "#feece9", borderColor: "#cfdeec" }
                    : null,
                ]}
              >
                <Image
                  source={
                    props.nextWater == 0&&props.lastWatered>0
                      ? require("./assets/images/drop-red.png")
                      : require("./assets/images/drop-green.png")
                  }
                  style={styles.iconImage}
                />
              </View>
              <Text
                style={[
                  styles.greenText, //props.nextWater == 0&&props.lastWatered>0 = today is watering day and last watered not today
                  { color: props.nextWater == 0&&props.lastWatered>0 ? "#ffecea" : "#59c78b" },
                ]}
              >
                {props.nextWater == 0
                  ? "Water today"
                  : `water in ${props.nextWater} days`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
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
    marginBottom: 10,
    fontSize: 25,
    color: "white",
    fontWeight: 500,
  },
  infoText: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
  plantContainer: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#f2f4e7",
    justifyContent: "center",
    gap: 10,
    height: 120,
    paddingLeft: 10,
    marginBottom: 15,
  },
  listContainer: {
    flexDirection: "row",
    alignItems:'center'
  },
  plantMainContainer: {
    gap: 5,
    justifyContent: "center",
  },
  plantImage: {
    height: '90%',
    aspectRatio:1,
    borderRadius: 10,
    marginRight: 15,
  },
  plantWaterImage: {
    height: '100%',
    aspectRatio:1,
    borderRadius: 10,
    marginRight:10,
  },
  plantTitle: {
    fontWeight: 500,
    fontSize: 15,
    color: "white",
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
  iconContainer: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#d7fde7",
    borderColor: "#59c78b",
    borderWidth: 3,
    marginVertical: 5,
  },
  iconImage: {
    width: "50%",
    height: "50%",
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
    transform: [{ rotate: "30deg" }],
  },
  greenText: {
    color: "#f3b4b3",
  },
  welcomeText: {
    fontSize: 25,
    color: "white",
  },
  nameText: {
    color: "white",
    fontSize: 25,
    marginTop: 30,
    marginBottom: 30,
  },
  helloText: {},
  navigatorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navigatorText: {
    color: "#a6a7a7",
    fontSize: 22,
    textAlign: "center",
    paddingBottom: 12,
    fontWeight: 600,
  },
  subContainer: {
    flex: 1,
    borderBottomWidth: 4,
    borderColor: "#59c78b",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 20,
  },
  wateredButton:{
    right:10,
    position:'absolute',
    justifyContent:'center',
    alignItems:'center',
    height:35,
    width:35,
    borderColor:'#646464',
    borderWidth:2,
    borderRadius:12,
  },
  buttonIcon:{
    width:'50%',
    height:"50%"
  }
});
