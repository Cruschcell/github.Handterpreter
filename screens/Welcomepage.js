import { StyleSheet, Text, View , TouchableOpacity, Image} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'; 
import React from 'react'

export default function Welcomepage({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>Handterpreter</Text>
        <Text style={styles.subText}>
          Instantly break down communication barriers with
          the power of your smartphone. Handterpreter uses 
          advanced, real-time technology to accurately
          interpret sign language on the fly, making conversations
          seamless, inclusive, and natural.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={()=>navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={()=>navigation.navigate('SignUp')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Image source={require('../assets/blackman.png')}
        style={styles.blackmanInCorner}
        resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#C3BDB2",
  },
  content:{
    flex:1,
    paddingLeft:30,
    paddingRight:80,
  },
  headerText:{
    fontSize:40,
    marginTop:80,
    fontWeight:400,
    color:"#2C2C2C",
    textDecorationStyle:"solid",
    textDecorationColor:"#A8A091",
    textShadowOffset:{width:0,height:4},
    textShadowRadius:4,
  },
  subText:{
    marginTop:40,
    fontSize:20,
    fontWeight:400,
    color:"#2C2C2C"
  },
  buttonContainer:{
    gap:16,
    marginTop:40,
  },
  loginButton:{
    paddingVertical:14,
    paddingHorizontal:50,
    borderRadius:20,
    alignItems:"center",
    alignSelf:"flex-start",
    backgroundColor:"#EEE79A",
  },
  signupButton:{
    paddingVertical:14,
    paddingHorizontal:43,
    borderRadius:20,
    alignItems:"center",
    alignSelf:"flex-start",
    backgroundColor:"#F5F5F5"
  },
  buttonText:{
    fontSize:16,
    fontWeight:"bold",
    color:"#2C2C2C"
  },
  blackmanInCorner:{
    position:"absolute",
    width:350,
    height:370,
    left:77,
    top:520,
    textShadowOffset:{width:0,height:4},
    textShadowRadius:4,
  }


})