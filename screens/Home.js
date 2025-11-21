import { StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity, Modal, Dimensions, NativeModules, NativeEventEmitter} from 'react-native'
import {useCameraPermission, useCameraDevice, useSkiaFrameProcessor, useFrameProcessor, Camera, VisionCameraProxy} from 'react-native-vision-camera';
import React,{useEffect,useState, useRef} from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';

const { HandLandmarks}=NativeModules;
const handLandmarksEmitter = new NativeEventEmitter(HandLandmarks);

const handLandmarksPlugin = VisionCameraProxy.initFrameProcessorPlugin('handLandmarks',{});

function handLandmarks(frame){
    'worklet';
    if(handLandmarksPlugin==null){
        throw new Error('Failed to load frame processor plugin');
    }
    return handLandmarksPlugin.call(frame);
}

export default function Home() {
    const { hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');
    const [showPermissionScreen,setShowPermissionScreen]=useState(false);
    const [handLandmarks,setHandLandmarks] = useState(null);
    const[isHandLandmarkerInitialized,setIsHandLandmarkerInitialized] = useState(false);

    const camera = useRef(null);

    useEffect(()=>{
        initializeHandLandmarker();
    
        const subscription = handLandmarksEmitter.addListener(
            'onHandLandmarksDetected',
            (event)=>{
                console.log("Hand landmarks detected",event);
                setHandLandmarks(event.landmarks);
            }
        );
        return()=>{
            subscription.remove();
        }
    },[]);

    useEffect(()=>{
        if(hasPermission===false){
            setShowPermissionScreen(true);
        }
        else if(hasPermission===true){
            setShowPermissionScreen(false);
        }
    },[hasPermission]);

    const initializeHandLandmarker = async () =>{
        try{
            await HandLandmarks.initialize();
            setIsHandLandmarkerInitialized(true);
            console.log('HandLandmarker init success');
        }catch(e){
            console.error('Failed to init HandLandmarker',e);
            Alert.alert('Init error','Failed to init hand detection');
        }
    };

    const frameProcessor=useSkiaFrameProcessor((frame)=>{
        'worklet'
        handLandmarks(frame);
    },[]);

    const updateHandLandmarks = (landmarks) =>{
        setHandLandmarks(landmarks);
    };

    const takeSnapshotAndDetect = async () =>{
        if(!camera.current)return;
        try{
            const snapshot = await camera.current.takeSnapshot({
                quality: 85,
                skipMetadata:true,
            });
            const{HandLandmarkerModule} = require('./NativeModules');
            const result = await HandLandmarkerModule.detectFromBase64(snapshot.base64);
            setHandLandmarks(result);
        }catch(e){
            console.error('Snapshot detection error',e);
        }
    };

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
                ref={camera}
                style={styles.camera}
                device={device}
                isActive={true}
                video={true}
                audio={false}
                frameProcessor={frameProcessor}
                pixelFormat="yuv"
                />
            </View>
            <TouchableOpacity
                style={styles.snapshotButton}
                onPress={takeSnapshotAndDetect}
                disabled={!isHandLandmarkerInitialized}
            >
                <Text style={styles.snapshotButtonText}>
                    {isHandLandmarkerInitialized ? 'Detect hands' : 'Initializating'}
                </Text>
            </TouchableOpacity>

            <View style={styles.outputContainer}>
                <Text style={styles.outputText}>This is where the converted output will appear</Text>
                {handLandmarks &&(
                    <View style={styles.landmarksContainer}>
                        <Text style={styles.landmarksTitle}>Hand landmarks:</Text>
                        <Text style={styles.landmarksData}>
                            {JSON.stringify(handLandmarks,null,2)}
                        </Text>
                    </View>
                )}
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
    snapshotButton:{
        position:'absolute',
        bottom:10,
        alignSelf:'center',
        backgroundColor:'#0000',
        padding:10,
        borderRadius:20,
    },
    snapshotButtonText:{
        color:'#ffff',
        fontWeight:'bold',
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
    },
    landmarksContainer:{
        width:'100%',
        marginTop:10,
    },
    landmarksTitle:{
        fontWeight:'bold',
        marginBottom:5,
    },
    landmarksData:{
        fontSize:10,
    }
})