import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import { remove, ref, getDatabase, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { PlantContext } from "./LoggedIn";
import { Toast } from "react-native-toast-message/lib/src/Toast";
//#f5d4d7, #c5ceed
export default function PlantScreen({ navigation, route }) {
  const { setFlagToast, flagToast } = useContext(PlantContext);
  const [paramUpdated, setParamUpdated] = useState(false);
  const firstRender = useRef(true);
  const days = ["M", "T", "W", "Th", "F", "Sa", "S"];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const auth = getAuth();
  function convertDay() {
    if (dayOfWeek == 0) {
      return "S";
    } else {
      return days[dayOfWeek - 1];
    }
  }
  useEffect(() => {
    console.log("isWatered:", route.params.isWatered);
  }, []);
  function checkNumber(number, symbol) {
    if (number == 0) {
      return "-";
    } else {
      return number + symbol;
    }
  }
  useEffect(() => {
    if (!firstRender.current) {
      Toast.show(flagToast.toastInfo);
    }
    firstRender.current = false;
  }, [flagToast]);
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} maxL>
            {route.params.name.slice(0, 17) +
              (route.params.name.length > 17 ? "..." : "")}
          </Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EditScreen", {
                  name: route.params.name,
                  light: route.params.light,
                  temp: route.params.temp,
                  humidity: route.params.humidity,
                  water: route.params.water,
                  altName: route.params.name,
                  type: "edit",
                  plantKey: route.params.plantKey,
                });
              }}
            >
              <Image
                source={require("./assets/images/editing.png")}
                style={styles.editIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const auth = getAuth();
                const dataRef = ref(
                  getDatabase(),
                  `/users/${auth.currentUser.uid}/plants/${route.params.plantKey}`
                );
                remove(dataRef)
                  .then((value) => {
                    navigation.navigate("HomeScreen");
                    console.log("PLANT DELETED");
                    setFlagToast({
                      toastInfo: {
                        type: "success",
                        text1: "Plant deleted",
                        text2:
                          "Plant successfully removed from your collection! 🗑️🌿",
                      },
                      flag: !flagToast,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    setFlagToast({
                      toastInfo: {
                        type: "error",
                        text1: "Deletion failed",
                        text2:
                          "Failed to delete the plant. Please try again later. 🚫",
                      },
                      flag: !flagToast,
                    });
                  });
              }}
            >
              <Image
                source={require("./assets/images/delete.png")}
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}
        >
          <View
            style={[
              styles.infoContainer,
              { height: 250, justifyContent: "center", alignItems: "center" },
            ]}
          >
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
            <View
              style={[styles.infoContainer, { backgroundColor: "#f5d4d7" }]}
            >
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
            <View
              style={[styles.infoContainer, { backgroundColor: "#c5ceed" }]}
            >
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
                          { opacity: convertDay() == value ? 1 : 0 },
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
                          {route.params.water[value] ? (
                            <Image
                              source={require("./assets/images/droplet-icon.png")}
                              style={styles.iconImage}
                            />
                          ) : (
                            <Text style={styles.dayText}>{value}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.wateredButton}
              onPress={() => {
                const userRef = ref(
                  getDatabase(),
                  `/users/${auth.currentUser.uid}/plants/${route.params.plantKey}`
                );
                const date = new Date();
                console.log(
                  "🚀 ~ file: PlantScreen.js:219 ~ PlantScreen ~ route.params.userPlants[route.params.plantKey].lastWateredSnapshot.day:",
                  route.params.userPlants[route.params.plantKey]
                    .lastWateredSnapshot.day
                );

                if (route.params.isWatered && (paramUpdated || !paramUpdated)) {
                  const days = 5;
                  const millisecondsIn5Days = 24 * 60 * 60 * 1000 * 5;
                  update(userRef, {
                    lastWatered: {
                      day:
                        route.params.userPlants[route.params.plantKey]
                          .lastWatered.day - 5,
                      number:
                        route.params.userPlants[route.params.plantKey]
                          .lastWatered.number - millisecondsIn5Days,
                    },
                    watered: false,
                  })
                    .then((value) => {
                      console.log("UNDO SUCCESS");
                      navigation.setParams({ isWatered: false });
                      setParamUpdated(!paramUpdated);
                      setFlagToast({
                        toastInfo: {
                          type: "info",
                          text1: "Undo Watering",
                          text2: "Watering undone! 💦🌿",
                        },
                        flag: !flagToast,
                      });
                    })
                    .catch((err) => console.log(err));
                } else {
                  update(userRef, {
                    lastWatered: {
                      day: date.getDay(),
                      number: Date.now(),
                    },
                    watered: true,
                  }).then((value) => {
                    navigation.setParams({ isWatered: true });
                    setParamUpdated(!paramUpdated);

                    setFlagToast({
                      toastInfo: {
                        type: "success",
                        text1: "Watering Success",
                        text2: "Your plant has been watered! 🌿💧",
                      },
                      flag: !flagToast,
                    });
                  });
                }
              }}
            >
              <Text style={styles.buttonText}>
                {route.params.isWatered && (paramUpdated || !paramUpdated)
                  ? "Undo"
                  : "Water"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Toast />
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
    paddingLeft: 20,
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
    alignSelf: "center",
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  editIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  deleteIcon: {
    width: 32,
    height: 32,
  },
  iconContainer: {
    flexDirection: "row",
    marginRight: 20,
  },
  wateredButton: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#19a4ec",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: 600,
  },
});
