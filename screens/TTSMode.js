import { StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity, Dimensions, NativeModules, NativeEventEmitter, TextInput, Keyboard, DeviceEventEmitter} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {Rect, Path, Defs, G, ClipPath} from 'react-native-svg';

import {initTTS,speak, stopTTS, VOICE_KEYS} from './TTShandler';

const HandsIcon = () => (
  <Svg width="26" height="26" fill="none">
    <Path
      fill="#565656"
      d="m13.53 14.083-1.007-2.015a1.623 1.623 0 0 1 .726-2.177l.282-.141 6.207 5.915c.542.51.845 1.224.845 1.96v5.667A2.708 2.708 0 0 1 17.875 26H5.958a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h4.875V22.75h-6.5a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h6.5V19.5H3.25a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h7.583V16.25H4.875a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h8.656Zm-.768-6.37c-.91.434-1.268.672-1.766 1.29L8.07 5.914a1.08 1.08 0 0 1 1.57-1.484l3.12 3.282Zm-2.319 2.264a3.75 3.75 0 0 0-.216 1.94h-.932l-2.46-2.59A1.07 1.07 0 0 1 6.88 7.8a1.079 1.079 0 0 1 1.528.043l2.036 2.134Zm11.581 5.092.954-.899c.541-.51.855-1.224.855-1.972V3.63l-.292-.108a1.623 1.623 0 0 0-2.08.975l-.77 2.123L14.734.336a1.08 1.08 0 1 0-1.57 1.484l4.105 4.322-.79.748-5.222-5.503a1.079 1.079 0 0 0-1.866.711 1.08 1.08 0 0 0 .295.773l4.095 4.311 2.882 2.568 3.91 3.716.661.628c.315.293.575.618.791.975Z"
    />
  </Svg>
);

const TTSIcon = () => (
    <Svg width="26" height="26" fill="none">
        <Path
        fill="#565656"
        d="M4.5 24.75c-.619 0-1.148-.22-1.588-.66a2.17 2.17 0 0 1-.662-1.59v-18c0-.619.22-1.148.662-1.588.44-.44.97-.661 1.588-.662h9.169l-2.25 2.25H4.5v18h12.375v-2.25h2.25v2.25a2.17 2.17 0 0 1-.66 1.59c-.44.44-.97.66-1.59.66H4.5Zm2.25-4.5V18h7.875v2.25H6.75Zm0-3.375v-2.25h5.625v2.25H6.75Zm10.125 0-4.5-4.5H9V6.75h3.375l4.5-4.5v14.625Zm2.25-3.431V5.68a4.606 4.606 0 0 1 1.631 1.603c.413.675.619 1.435.619 2.279 0 .843-.206 1.603-.619 2.278a4.606 4.606 0 0 1-1.631 1.603Zm0 4.837V15.92c1.313-.469 2.39-1.28 3.234-2.433.844-1.152 1.266-2.46 1.266-3.924 0-1.463-.422-2.77-1.266-3.923-.843-1.153-1.922-1.964-3.234-2.433V.844c1.95.506 3.563 1.56 4.837 3.164 1.276 1.604 1.913 3.455 1.913 5.554 0 2.1-.637 3.952-1.913 5.556-1.274 1.604-2.887 2.658-4.837 3.163Z"
        />
    </Svg>
)

const LearnIcon = () => (
    <Svg width="26" height = "26" fill="none">
        <Path
        fill="#565656"
        fillRule="evenodd"
        d="M4.219 14.221v3.68a3.094 3.094 0 0 0 1.766 2.794l5.625 2.671a3.094 3.094 0 0 0 2.655 0l5.625-2.67a3.095 3.095 0 0 0 1.766-2.795v-3.679l-7.284 3.642a3.207 3.207 0 0 1-2.869 0L4.22 14.22Z"
        clipRule="evenodd"
        />
        <Path
        fill="#565656"
        fillRule="evenodd"
        d="M12.258 3.897a1.52 1.52 0 0 1 1.359 0l9.74 4.87c1.12.56 1.12 2.157 0 2.717l-9.74 4.871a1.52 1.52 0 0 1-1.359 0l-9.74-4.871c-1.12-.56-1.12-2.158 0-2.717l9.74-4.87Z"
        clipRule="evenodd"
        />
        <Path
        fill="#565656"
        fillRule="evenodd"
        d="M22.309 9.186a.844.844 0 0 1 1.131-.378l2.25 1.125a.843.843 0 0 1 .466.755v3.937a.844.844 0 1 1-1.687 0V11.21l-1.783-.893a.844.844 0 0 1-.377-1.131Z"
        clipRule="evenodd"
        />
    </Svg>
)

