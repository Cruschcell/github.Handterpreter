import * as React from 'react';
import {useState, useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import{ NavigationContainer} from "@react-navigation/native";
import{ createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from './screens/Home';
import LearningHub from './screens/LearningHub';
import CoursePage from './screens/CoursePage';
import Login from './screens/Login';
import Logs from './screens/Logs';
import Profile from './screens/Profile';
import Settings from './screens/Settings';
import SignUp from './screens/SignUp';
import TTSMode from './screens/TTSMode';
import Welcomepage from './screens/Welcomepage';



const Stack = createNativeStackNavigator();

export default function App(){
  return(
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Welcomepage"}>
          <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
          <Stack.Screen name="LearningHub" component={LearningHub} options={{headerShown:false}}/>
          <Stack.Screen name="CoursePage" component={CoursePage} options={{headerShown:false}}/>
          <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
          <Stack.Screen name="Logs" component={Logs} options={{headerShown:false}}/>
          <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
          <Stack.Screen name="Settings" component={Settings} options={{headerShown:false}}/>
          <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
          <Stack.Screen name="TTSMode" component={TTSMode} options={{headerShown:false}}/>
          <Stack.Screen name="Welcomepage" component={Welcomepage} options={{headerShown:false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}