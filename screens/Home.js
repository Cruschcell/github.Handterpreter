import { StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity, Modal, Dimensions} from 'react-native'
import {useCameraPermission, useCameraDevice, useSkiaFrameProcessor, Camera} from 'react-native-vision-camera';
import React,{useEffect,useState} from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Home() {
    const { hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');
    const [showPermissionScreen,setShowPermissionScreen]=useState(false);

    useEffect(()=>{
        if(hasPermission===false){
            setShowPermissionScreen(true);
        }
        else if(hasPermission===true){
            setShowPermissionScreen(false);
        }
    },[hasPermission]);

    const handlePermissionRequest = async () =>{
        const granted = await requestPermission();
        if(!granted){
            Alert.alert('Permission Required', 'Camera access is needed for this app to work',
                [
                    {text:'Ok',style:'default'},
                ]
            )
        }
        else{
            Alert.alert('Permission was granted',
                [
                    {text:'Ok',style:'default'},
                ]
            )
        }
    };

    if(showPermissionScreen || !hasPermission){
        return(
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content"/>
                <Text style={styles.title}>Camera Permission Required</Text>
                <Text style={styles.subText}>This app needs camera access to function</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={handlePermissionRequest}>
                    <Text style={styles.permissionText}>Grant Access</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
    if(device == null){
        return(
            <SafeAreaView style={styles.container}>
                <Text>No Camera Found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content"/>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Sign language interpreter</Text>
                <Text style={styles.subText}>Point your camera at the hand signs</Text>  
            </View>
            <View style={styles.cameraContainer}>
                <Camera
                style={styles.camera}
                device={device}
                isActive={true}
                video={true}
                audio={false}
                />
            </View>
            <View style={styles.outputContainer}>
                <Text style={styles.outputText}>This is where the converted output will appear</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#d0e0a2ff",
        alignItems:'center',
        paddingVertical:15,
        paddingHorizontal:20,
    },
    headerContainer:{
        marginTop:20,
        marginBottom:20,
        paddingHorizontal:20,
    },
    title:{
        textAlign:'center',
        marginBottom:20,
        fontSize:40,
        fontWeight:'bold',
    },
    subText:{
        textAlign:'center',
        fontSize:20,
    },
    permissionBtn:{
        padding:20,
        margin:20,
        alignItems:'center',
        backgroundColor:'#ffff',
        top:100,
        borderRadius:20,
    },
    permissionText:{
        fontSize:20,
        fontWeight:'bold',
    },
    cameraContainer:{
        width:350,
        height:350,
        marginTop:20,
        borderRadius:20,
        overflow:'hidden',
    },
    camera:{
        flex:1,
    },
    outputContainer:{
        marginTop:30,
        width:'100%',
        borderRadius:20,
        flex:1,
        backgroundColor:"#ffff",
        alignItems:'center',
    },
    outputText:{
        paddingVertical:20,
    }
})