const LogsIcon = () =>(
    <Svg width="26" height="26" fill="none">
        <Path
        stroke="#565656"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.333}
        d="M12 22H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v9m-2.25 10v-6.5"
        />
        <Path
        stroke="#565656"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.333}
        d="m15.5 17.25.75-.75 1.5-1.5 1.5 1.5.75.75"
        />
        <Path
        stroke="#565656"
        strokeLinecap="round"
        strokeWidth={2.333}
        d="M8 8h8m-8 4h4"
        />
    </Svg>
)

const ProfileIcon = () => (
    <Svg width="26" height="26" fill="none">
        <Path
        fill="#565656"
        fillRule="evenodd"
        d="M8.667 7.583a4.333 4.333 0 1 1 8.666 0 4.333 4.333 0 0 1-8.666 0Zm0 6.5A5.417 5.417 0 0 0 3.25 19.5a3.25 3.25 0 0 0 3.25 3.25h13a3.25 3.25 0 0 0 3.25-3.25 5.417 5.417 0 0 0-5.417-5.417H8.667Z"
        clipRule="evenodd"
        />
    </Svg>
)

const SettingsIcon = () =>(
    <Svg width="26" height= "26" fill="none">
        <Path
        fill="#565656"
        d="M21.125 13c0-.25-.011-.488-.033-.737l2.015-1.527a1.09 1.09 0 0 0 .282-1.408l-2.026-3.5a1.07 1.07 0 0 0-1.354-.455l-2.33.986c-.4-.281-.822-.53-1.267-.736l-.314-2.503a1.087 1.087 0 0 0-1.072-.953h-4.041a1.09 1.09 0 0 0-1.083.953l-.315 2.503a8.22 8.22 0 0 0-1.267.736l-2.33-.986a1.07 1.07 0 0 0-1.353.455L2.61 9.338a1.092 1.092 0 0 0 .281 1.409l2.015 1.527a7.909 7.909 0 0 0 0 1.463l-2.015 1.527a1.09 1.09 0 0 0-.281 1.409l2.026 3.499c.27.476.855.671 1.354.455l2.329-.986c.4.282.823.53 1.267.737l.315 2.502c.065.542.53.953 1.072.953h4.04c.543 0 1.008-.411 1.073-.953l.314-2.502a8.218 8.218 0 0 0 1.268-.737l2.33.986a1.07 1.07 0 0 0 1.353-.455l2.026-3.5a1.092 1.092 0 0 0-.282-1.408l-2.015-1.527c.033-.25.044-.488.044-.737Zm-8.082 3.792c-2.09 0-3.791-1.701-3.791-3.792 0-2.09 1.7-3.792 3.791-3.792S16.835 10.91 16.835 13c0 2.09-1.701 3.792-3.792 3.792Z"
        />
    </Svg>
)

const SpeakIcon = () => (
  <Svg width="35" height="35">
    <Path
      fill="#565656"
      d="M13.5 18c-1.65 0-3.063-.587-4.238-1.762C8.087 15.063 7.5 13.65 7.5 12c0-1.65.588-3.063 1.762-4.237C10.438 6.588 11.85 6 13.5 6c1.65 0 3.063.588 4.238 1.763C18.913 8.938 19.5 10.35 19.5 12s-.587 3.063-1.762 4.238C16.563 17.413 15.15 18 13.5 18Zm-12 9v-1.2c0-.85.219-1.631.657-2.343A4.394 4.394 0 0 1 3.9 21.825a22.24 22.24 0 0 1 4.725-1.743 20.717 20.717 0 0 1 9.75 0c1.6.389 3.175.97 4.725 1.743a4.378 4.378 0 0 1 1.744 1.632c.438.713.657 1.494.656 2.343V27c0 .825-.294 1.532-.88 2.12a2.882 2.882 0 0 1-2.12.88h-18a2.888 2.888 0 0 1-2.118-.88A2.895 2.895 0 0 1 1.5 27Z"
    />
    <Path
      stroke="#565656"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M24 7.617s1.472 2.944 0 6.543M28.58 5s2.944 5.3 0 11.777"
    />
  </Svg>
)

