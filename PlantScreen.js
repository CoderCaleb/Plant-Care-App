import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
//#f5d4d7, #c5ceed
export default function PlantScreen({ navigation, route }) {
  const days = ["M", "T", "W", "Th", "F", "Sa", "S"];
  const today = new Date();
  const dayOfWeek = today.getDay();
  function convertDay() {
    if (dayOfWeek == 0) {
      return "S";
    } else {
      return days[dayOfWeek - 1];
    }
  }
  useEffect(() => {
    console.log("day: ", dayOfWeek);
  }, []);
  function checkNumber(number, symbol) {
    if (number == 0) {
      return "-";
    } else {
      return number + symbol;
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{route.params.name}</Text>
          <TouchableOpacity onPress={()=>{
            navigation.navigate('EditScreen',{
              name: route.params.name,
              light: route.params.light,
              temp: route.params.temp,
              humidity: route.params.humidity,
              water: route.params.water,
              altName: route.params.name,
              type:'edit',
              plantKey: route.params.plantKey
            })
          }}>
            <Image source={require('./assets/images/editing.png')} style={styles.editIcon}/>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',gap:10,justifyContent:'center'}}>
        <View style={[styles.infoContainer,{height:250,justifyContent:'center',alignItems:'center'}]}>
          <View style={styles.iconTextContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require("./assets/images/sun-icon-white.png")}
                style={styles.iconImage}
              />
            </View>
            <Text style={styles.infoTitle}>Light</Text>
          </View>
          <Text style={styles.infoText}>
            {checkNumber(route.params.light, "%")}
          </Text>
        </View>
        <View>
          <View style={[styles.infoContainer, { backgroundColor: "#f5d4d7" }]}>
            <View style={styles.iconTextContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={require("./assets/images/temp-icon-white.png")}
                  style={styles.iconImage}
                />
              </View>
              <Text style={styles.infoTitle}>Temp</Text>
            </View>
            <Text style={styles.infoText}>
              {checkNumber(route.params.temp, "°C")}
            </Text>
          </View>
          <View style={[styles.infoContainer, { backgroundColor: "#c5ceed" }]}>
            <View style={styles.iconTextContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={require("./assets/images/droplet-icon-white.png")}
                  style={styles.iconImage}
                />
              </View>
              <Text style={styles.infoTitle}>Humidity</Text>
            </View>
            <Text style={styles.infoText}>
              {checkNumber(route.params.humidity, "%")}
            </Text>
          </View>
        </View>
        </View>
        <View style={styles.waterContainer}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={styles.waterTitle}>Watering schedule</Text>
            <ScrollView horizontal={true}>
              <View style={styles.waterInnerContainer}>
                {days.map((value, index) => {
                  return (
                    <View style={{ alignItems: "center", gap: 5 }} key={index}>
                      <View
                        style={[
                          styles.circle,
                          { opacity: convertDay() == value ? "1" : "0" },
                        ]}
                      ></View>
                      <TouchableOpacity
                        
                        style={[
                          styles.scheduleContainer,
                          {
                            backgroundColor: !route.params.water[value]
                              ? "#f2f2f2"
                              : "#59c78b",
                          },
                        ]}
                      >
                        <Text style={styles.dayText}>{index + 1}</Text>
                        <View style={styles.iconContainerWater}>
                          {route.params.water[value]?
                          <Image source={require('./assets/images/droplet-icon.png')} style={styles.iconImage}/>
                          :<Text style={styles.dayText}>{value}</Text>
                }
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  titleText: {
    fontSize: 30,
    fontWeight: 600,
    color: "white",
    paddingLeft:20,
  },
  infoContainer: {
    width: 160,
    height: 120,
    backgroundColor: "#e9dbc2",
    borderRadius: 15,
    marginBottom: 10,
  },
  iconImage: {
    width: "50%",
    height: "50%",
  },
  imageContainer: {
    backgroundColor: "black",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 15,
    marginTop: 10,
  },
  infoText: {
    fontSize: 35,
    fontWeight: 600,
    alignSelf: "center",
    marginTop: 15,
  },
  sideImage: {
    flex: 1,
    aspectRatio: 1,
  },
  waterContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 15,
    alignSelf:'center'
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
  iconContainerWater: {
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
  infoTitle: {
    fontSize: 16,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: "black",
    opacity: 0,
  },
  titleContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginTop: 40,
    marginBottom: 20,
    justifyContent:'space-between'
  },
  editIcon:{
    width:30,
    height:30,
    marginRight:20
  }
});
