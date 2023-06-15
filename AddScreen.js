import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  Button,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import { update, getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { PlantContext } from "./LoggedIn";
export default function AddScreen(props) {
  const { userPlants, setUserPlants, setFlagToast, flagToast } = useContext(PlantContext);
  const waterSchedule = props.route.params.water;
  const screenType = props.route.params.type;
  const [waterDays, setWaterDays] = useState(
    screenType == "edit"
      ? {
          M: waterSchedule.M,
          T: waterSchedule.T,
          W: waterSchedule.W,
          Th: waterSchedule.Th,
          F: waterSchedule.F,
          Sa: waterSchedule.Sa,
          S: waterSchedule.S,
        }
      : {
          M: false,
          T: false,
          W: false,
          Th: false,
          F: false,
          Sa: false,
          S: false,
        }
  );
  console.log(waterDays);
  const [name, setName] = useState("");
  const [light, setLight] = useState(
    screenType == "edit" ? props.route.params.light : 0
  );
  const [humidity, setHumidity] = useState(
    screenType == "edit" ? props.route.params.humidity : 0
  );
  const [temp, setTemp] = useState(
    screenType == "edit" ? props.route.params.temp : 0
  );
  const [updatedPlantObj, setUpdatedPlantObj] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [nameError, setNameError] = useState("");
  const [waterError, setWaterError] = useState("");
  const [showErr, setShowErr] = useState(false);
  const days = Object.keys(waterDays);
  const firstUpdate = useRef(true);
  useEffect(() => {
    console.log("water days:", waterDays);
  }, [waterDays]);
  useEffect(() => {
    console.log("Name: ", props.route.params.name);
    props.route.params.name
      ? setName(props.route.params.name)
      : setName(props.route.params.altName);
  }, []);
  function generatePlantID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    const length = 8;
    
    let uid = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      
      uid += chars.charAt(randomIndex);
    }
    
    return uid;
  }
  useEffect(() => {
    const auth = getAuth();
    const date = new Date
    if (!firstUpdate.current) {
      if (screenType !== "edit") {
        const tempObj = {
          [generatePlantID()]: {
            name: name,
            light: light,
            temp: temp,
            humidity: humidity,
            schedule: waterDays,
            image: props.route.params.image,
            lastWatered: {number:Date.now(),day:date.getDay()}
          },
        };
        const userRef = ref(
          getDatabase(),
          `/users/${auth.currentUser.uid}/plants`
        );
        update(userRef, tempObj).then((value) => {
          console.log("PLANT ADDED");
          setFlagToast({toastInfo:{
            type:'success',
            text1: 'Plant added',
            text2: 'Plant successfully added to your collection! 🌿'
          },flag:!flagToast})
        })
        .catch(()=>{
          setFlagToast({toastInfo:{
            type:'error',
            text1: 'Add failed',
            text2: 'Failed to add plant to your collection. Please try again. ❌'
            },flag:!flagToast})
        });
        setUpdatedPlantObj(tempObj);
      } else {
        const tempObj = {
          name: name,
          light: light,
          temp: temp,
          humidity: humidity,
          schedule: waterDays,
        };
        const userRef = ref(
          getDatabase(),
          `/users/${auth.currentUser.uid}/plants/${props.route.params.plantKey}`
        );
        update(userRef, tempObj)
          .then((value) => {
            console.log("PLANT UPDATED");
            setFlagToast({toastInfo:{
              type:'success',
              text1: 'Plant updated',
              text2: 'Plant information successfully updated! 🌱'
            },flag:!flagToast})
          })
          .catch((err) => {
            console.log(err);
            setFlagToast({toastInfo:{
              type: 'error',
text1: 'Update failed',
text2: 'Failed to update plant information. Please try again later. 🚫'
            },flag:!flagToast})
          });
        setUpdatedPlantObj(tempObj);
      }
    }

    firstUpdate.current = false;
    console.log("firstUpdate", firstUpdate);
    console.log("Plants: ", userPlants);
  }, [isClicked]);
  useEffect(() => {
    checkName();
    checkWater();
    setShowErr(false);
  }, [name, waterDays]);
  useEffect(() => {
    console.log("Err:", nameError);
    console.log("Key", props.route.params.plantKey);
  }, []);

  function checkName() {
    if (name.trim() == "") {
      setNameError("Name cannot be empty");
    } else {
      setNameError("none");
    }
  }
  function checkWater() {
    const keys = Object.keys(waterDays);
    let isSet = false;
    keys.map((value, index) => {
      if (!isSet) {
        if (waterDays[value] == true) {
          setWaterError("none");
          isSet = true;
        } else if (waterDays[value] == false) {
          setWaterError("Choose at least a day for watering");
        }
      }
    });
  }
  const InputBox = (props) => {
    return (
      <View style={styles.inputNumContainer}>
        <TextInput
          style={styles.input}
          placeholder="Light requirement"
          placeholderTextColor="#606060"
          keyboardType="number-pad"
          editable={false}
          value={
            props.variable !== 0 ? String(props.variable + props.unit) : "-"
          }
        />
        <View style={styles.arrowContainer}>
          <TouchableOpacity
            style={[styles.arrowButton, { borderBottomWidth: 1 }]}
            onPress={() => {
              props.variable < 100 ? props.setVar((prev) => prev + 5) : null;
            }}
          >
            <Text style={styles.buttonText}>⋀</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => {
              props.variable > 0 ? props.setVar((prev) => prev - 5) : null;
            }}
          >
            <Text style={styles.buttonText}>⋁</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <ScrollView>
          <Text style={styles.title}>
            {screenType == "edit" ? "Edit Plant" : "Add New Plant"}
          </Text>
          <View style={styles.lineBreak}></View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Name</Text>
            <View style={styles.inputNumContainer}>
              <TextInput
                style={styles.input}
                placeholder="Plant name"
                placeholderTextColor="#606060"
                onChangeText={(value) => {
                  setName(value);
                }}
                value={name}
              />
              <TouchableOpacity
                onPress={() => {
                  if (props.route.params.name) {
                    setName(
                      props.route.params.name == name
                        ? props.route.params.altName
                        : props.route.params.name
                    );
                  }
                }}
              >
                <Image
                  source={require("./assets/images/swap.png")}
                  style={styles.swapIcon}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.errorText,
                { display: showErr && nameError !== "none" ? "flex" : "none" },
              ]}
            >
              {nameError}
            </Text>
            <Text style={styles.inputTitle}>
              Light % - <Text style={styles.optionalText}>Optional</Text>
            </Text>
            <InputBox
              variable={light}
              setVar={setLight}
              key={"light"}
              unit={"%"}
            />
            <Text style={styles.inputTitle}>
              Humidity % - <Text style={styles.optionalText}>Optional</Text>
            </Text>
            <InputBox
              variable={humidity}
              setVar={setHumidity}
              key={"humidity"}
              unit={"%"}
            />
            <Text style={styles.inputTitle}>
              Temperature °C -{" "}
              <Text style={styles.optionalText}>
                Optional
                <Text />
              </Text>
            </Text>
            <InputBox
              variable={temp}
              setVar={setTemp}
              key={"temp"}
              unit={"°C"}
            />
          </View>
          <View style={styles.waterContainer}>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <Text style={styles.waterTitle}>Watering schedule</Text>
              <ScrollView horizontal={true}>
                <View style={styles.waterInnerContainer}>
                  {days.map((value, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.scheduleContainer,
                          {
                            backgroundColor: !waterDays[value]
                              ? "#f2f2f2"
                              : "#59c78b",
                          },
                        ]}
                        onPress={() => {
                          const tempDays = { ...waterDays };
                          tempDays[value] = !tempDays[value];
                          setWaterDays(tempDays);
                        }}
                      >
                        <Text style={styles.dayText}>{index + 1}</Text>
                        <View style={styles.iconContainer}>
                          <Text style={styles.dayText}>{value}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
          <Text
            style={[
              styles.errorText,
              { display: showErr && waterError !== "none" ? "flex" : "none" },
            ]}
          >
            {waterError}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (nameError == "none" && waterError == "none") {
                setIsClicked(!isClicked);
                console.log(updatedPlantObj);
                console.log("Edit Plant Clicked");
                props.navigation.navigate("Home",{screen:'HomeScreen'});
              }

              setShowErr(true);
            }}
          >
            <Text style={styles.buttonText}>
              {screenType == "edit" ? "Edit Plant" : "Add Plant"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.07)",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "white",
  },
  title: {
    marginVertical: 20,
    color: "white",
    fontSize: 23,
  },
  lineBreak: {
    width: "100%",
    height: 1,
    backgroundColor: "#333333",
    marginBottom: 20,
  },
  inputContainer: {
    gap: 10,
  },
  inputTitle: {
    color: "#b3b3b3",
  },
  addButton: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#59c78b",
    marginTop: 30,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 17,
    color: "white",
  },
  innerContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "#282828",
    paddingHorizontal: 20,
    borderRadius: 20,
    paddingBottom: 30,
  },
  waterContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 30,
  },
  waterInnerContainer: {
    width: "80%",
    flexDirection: "row",
    gap: 10,
  },
  waterTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 10,
  },
  scheduleContainer: {
    width: 38,
    height: 65,
    backgroundColor: "#f2f2f2",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  iconContainer: {
    width: 25,
    height: 25,
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
    fontWeight: 600,
  },
  inputNumContainer: {
    flexDirection: "row",
    width: "100%",
    height: 45,
    paddingLeft: 10,
    color: "white",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1d1d1d",
    alignItems: "center",
  },
  arrowContainer: {
    height: "100%",
    width: 50,
    borderRadius: 10,
    backgroundColor: "#3f6cf9",
  },
  arrowButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    height: 45,
    paddingLeft: 10,
    color: "white",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
  },
  optionalText: {
    fontSize: 13,
    fontStyle: "italic",
  },
  swapIcon: {
    width: 35,
    height: 35,
    marginRight: 15,
  },
  errorText: {
    color: "#b74a58",
  },
});