const SpeakCancelIcon = () => (
  <Svg width="35" height="35" viewBox="0 0 35 35" fill="none">
    <Rect x="10" y="10" width="15" height="15" rx="2" fill="#565656" />
  </Svg>
);

const DropdownUpIcon = () =>(
  <Svg width = "24" height="17">
    <Path
      fill="#565656"
      d="M9 5.25a1.29 1.29 0 0 1 .998.48l3.157 3.825a1.575 1.575 0 0 1 .195 1.658 1.32 1.32 0 0 1-1.192.787H5.843a1.32 1.32 0 0 1-1.193-.787 1.575 1.575 0 0 1 .195-1.658L8.003 5.73A1.29 1.29 0 0 1 9 5.25Z"
    />
  </Svg>
)

const DropdownDownIcon = () =>(
  <Svg width = "24" height="17">
    <Path
      fill="#565656"
      d="M9 12.75a1.29 1.29 0 0 1-.998-.48L4.845 8.445a1.575 1.575 0 0 1-.195-1.658A1.32 1.32 0 0 1 5.842 6h6.315a1.32 1.32 0 0 1 1.193.787 1.575 1.575 0 0 1-.195 1.658L9.997 12.27a1.29 1.29 0 0 1-.997.48Z"
    />
  </Svg>
)

const {width:SCREEN_WIDTH} = Dimensions.get('window');

const BottomNavBar = ({navigation, handleSpeakPress, isSpeaking}) => {
  const width = SCREEN_WIDTH;
  const height = 90; 
  const cornerRadius = 25;
  const centerX = width / 2;

  const holeWidth = 45;  
  const holeDepth = 35;  
  const centerCurveRadius = 15; 

  const pathData = `
    M0,${height} 
    L0,${cornerRadius} 
    Q0,0 ${cornerRadius},0 
    L${centerX - holeWidth - centerCurveRadius},0 
    Q${centerX - holeWidth},0 ${centerX - holeWidth},${centerCurveRadius} 
    A ${holeWidth},${holeDepth} 0 0,0 ${centerX + holeWidth},${centerCurveRadius} 
    Q${centerX + holeWidth},0 ${centerX + holeWidth + centerCurveRadius},0 
    L${width - cornerRadius},0 
    Q${width},0 ${width},${cornerRadius} 
    L${width},${height} 
    Z
  `;

  return (
    <View style={styles.navContainer}>
      <Svg width={width} height={height}>
        <Path d={pathData} fill="#E0E0E0" />
      </Svg>
      <View style={styles.tabIconsContainer}>
        <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('Home')}>
                <HandsIcon/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={()=> navigation.navigate('TTSMode')}>
                <TTSIcon/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('LearningHub')}>
                <LearnIcon/>
            </TouchableOpacity>
        </View>
        
        <View style={{width:80}}/>

        <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('Logs')}>
                <LogsIcon/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('Profile')}>
                <ProfileIcon/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('Settings')}>
                <SettingsIcon/>
            </TouchableOpacity>
        </View>
      </View>
        <TouchableOpacity style={{
          position: 'absolute',
          top: -30, 
          width: 65, 
          height: 65, 
          borderRadius: 35, 
          backgroundColor: '#E0E0E0',
          alignItems: 'center', 
          justifyContent: 'center'
        }} onPress={handleSpeakPress}>
          {isSpeaking? <SpeakCancelIcon/> : <SpeakIcon/>}
        </TouchableOpacity>    
    </View>
  );
};

