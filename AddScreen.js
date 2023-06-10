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

import { PlantContext } from "./App";
export default function AddScreen(props) {
  const { userPlants, setUserPlants } = useContext(PlantContext);
  const [waterDays, setWaterDays] = useState({
    M: false,
    T: false,
    W: false,
    Th: false,
    F: false,
    Sa: false,
    S: false,
  });
  const [name, setName] = useState("");
  const [light, setLight] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [temp, setTemp] = useState(0);
  const [updatedPlantObj, setUpdatedPlantObj] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [nameError, setNameError] = useState('')
  const [waterError, setWaterError] = useState('')
  const [showErr,setShowErr] = useState(false)
  const days = Object.keys(waterDays);
  const firstUpdate = useRef(true);
  useEffect(() => {
    console.log("water days:", waterDays);
  }, [waterDays]);
  useEffect(() => {
    console.log('Name: ',props.route.params.name)
    props.route.params.name?setName(props.route.params.name):setName(props.route.params.altName);
  }, []);
  useEffect(() => {
    if (!firstUpdate.current) {
      const tempObj = {
        ["plant" + (Object.keys(userPlants).length + 1)]: {
          name: name,
          light: light,
          temp: temp,
          humidity: humidity,
          schedule: waterDays,
          image: "https://cdn-icons-png.flaticon.com/512/6284/6284623.png",
        },
      };
      setUpdatedPlantObj(tempObj);
    }
    firstUpdate.current = false;
    console.log("firstUpdate", firstUpdate);
    console.log("Plants: ", userPlants);
  }, [isClicked]);
  useEffect(()=>{
    checkName();
    checkWater();
    setShowErr(false)
  },[name,waterDays])
  useEffect(()=>{
    console.log('Err:',nameError)
  },[])
  useEffect(() => {
    setUserPlants((prev) => {
      return { ...prev, ...updatedPlantObj };
    });
  }, [updatedPlantObj]);
function checkName(){
  if(name.trim()==''){
    setNameError('Name cannot be empty')
  }
  else{
    setNameError('none')
  }
}
function checkWater(){
  const keys = Object.keys(waterDays);
  let isSet = false;
  keys.map((value,index)=>{
    if(!isSet){
      if(waterDays[value]==true){
        setWaterError('none')
        isSet = true
      }
      else if(waterDays[value]==false){
        setWaterError('Choose at least a day for watering')
      }
    }
  })
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
          <Text style={styles.title}>Add New Plant</Text>
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
              <TouchableOpacity onPress={()=>{
                if(props.route.params.name){
                setName(props.route.params.name==name?props.route.params.altName:props.route.params.name)
                }
              }}>
                <Image
                  source={require("./assets/images/swap.png")}
                  style={styles.swapIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.errorText,{display:showErr&&nameError!=='none'?'flex':'none'}]}>{nameError}</Text>
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
          <Text style={[styles.errorText,{display:showErr&&waterError!=='none'?'flex':'none'}]}>{waterError}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if(nameError=='none'&&waterError=='none'){
                const plantsUpdated = { ...userPlants };
                setIsClicked(!isClicked);
                console.log(updatedPlantObj);
                props.navigation.navigate("Home");
              }
              setShowErr(true)
            }}
          >
            <Text style={styles.buttonText}>Add Plant</Text>
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
  errorText:{
    color:'#b74a58'
  }
});
