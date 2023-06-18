import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddScreen from "./AddScreen";
const Stack = createStackNavigator();
//pernual api key: sk-YEUj64834be2d285d1215

export default function AddPlantScreen(props) {
  return (
    <Stack.Navigator initialRouteName="SearchScreen">
      <Stack.Screen name="SearchScreen" component={SearchScreen}></Stack.Screen>
      <Stack.Screen name="AddScreen" component={AddScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}
const SearchScreen = (props) => {
  const [data, setData] = useState([]);
  const [dataExist, setDataExist] = useState(false);
  const [query, setQuery] = useState("");
  const [pageIndex, setPageIndex] = useState({page:1});
  const [pageMap, setPageMap] = useState([1, 2, 3, 4, 5]);
  const [lastPageNo, setLastPageNo] = useState(1);
  const [flagState, setFlagState] = useState(false)
  let lastPage = 1;
  const firstRender = useRef(true);
  function checkQuery() {
    if (query.trim().length == 0) {
      return false;
    } else {
      return true;
    }
  }
  function getPlant() {
    fetch(
      `https://trefle.io/api/v1/plants/search?token=RHoGLon2-C3mAIWbsIeijbLbFtD51jct1yd5T8btp9A&q=${encodeURIComponent(
        query
      )}&page=${pageIndex.page}`
    )
      .then((value) => {
        value.json().then((value) => {
          setData(value);
          console.log("🚀 ~ file: SearchScreen.js:66 ~ value.json ~ value:", value.data)

          const lastLink = value.links.last;
      const lastNumber = lastLink.split("=")[1].split("&")[0];
      const pageShown = lastNumber>5?5:lastNumber;
      console.log(pageShown)
      const mapArray = Array.from({ length: pageShown }, (_, number) => {
        if (lastNumber>5?pageIndex.page <= 3:pageIndex.page <= lastNumber) {
          return number + 1;
        } else if (pageIndex.page > 3 && lastNumber - pageIndex.page > 1) {
          return pageIndex.page - 2 + number;
        } else if (lastNumber - pageIndex.page == 1) {
          return pageIndex.page + number - 3;
        } else if (lastNumber - pageIndex.page == 0) {
          return pageIndex.page + number - 4;
        }
      });
      setPageMap(mapArray);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    if (!firstRender.current) {
      getPlant();
      console.log('PAGE INDEX',pageIndex)
    }
    firstRender.current = false;
  }, [pageIndex]);
  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      const lastLink = data.links.last;
      const lastNumber = lastLink.split("=")[1].split("&")[0];
      setLastPageNo(lastNumber);
      setDataExist(true)
    }
    else{
      setDataExist(false)
    }
  }, [data]);
  useEffect(() => {
    console.log("pageMap", pageMap);
  }),
    [pageMap];
  useEffect(() => {}, [query]);




  return (
    <View style={styles.container}>

      <Text style={styles.titleText}>Find a plant to add</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => {
            if (checkQuery()) {
              setPageIndex({page:1});
            }
          }}
        >
          <Image
            source={require("./assets/images/search-interface-symbol.png")}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <View style={styles.divider}></View>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          placeholderTextColor={"#433e52"}
          keyboardType="web-search"
          onSubmitEditing={() => {
            if (checkQuery()) {
              setPageIndex({page:1});
            }
          }}
          onChangeText={(value) => {
            setQuery(value);
          }}
        />
      </View>
      <ScrollView>
        {dataExist ? (
          data.data.length > 0 ? (
            <>
              {data.data.map((value, index) => {
                return (
                  <TouchableOpacity style={styles.resultContainer} key={index}>
                    <Image
                      source={{ uri: value.image_url }}
                      style={styles.plantImage}
                    />
                    <View style={styles.infoContainer}>
                      <View style={styles.textContainer}>
                        <Text style={styles.commonNameText}>
                          {value.common_name
                            ? value.common_name
                            : value.scientific_name}
                        </Text>
                        <Text style={styles.scientificNameText}>
                          {value.scientific_name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() =>
                          props.navigation.navigate("AddScreen", {
                            name: value.common_name,
                            altName: value.scientific_name,
                            image: value.image_url,
                          })
                        }
                      >
                        <Text style={styles.addText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignSelf: "center",
                  marginTop: 20,
                  marginBottom:10,
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={styles.pageContainer}
                  onPress={() => {
                    const lastLink = data.links.last;
                    const lastNumber = lastLink.split("=")[1].split("&")[0];
                    setLastPageNo(lastNumber);
                    console.log(
                      "🚀 ~ file: SearchScreen.js:164 ~ SearchScreen ~ lastPage:",
                      lastNumber
                    );
                    if (pageIndex.page > 1) {
                      setPageIndex((prev) => ({page:prev.page -= 1}));
                    }
                  }}
                >
                  <Image
                    source={require("./assets/images/right.png")}
                    style={[
                      styles.nextIcon,
                      { transform: [{ rotateY: "180deg" }] },
                    ]}
                  />
                </TouchableOpacity>
                {pageMap.map((value, index) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.pageContainer,
                        {
                          backgroundColor:
                            value == pageIndex.page ? "#598eee" : null,
                          borderWidth: value == pageIndex.page ? 0 : 1,
                        },
                      ]}
                      onPress={() => {
                        setPageIndex({page:value});
                      }}
                    >
                      <Text style={styles.pageText}>{value}</Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  style={styles.pageContainer}
                  onPress={() => {
                    const lastLink = data.links.last;
                    const lastNumber = lastLink.split("=")[1].split("&")[0];
                    console.log(
                      "🚀 ~ file: SearchScreen.js:164 ~ SearchScreen ~ lastPage:",
                      lastNumber
                    );
                    if (pageIndex.page < lastNumber) {
                      setPageIndex((prev) => ({page:prev.page += 1}));
                    }
                  }}
                >
                  <Image
                    source={require("./assets/images/right.png")}
                    style={styles.nextIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text
                  style={{ color: "white",alignSelf:'center', marginBottom:20, fontSize:17,fontWeight:500 }}
                >{`Page ${pageIndex.page} out of ${lastPageNo}`}
              </Text>
            </>
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.titleText}>No plants found</Text>
              <Image
                source={require("./assets/images/search-3d-icon.png")}
                style={{ width: 350, height: 350 }}
              />
            </View>
          )
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.titleText}>Search a plant species</Text>
            <Image
              source={require("./assets/images/search-3d-icon.png")}
              style={{ width: 350, height: 350 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingHorizontal: 20,
  },
  searchInput: {},
  titleText: {
    fontSize: 30,
    color: "white",
    marginTop: 30,
  },
  searchInput: {
    alignItems: "center",
    height: 50,
    borderRadius: 10,
    flex: 1,
    paddingLeft: 10,
    color: "white",
  },
  searchIcon: {
    width: 25,
    height: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#171717",
    borderColor: "#1d1d1d",
    borderWidth: 2,
    height: 50,
    paddingLeft: 10,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 20,
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#323043",
    marginHorizontal: 10,
  },
  plantImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  resultContainer: {
    width: "100%",
    backgroundColor: "#1d1d1d",
    borderRadius: 15,
    padding: 12,
    marginTop: 15,
  },
  commonNameText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  scientificNameText: {
    color: "#7a7a7a",
  },
  textContainer: {
    gap: 5,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 200,
    backgroundColor: "#59c78b",
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    fontSize: 35,
    fontWeight: "300",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },
  pageContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#7b7b7b",
    borderWidth: 1,
    borderRadius: 10,
  },
  pageText: {
    color: "white",
    fontWeight: 600,
  },
  nextIcon: {
    width: 20,
    height: 20,
  },
});
