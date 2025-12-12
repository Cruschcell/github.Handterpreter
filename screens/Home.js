import { StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity, Dimensions, NativeModules, NativeEventEmitter, ScrollView } from 'react-native';
import { useCameraPermission, useCameraDevice, useFrameProcessor, Camera, VisionCameraProxy } from 'react-native-vision-camera';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Canvas, Circle, Line, Group, vec } from "@shopify/react-native-skia";
import Svg, { Rect, Path, Defs, G, ClipPath } from 'react-native-svg';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { initTTS, speak, stopTTS } from './TTShandler';
import { useSettings } from './SettingsContext';
import { useLogs } from './LogContext';

const { HandLandmarks } = NativeModules;
const handLandmarksEmitter = new NativeEventEmitter(HandLandmarks);
const handLandmarksPlugin = VisionCameraProxy.initFrameProcessorPlugin('handLandmarks', {});

const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],         // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8],         // Index
    [5, 9], [9, 13], [13, 17], [0, 17],     // Palm Base
    [9, 10], [10, 11], [11, 12],            // Middle
    [13, 14], [14, 15], [15, 16],           // Ring
    [17, 18], [18, 19], [19, 20]            // Pinky
];

const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "del", "nothing", "space"];

const WORDS = [ // TS very scuffed unfortunately
  "bye",
  "dad",
  "drink",
  "happy",
  "hello",
  "home",
  "icecream",
  "like",
  "listen",
  "look",
  "mom",
  "no",
  "pizza",
  "please",
  "sad",
  "sleep",
  "thankyou",
  "think",
  "who",
  "yes"
];
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PREVIEW_WIDTH = 350;
const PREVIEW_HEIGHT = 350;

