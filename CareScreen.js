import { View, Text, SafeAreaView,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

export default function CareScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.subText}>My Plants 🌱</Text>
      <Text style={styles.infoText}>You have plants</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    welcomeText: {
      fontSize: 25,
      color: 'white',
    },
    nameText: {
      color: 'white',
      fontSize: 25,
      marginTop: 30,
    },
    helloText: {},
    subText: {
      fontSize: 30,
      color: 'white',
      fontWeight: '500',
      marginTop: 30,
      marginBottom: 10,
    },
    infoText: {
      fontSize: 18,
      color: 'white',
      marginBottom: 10,
    },
    container: {
      flex: 1,
      backgroundColor: '#0f0f0f',
      gap: 10,
      paddingHorizontal: 10,
    },
  });