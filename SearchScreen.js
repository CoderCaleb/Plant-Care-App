import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, {useState,useEffect} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddScreen from "./AddScreen";
const Stack = createStackNavigator();
//pernual api key: sk-YEUj64834be2d285d1215


export default function AddPlantScreen(props) {
    return(
    <Stack.Navigator initialRouteName="SearchScreen">
        <Stack.Screen name='SearchScreen' component={SearchScreen}></Stack.Screen>
        <Stack.Screen name='AddScreen' component={AddScreen}></Stack.Screen>
    </Stack.Navigator>
    )
}
const SearchScreen = (props) =>{
  const [data, setData] = useState({})
  const [dataExist, setDataExist] = useState(false)
  const [query, setQuery] = useState('')

  function getPlant(){
    fetch(`https://trefle.io/api/v1/plants/search?token=RHoGLon2-C3mAIWbsIeijbLbFtD51jct1yd5T8btp9A&q=${encodeURIComponent(query)}`)
    .then((value)=>{
        value.json()
        .then((value)=>{
            console.log(value)
            setData(value)
        })
     })
     .catch((err)=>{
        console.log(err)
     })
  }

useEffect(()=>{
    console.log('data:',data)
    Object.keys(data).length==0?setDataExist(false):setDataExist(true)
},[data])
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Find a plant to add</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={()=>getPlant(query)}>
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
          onSubmitEditing={()=>getPlant(query)}
          onChangeText={(value)=>{setQuery(value)}}
        />
      </View>
      <ScrollView>
      {dataExist?
      data.data.length>0?data.data.map((value,index)=>{
        return(
        <TouchableOpacity style={styles.resultContainer}>

        <Image source={{uri:value.image_url}} style={styles.plantImage}/>
        <View style={styles.infoContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.commonNameText}>{value.common_name?value.common_name:value.scientific_name}</Text>
                <Text style={styles.scientificNameText}>{value.scientific_name}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={()=>props.navigation.navigate('AddScreen',{
                name:value.common_name,
                altName:value.scientific_name
            })}>
                <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
        </View>

      </TouchableOpacity>
        )
      }):<Text style={styles.titleText}>No Plants found</Text>
       :<Text style={styles.titleText}>Search something</Text>
      } 
      </ScrollView>
    </View>
  );
}



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
    paddingLeft:10,
    color:'white',
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
    borderWidth:2,
    height: 50,
    paddingLeft:10,
    borderRadius:10,
    marginTop:15,
    marginBottom:20,

  },
  divider:{
    width:1,
    height:'80%',
    backgroundColor:'#323043',
    marginHorizontal:10,
  },
  plantImage:{
    width:'100%',
    height:200,
    borderRadius:12,
  },
  resultContainer:{
    width:'100%',
    backgroundColor:'#1d1d1d',
    borderRadius:15,
    padding:12,
    marginTop:15,
  },
  commonNameText:{
    fontWeight:'bold',
    fontSize:20,
    color:'white',
  },
  scientificNameText:{
    color:'#7a7a7a',
  },
  textContainer:{
    gap:5,
  },
  addButton:{
    width: 60,
    height: 60,
    borderRadius: 200,
    backgroundColor: "#59c78b",
    justifyContent: "center",
    alignItems: "center",
  },
  addText:{
    fontSize: 35,
    fontWeight: "300",
  },
  infoContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:18,
  },
  
});
