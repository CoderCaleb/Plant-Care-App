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
import React, {useState, useEffect} from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
export default function SignInScreen({navigation, route}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showErr, setShowErr] = useState(false)
  return (
    <View style={styles.container}>
      <Image source={require("./assets/images/gardening-pic.png")} style={styles.mainImg}/>
      <Text style={styles.titleText}>Let's sign you in</Text>
      <Text style={styles.subText}>Welcome back, you have been missed</Text>
      <View style={styles.inputBox}>
        <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor={'#3c3e49'} onChangeText={(value)=>{
            setEmail(value)
        }}/>
        <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor={'#3c3e49'} secureTextEntry={true} onChangeText={(value)=>{
            setPassword(value)
        }}/>
        <View style={[styles.errorContainer,{display:showErr?'flex':'none'}]}>
            <Text style={styles.errorText}>Incorrect username or password</Text>
        </View>
      </View>
      
      <Text style={styles.promptText}>
        Dont have an account?{" "}
          <Text style={styles.clickText} onPress={()=>{navigation.navigate('SignUp')}}>Register</Text>
      </Text>
      <TouchableOpacity style={styles.mainButton} onPress={()=>{
        const auth = getAuth()
        signInWithEmailAndPassword(auth,email,password)
        .then((creds)=>{
            const user = creds.user
            navigation.navigate('LoggedIn')
        })
        .catch(err=>{
            console.log(err)
            setShowErr(true)
        })
      }}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#0f0f0f",
        justifyContent:'center',
        alignItems:'center'
    },
    mainImg:{
        flex:0.9,
        aspectRatio:1,
    },
    titleText:{
        fontSize:30,
        color:'white',
        fontWeight:600,
    },
    subText:{
        color:'#646265',
        fontSize:20,
        marginBottom:30,
    },
    input:{
        width:'100%',
        height:55,
        backgroundColor:'#252a34',
        borderRadius:15,
        paddingLeft:20,
        color:'white',
    },
    inputBox:{
        width:'80%',
        gap:10,
    },
    promptText:{
        color:'white',
        marginTop:10,
    },
    clickText:{
        color:'white',
        fontWeight:500,
    },
    mainButton:{
        width:'80%',
        height:45,
        backgroundColor:'#59c78b',
        borderRadius:12,
        justifyContent:'center',
        alignItems:'center',
        marginTop:25,
    },
    buttonText:{
        color:'white',
        fontWeight:'600',
    },
    errorText: {
        color: "#8e3743",
      },
      errorContainer: {
        width: "100%",
        backgroundColor: "#fedbdf",
        justifyContent: "center",
        height: 50,
        borderRadius: 8,
        paddingLeft: 10,
        display:'none'
      },
});