const HandsIcon = () => (<Svg width="26" height="26" fill="none"><Path fill="#565656" d="m13.53 14.083-1.007-2.015a1.623 1.623 0 0 1 .726-2.177l.282-.141 6.207 5.915c.542.51.845 1.224.845 1.96v5.667A2.708 2.708 0 0 1 17.875 26H5.958a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h4.875V22.75h-6.5a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h6.5V19.5H3.25a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h7.583V16.25H4.875a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h8.656Zm-.768-6.37c-.91.434-1.268.672-1.766 1.29L8.07 5.914a1.08 1.08 0 0 1 1.57-1.484l3.12 3.282Zm-2.319 2.264a3.75 3.75 0 0 0-.216 1.94h-.932l-2.46-2.59A1.07 1.07 0 0 1 6.88 7.8a1.079 1.079 0 0 1 1.528.043l2.036 2.134Zm11.581 5.092.954-.899c.541-.51.855-1.224.855-1.972V3.63l-.292-.108a1.623 1.623 0 0 0-2.08.975l-.77 2.123L14.734.336a1.08 1.08 0 1 0-1.57 1.484l4.105 4.322-.79.748-5.222-5.503a1.079 1.079 0 0 0-1.866.711 1.08 1.08 0 0 0 .295.773l4.095 4.311 2.882 2.568 3.91 3.716.661.628c.315.293.575.618.791.975Z" /></Svg>);
const TTSIcon = () => (<Svg width="26" height="26" fill="none"><Path fill="#565656" d="M4.5 24.75c-.619 0-1.148-.22-1.588-.66a2.17 2.17 0 0 1-.662-1.59v-18c0-.619.22-1.148.662-1.588.44-.44.97-.661 1.588-.662h9.169l-2.25 2.25H4.5v18h12.375v-2.25h2.25v2.25a2.17 2.17 0 0 1-.66 1.59c-.44.44-.97.66-1.59.66H4.5Zm2.25-4.5V18h7.875v2.25H6.75Zm0-3.375v-2.25h5.625v2.25H6.75Zm10.125 0-4.5-4.5H9V6.75h3.375l4.5-4.5v14.625Zm2.25-3.431V5.68a4.606 4.606 0 0 1 1.631 1.603c.413.675.619 1.435.619 2.279 0 .843-.206 1.603-.619 2.278a4.606 4.606 0 0 1-1.631 1.603Zm0 4.837V15.92c1.313-.469 2.39-1.28 3.234-2.433.844-1.152 1.266-2.46 1.266-3.924 0-1.463-.422-2.77-1.266-3.923-.843-1.153-1.922-1.964-3.234-2.433V.844c1.95.506 3.563 1.56 4.837 3.164 1.276 1.604 1.913 3.455 1.913 5.554 0 2.1-.637 3.952-1.913 5.556-1.274 1.604-2.887 2.658-4.837 3.163Z" /></Svg>);
const LearnIcon = () => (<Svg width="26" height="26" fill="none"><Path fill="#565656" fillRule="evenodd" d="M4.219 14.221v3.68a3.094 3.094 0 0 0 1.766 2.794l5.625 2.671a3.094 3.094 0 0 0 2.655 0l5.625-2.67a3.095 3.095 0 0 0 1.766-2.795v-3.679l-7.284 3.642a3.207 3.207 0 0 1-2.869 0L4.22 14.22Z" clipRule="evenodd" /><Path fill="#565656" fillRule="evenodd" d="M12.258 3.897a1.52 1.52 0 0 1 1.359 0l9.74 4.87c1.12.56 1.12 2.157 0 2.717l-9.74 4.871a1.52 1.52 0 0 1-1.359 0l-9.74-4.871c-1.12-.56-1.12-2.158 0-2.717l9.74-4.87Z" clipRule="evenodd" /><Path fill="#565656" fillRule="evenodd" d="M22.309 9.186a.844.844 0 0 1 1.131-.378l2.25 1.125a.843.843 0 0 1 .466.755v3.937a.844.844 0 1 1-1.687 0V11.21l-1.783-.893a.844.844 0 0 1-.377-1.131Z" clipRule="evenodd" /></Svg>);
const LogsIcon = () => (<Svg width="26" height="26" fill="none"><Path stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.333} d="M12 22H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v9m-2.25 10v-6.5" /><Path stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.333} d="m15.5 17.25.75-.75 1.5-1.5 1.5 1.5.75.75" /><Path stroke="#565656" strokeLinecap="round" strokeWidth={2.333} d="M8 8h8m-8 4h4" /></Svg>);
const ProfileIcon = () => (<Svg width="26" height="26" fill="none"><Path fill="#565656" fillRule="evenodd" d="M8.667 7.583a4.333 4.333 0 1 1 8.666 0 4.333 4.333 0 0 1-8.666 0Zm0 6.5A5.417 5.417 0 0 0 3.25 19.5a3.25 3.25 0 0 0 3.25 3.25h13a3.25 3.25 0 0 0 3.25-3.25 5.417 5.417 0 0 0-5.417-5.417H8.667Z" clipRule="evenodd" /></Svg>);
const SettingsIcon = () => (<Svg width="26" height="26" fill="none"><Path fill="#565656" d="M21.125 13c0-.25-.011-.488-.033-.737l2.015-1.527a1.09 1.09 0 0 0 .282-1.408l-2.026-3.5a1.07 1.07 0 0 0-1.354-.455l-2.33.986c-.4-.281-.822-.53-1.267-.736l-.314-2.503a1.087 1.087 0 0 0-1.072-.953h-4.041a1.09 1.09 0 0 0-1.083.953l-.315 2.503a8.22 8.22 0 0 0-1.267.736l-2.33-.986a1.07 1.07 0 0 0-1.353.455L2.61 9.338a1.092 1.092 0 0 0 .281 1.409l2.015 1.527a7.909 7.909 0 0 0 0 1.463l-2.015 1.527a1.09 1.09 0 0 0-.281 1.409l2.026 3.499c.27.476.855.671 1.354.455l2.329-.986c.4.282.823.53 1.267.737l.315 2.502c.065.542.53.953 1.072.953h4.04c.543 0 1.008-.411 1.073-.953l.314-2.502a8.218 8.218 0 0 0 1.268-.737l2.33.986a1.07 1.07 0 0 0 1.353-.455l2.026-3.5a1.092 1.092 0 0 0-.282-1.408l-2.015-1.527c.033-.25.044-.488.044-.737Zm-8.082 3.792c-2.09 0-3.791-1.701-3.791-3.792 0-2.09 1.7-3.792 3.791-3.792S16.835 10.91 16.835 13c0 2.09-1.701 3.792-3.792 3.792Z" /></Svg>);
const CamIcon = () => (<Svg width="38" height="38"><Path fill="#565656" d="M13.707 4.75h10.586l3.529 3.167h7.057c.468 0 .916.166 1.247.463.331.297.517.7.517 1.12v22.167c0 .42-.186.822-.517 1.12-.33.296-.78.463-1.247.463H3.12c-.467 0-.916-.167-1.247-.464-.33-.297-.517-.7-.517-1.12V9.5c0-.42.186-.823.517-1.12.33-.297.78-.463 1.247-.463h7.058l3.528-3.167Zm10.028 24.333-1.579-2.834a7.74 7.74 0 0 1-3.473.662 7.644 7.644 0 0 1-3.393-.94 6.693 6.693 0 0 1-2.454-2.303 5.833 5.833 0 0 1-.893-3.085h3.53L11.66 13.74c-1.825 1.574-2.96 3.684-3.201 5.946-.24 2.262.431 4.527 1.892 6.383 1.46 1.855 3.614 3.18 6.07 3.733 2.456.553 5.051.299 7.315-.718Zm-9.47-16.999 1.579 2.834a7.742 7.742 0 0 1 3.473-.662 7.644 7.644 0 0 1 3.393.94 6.694 6.694 0 0 1 2.454 2.303c.586.943.893 2.005.893 3.084h-3.53l3.813 6.845c1.825-1.575 2.96-3.685 3.2-5.947.24-2.262-.43-4.526-1.892-6.382-1.46-1.856-3.614-3.18-6.07-3.733a11.685 11.685 0 0 0-7.315.72" /></Svg>);
const TrashIcon = () => (<Svg width="24" height="24" fill="none"><Path stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" /></Svg>);
const SpeakerIcon = () => (<Svg width="24" height="24" fill="none"><Path stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></Svg>);

const BottomNavBar = ({ navigation, onCameraToggle }) => {
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
                    <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Home')}>
                        <HandsIcon />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('TTSMode')}>
                        <TTSIcon />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('LearningHub')}>
                        <LearnIcon />
                    </TouchableOpacity>
                </View>
                <View style={{ width: 80 }} />
                <View style={styles.iconGroup}>
                    <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Logs')}>
                        <LogsIcon />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Profile')}>
                        <ProfileIcon />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Settings')}>
                        <SettingsIcon />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.cameraButton} onPress={onCameraToggle}>
                <CamIcon />
            </TouchableOpacity>
        </View>
    );
};