export default function Ttsmode({navigation}) {
  const [dropDownExpanded,setDropDownExpanded] = useState(false);
  const [selectedVoice,setSelectedVoice]=useState(VOICE_KEYS[0]);

  const [inputText,setInputText] = useState('');
  const [isReady,setIsReady] = useState(false);
  const [isSpeaking,setIsSpeaking]=useState(false);

  useEffect(()=>{
    const setup = async () =>{
      const success = await initTTS(selectedVoice);
      setIsReady(success);
    };
    setup();
    
    const unsubscribeBlur = navigation.addListener('blur', async()=>{
      console.log("Leaving TTS mode, stopping TTS");
      await stopTTS();
      setIsSpeaking(false);
    });
    return() =>{
      speechListener.remove();
      unsubscribeBlur();
    };
  }, [navigation]);

  const handleSpeakPress = async () =>{
    if(!isReady){
      Alert.alert("Hold up", "Model still loading...");
      return;
    }
    if(!inputText){
      Alert.alert("Empty","Please type something first");
      return;
    }
    if(isSpeaking){
      await stopTTS();
      setIsSpeaking(false);
    }else{
      setIsSpeaking(true);
      await speak(inputText);
    }
  };

  const handleSelectVoice = (voice)=>{
    setSelectedVoice(voice);
    setDropDownExpanded(false);

    if(voice !== selectedVoice){
      setIsReady(false);
      
      setTimeout(async ()=>{
        const success = await initTTS(voice);
        setIsReady(success);
      }, 100);
    }
  };

  const toggleDropdown = () =>{
    Keyboard.dismiss();
    setDropDownExpanded(!dropDownExpanded);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.label}>TTS Mode</Text>
        </View>
        <TextInput style={styles.inputBox}
        multiline={true}
        placeholder={isReady ? "Type your text here..." : "Loading model..."}
        value={inputText} onChangeText={setInputText}/>
      </View>

      <View style={styles.modelSelection}>
        <View style={styles.currentModel}>
          <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
            <Text style={styles.dropdownText}>{selectedVoice}</Text>
            {dropDownExpanded ? <DropdownUpIcon/> : <DropdownDownIcon/>}
          </TouchableOpacity>
        </View>
        
        {dropDownExpanded && (
        <View style={styles.dropdownContainer}>
          {VOICE_KEYS.map((option,index)=>(
            <TouchableOpacity
            key={index}
            style={styles.dropdownOption}
            onPress={()=>handleSelectVoice(option)}
            >
              <Text style={styles.dropdownText}>{option}</Text>
              {index < VOICE_KEYS.length - 1 && (
                <View style={styles.divider}></View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        )}
      </View>

      <View style={styles.textCounter}>
        <Text style={styles.textCounterText}>{inputText.length}/5000</Text>
      </View>
      <BottomNavBar navigation={navigation} handleSpeakPress={handleSpeakPress} isSpeaking={isSpeaking}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C9C2B5",
    alignItems: 'center',
    paddingVertical: 15,
  },
  card:{
    marginTop:12,
    marginBottom:20,
    paddingHorizontal:15,
    paddingVertical:1,
    backgroundColor:"#D9D9D9",
    borderRadius:15,
    shadowColor: "#000",
    shadowOffset: {width: 0,height: 4, },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 1,
  },
  cardHeader:{
    paddingVertical:20,
  },
  label:{
    textAlign:"center",
    bottom:8,
    opacity:0.7
  },
  inputBox:{
    backgroundColor:"#f5f5f5ff",
    marginHorizontal:5,
    marginBottom:40,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: 340,
    height:620,
    textAlignVertical:"top",
    textAlign:'left',
  },
  navContainer:{
    position:"absolute",
    bottom:-5,
    width:"100%",
    alignItems:"center",
  },
  tabIconsContainer:{
    position:"absolute",
    top:0,
    width:"100%",
    height:"100%",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    paddingBottom:12
  },
  iconGroup:{
    flexDirection:"row",
    width:"40%",
    justifyContent:"space-evenly"
  },
  icon:{
    padding:10,
    alignItems:"center",
    justifyContent:"center",
  },
  modelSelection:{
    position:"absolute",
    top:670,
    right:50,
    width:125,
    zIndex:100,
    elevation:10,
  },
  currentModel:{
    backgroundColor:"#D9D9D9",
    borderTopStartRadius:10,
    borderTopEndRadius:10,
    padding:7,
  },
  dropdownText:{
    marginLeft:5,
    fontSize:14,
    color:"#565656"
  },
  dropdown:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  dropdownContainer:{
    backgroundColor:"#FFFFFF",
    borderBottomStartRadius:10,
    borderBottomEndRadius:10,
    padding:7,
  },
  dropdownOption: {
    paddingVertical: 5,
  },
  divider:{
    height:1,
    width:"100%",
    backgroundColor:"#ccc",
    marginTop:5,
  },
  textCounter:{
    position:"absolute",
    top:677,
    left:60,
    elevation:10,
    zIndex:100,
  },
  textCounterText:{
    opacity:0.5,
    fontSize:14,
  }
})