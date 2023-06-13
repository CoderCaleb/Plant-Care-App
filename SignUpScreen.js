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
import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import {update, ref, getDatabase, set} from 'firebase/database'
export default function SignInScreen({ navigation, route }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    checkPassword();
    checkEmail();
    checkUsername();
    setShowError(false);
  }, [username, email, password]);
  function checkUsername() {
    if (!username.length > 0) {
      setNameError("Please enter your name");
      return false
    } else {
      setNameError("none");
      return true
    }
  }
  function checkEmail() {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    } else {
      setEmailError("none");
      console.log(emailError);
      return true;
    }
  }
  function checkPassword() {
    const hasNumber = /\d/;

    if (password.length == 0) {
      setPasswordError("Password cannot be empty");
    } else if (password.length <= 7 && password.length > 0) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    } else if (!hasNumber.test(password)) {
      setPasswordError("Password needs to have at least 1 number");
      return false;
    } else if (!/[a-zA-Z]/.test(password)) {
      setPasswordError("Password needs to have at least 1 letter");
      return false;
    } else {
      setPasswordError("none");
      return true;
    }
  }
  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/images/gardening-pic.png")}
        style={styles.mainImg}
      />
      <Text style={styles.titleText}>Let's sign you up</Text>
      <Text style={styles.subText}>
        Get ready to nurture your own garden. Sign up now!
      </Text>
      <View style={styles.inputBox}>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={"#3c3e49"}
            onChangeText={(value) => {
              setUsername(value);
            }}
          />
          <Text
            style={[
              styles.errorText,
              { display: showError && nameError !== "none" ? "flex" : "none" },
            ]}
          >
            {nameError}
          </Text>
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={"#3c3e49"}
            onChangeText={(value) => {
              setEmail(value);
            }}
          />
          <Text
            style={[
              styles.errorText,
              { display: showError && emailError !== "none" ? "flex" : "none" },
            ]}
          >
            {emailError}
          </Text>
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter a strong password"
            placeholderTextColor={"#3c3e49"}
            secureTextEntry={true}
            onChangeText={(value) => {
              setPassword(value);
            }}
          />
          <Text
            style={[
              styles.errorText,
              {
                display:
                  showError && passwordError !== "none" ? "flex" : "none",
              },
            ]}
          >
            {passwordError}
          </Text>
        </View>
      </View>
      <Text style={styles.promptText}>
        Already have an account?{" "}
        <Text
          style={styles.clickText}
          onPress={() => {
            navigation.navigate("SignIn");
          }}
        >
          Login
        </Text>
      </Text>
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => {
          const auth = getAuth();
          const usersRef = ref(getDatabase(),'/users')
          if (checkPassword() && checkEmail() && checkUsername()) {
            createUserWithEmailAndPassword(auth, email, password)
            .then(
              (value) => {
                user = value.user;
                console.log('Sign up successful')
                updateProfile(user,{
                    displayName:username,
                    photoURL:'https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg'
                })
                .then((result)=>{
                    update(usersRef,{
                        [user.uid]:{
                            name:user.displayName,
                            plants:{
                                
                            }
                        }
                    })
                })
                
              }
            )
            .catch((err)=>{
                console.log(err)
            })
          }
          else{
            console.log('creds not valid')
          }
          setShowError(true);
        }}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
  },
  mainImg: {
    flex: 0.9,
    aspectRatio: 1,
  },
  titleText: {
    fontSize: 30,
    color: "white",
    fontWeight: 600,
  },
  subText: {
    color: "#646265",
    fontSize: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#252a34",
    borderRadius: 15,
    paddingLeft: 20,
    color: "white",
  },
  inputBox: {
    width: "80%",
    gap: 10,
  },
  promptText: {
    color: "white",
    marginTop: 10,
  },
  clickText: {
    color: "white",
    fontWeight: 500,
  },
  mainButton: {
    width: "80%",
    height: 45,
    backgroundColor: "#59c78b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  errorText: {
    color: "#b74a58",
    display: "none",
  },
});