export default function Home({ navigation }) {
    const { settings } = useSettings();
    const { addLog } = useLogs();

    const { hasPermission, requestPermission } = useCameraPermission();
    const [cameraPosition, setCameraPosition] = useState(settings.defaultCamera.toLowerCase());
    const device = useCameraDevice(cameraPosition);

    const [handData, setHandData] = useState([]);
    const [isHandLandmarkerInitialized, setIsHandLandmarkerInitialized] = useState(false);
    
    //Model Loading 
    const alphaPlugin = useTensorflowModel(require('../assets/models/hand_sign_classifier.tflite'));
    const wordPlugin = useTensorflowModel(require('../assets/models/hand_sign_classifier_words.tflite'));

    const [currentLetter, setCurrentLetter] = useState("");
    const [sentence, setSentence] = useState("");
    const [mode, setMode] = useState("letters");
    const modeRef = useRef("letters");

    const lastPredictionRef = useRef("");
    const consecutiveFramesRef = useRef(0);
    const lastOutputRef = useRef("");
    const sentenceRef = useRef("");
    const camera = useRef(null);

    useEffect(() => {
        sentenceRef.current = sentence;
    }, [sentence]);

    useEffect(() => {
        const setupTTS = async () => {
            const success = await initTTS(settings.defaultVoice);
        };
        setupTTS();

        const unsubscribe = navigation.addListener('blur', async () => {
            await stopTTS();
            const textToSave = sentenceRef.current;
            if (textToSave && textToSave.trim().length > 0 && settings.logsEnabled) {
                addLog(textToSave);
                console.log("Auto-saved log on exit");
            }
            setSentence("");
            lastOutputRef.current = "";
        });

        return () => {
            stopTTS();
            unsubscribe();
        };
    }, [settings.defaultVoice, navigation, settings.logsEnabled]);

    const handleClear = async () => {
        await stopTTS();
        if (sentence.trim().length > 0 && settings.logsEnabled) {
            addLog(sentence);
            console.log("Log saved on clear");
        }
        setSentence("");
        lastOutputRef.current = "";
    };

    const handleSpeak = async () => {
        if (!sentence) return;
        await speak(sentence);
    };

    const toggleMode = () => {
        const newMode = mode === "letters" ? "words" : "letters";
        setMode(newMode);
        modeRef.current = newMode;
        lastOutputRef.current = ""; 
    };

    const toggleCamera = () => {
        setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'));
    };

    // Recognition part
    useEffect(() => {
        const setup = async () => {
            if (!isHandLandmarkerInitialized) {
                try {
                    await HandLandmarks.initHandLandmarker();
                    setIsHandLandmarkerInitialized(true);
                    console.log("HandLandmarker init success");
                } catch (e) {
                    console.error("Failed to init HandLandmarker", e)
                }
            }
        };
        setup();

        const subscription = handLandmarksEmitter.addListener(
            'onHandLandmarksDetected',
            (event) => {
                const currentMode = modeRef.current;
                const activePlugin = currentMode === "letters" ? alphaPlugin : wordPlugin;
                const activeLabels = currentMode === "letters" ? ALPHABET : WORDS;

                if (!activePlugin.model || !event.landmarks || event.landmarks.length === 0) return;

                setHandData(event.landmarks);

                const hand = event.landmarks[0];
                const inputData = [];
                const wrist = hand[0];

                let maxDistance = 0;
                for (let i = 0; i < 21; i++) {
                    let p = hand[i];
                    let dist = Math.sqrt(Math.pow(p.x - wrist.x, 2) + Math.pow(p.y - wrist.y, 2));
                    if (dist > maxDistance) maxDistance = dist;
                }
                if (maxDistance === 0) maxDistance = 1;

                for (let i = 0; i < 21; i++) {
                    let p = hand[i];
                    inputData.push((p.x - wrist.x) / maxDistance);
                    inputData.push((p.y - wrist.y) / maxDistance);
                    inputData.push((p.z || 0) / maxDistance);
                }

                const inputTensor = new Float32Array(inputData);
                const output = activePlugin.model.runSync([inputTensor]);
                const probabilities = output[0];

                let maxScore = -1;
                let maxIndex = -1;
                for (let i = 0; i < probabilities.length; i++) {
                    if (probabilities[i] > maxScore) {
                        maxScore = probabilities[i];
                        maxIndex = i;
                    }
                }

                const predictedLabel = activeLabels[maxIndex];

                // Output Logic
                if (maxScore > 0.5 && predictedLabel && predictedLabel !== "nothing") {
                    setCurrentLetter(predictedLabel);

                    if (predictedLabel === lastPredictionRef.current) {
                        consecutiveFramesRef.current += 1;
                    } else {
                        lastPredictionRef.current = predictedLabel;
                        consecutiveFramesRef.current = 1;
                        lastOutputRef.current = ""; 
                    }

                    if (consecutiveFramesRef.current > 2) {
                        
                        // Handle Space/Del
                        if(predictedLabel === "space" || predictedLabel === "del"){
                            if(consecutiveFramesRef.current % 5 === 0){
                                if(predictedLabel === "del"){
                                    setSentence(prev=>prev.slice(0,-1));
                                }else{
                                    setSentence(prev=>prev+" ");
                                }
                            }
                        }
                        // Handle Letters/Words
                        else if (predictedLabel !== lastOutputRef.current) {
                            if (currentMode === "words") {
                                setSentence(prev => prev + (prev.length > 0 ? " " : "") + predictedLabel);
                            } else {
                                setSentence(prev => prev + predictedLabel);
                            }
                            lastOutputRef.current = predictedLabel; 
                        }
                    }
                } else {
                    lastOutputRef.current = "";
                    consecutiveFramesRef.current = 0;
                }
            }
        );
        return () => subscription.remove();
        
    }, [alphaPlugin.model, wordPlugin.model]); 

    // Frame Processor
    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        if (handLandmarksPlugin == null) return;
        handLandmarksPlugin.call(frame);
    }, []);

    const handlePermissionRequest = async () => {
        const granted = await requestPermission();
        if (!granted) Alert.alert('Permission Required');
    };

    const transformPoint = (p) => {
        let rotatedX, rotatedY;
        if (cameraPosition === 'front') {
            rotatedX = 1 - p.y;
            rotatedY = 1 - p.x;
        } else {
            rotatedX = 1 - p.y;
            rotatedY = p.x;
        }
        return vec(rotatedX * PREVIEW_WIDTH, rotatedY * PREVIEW_HEIGHT);
    };

    const renderSkeleton = () => {
        if (!handData || handData.length === 0) return null;
        return handData.map((hand, handIndex) => {
            const points = hand.map(p => transformPoint(p));
            return (
                <Group key={handIndex}>
                    {HAND_CONNECTIONS.map(([start, end], i) => (
                        <Line
                            key={`bone-${i}`}
                            p1={points[start]}
                            p2={points[end]}
                            color="#00FF00"
                            strokeWidth={2}
                            style="stroke"
                        />
                    ))}
                    {points.map((p, i) => (
                        <Circle key={`joint-${i}`} cx={p.x} cy={p.y} r={4} color="#FF0000" style="fill" />
                    ))}
                </Group>
            );
        });
    };

    if (!settings.cameraAllowed) {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Camera is disabled in Settings.</Text>
                </View>
                <View style={styles.absoluteNav}>
                    <BottomNavBar navigation={navigation} onCameraToggle={() => { }} />
                </View>
            </SafeAreaView>
        )
    }

    if (!hasPermission) {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginBottom: 10 }}>Camera Permission Required</Text>
                    <TouchableOpacity onPress={handlePermissionRequest} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 5 }}>
                        <Text>Grant Permission</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
    if (device == null) return <View><Text>No Camera Device</Text></View>;

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={{ paddingBottom: 120, alignItems: "center", paddingTop: 20 }} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={[styles.cameraWrapper, { width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }]}>
                        <Camera
                            ref={camera}
                            style={StyleSheet.absoluteFill}
                            device={device}
                            isActive={true}
                            frameProcessor={frameProcessor}
                            pixelFormat="yuv"
                        />
                        <Canvas style={styles.overlay} pointerEvents="none">
                            {renderSkeleton()}
                        </Canvas>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.label}>Live Interpreter</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.outputContainer}>
                        <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
                            <Text style={{ fontWeight: 'bold', color: '#565656' }}>
                                {mode === 'letters' ? "Spelling Mode" : "Word Mode"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.speakButton} onPress={handleSpeak} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <SpeakerIcon />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.clearButton} onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <TrashIcon />
                        </TouchableOpacity>
                        
                        <Text style={{ fontSize: 14, color: "#000", marginBottom: 5 }}>
                            {currentLetter}
                        </Text>
                        <Text style={{ fontSize: 30, color: "#000" }}>
                            {sentence}
                        </Text>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.label}>Text Output</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.absoluteNav}>
                <BottomNavBar navigation={navigation} onCameraToggle={toggleCamera} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#C9C2B5",
    },
    absoluteNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    card: {
        marginTop: 12,
        marginBottom: 20,
        paddingHorizontal: 15,
        paddingVertical: 1,
        backgroundColor: "#D9D9D9",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4, },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    cardFooter: {
        paddingVertical: 15,
    },
    label: {
        textAlign: "center",
        top: 10,
        opacity: 0.7
    },
    cameraWrapper: {
        marginTop: 20,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'black',
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
    outputContainer: {
        backgroundColor: "#f5f5f5ff",
        marginHorizontal: 5,
        marginTop: 20,
        paddingHorizontal: 20, 
        paddingBottom: 20,    
        paddingTop: 60,      
        borderRadius: 10,
        alignItems: "flex-start",
        width: 340,
        height: 200,
        position: 'relative',
    },
    modeButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        zIndex: 10,
    },
    clearButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 10,
        opacity: 0.6
    },
    speakButton: {
        position: 'absolute',
        top: 10,
        right: 50,
        padding: 5,
        zIndex: 10,
        opacity: 0.6
    },
    navContainer: {
        position: "absolute",
        bottom: -5,
        width: "100%",
        alignItems: "center",
    },
    tabIconsContainer: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 12
    },
    iconGroup: {
        flexDirection: "row",
        width: "40%",
        justifyContent: "space-evenly"
    },
    icon: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    cameraButton: {
        position: 'absolute',
        top: -30,
        width: 65,
        height: 65,
        borderRadius: 35,
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center'
    }
});