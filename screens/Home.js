import { StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity, NativeModules, NativeEventEmitter } from 'react-native';
import { useCameraPermission, useCameraDevice, useFrameProcessor, Camera, VisionCameraProxy } from 'react-native-vision-camera';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Canvas, Circle, Line, Group, vec, Paint } from "@shopify/react-native-skia";

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

export default function Home() {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const [handData, setHandData] = useState([]); 
    const [isHandLandmarkerInitialized, setIsHandLandmarkerInitialized] = useState(false);
    
    const PREVIEW_WIDTH = 350;
    const PREVIEW_HEIGHT = 350;

    const camera = useRef(null);

    useEffect(() => {
        const setup = async () => {
            try {
                await HandLandmarks.initHandLandmarker();
                setIsHandLandmarkerInitialized(true);
                console.log('HandLandmarker init success');
            } catch (e) {
                console.error('Failed to init HandLandmarker', e);
            }
        };
        setup();

        const subscription = handLandmarksEmitter.addListener(
            'onHandLandmarksDetected',
            (event) => {
                // Update state with new coordinates to trigger a Canvas redraw
                setHandData(event.landmarks);
            }
        );
        return () => subscription.remove();
    }, []);

    // 1. Frame Processor
    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        if (handLandmarksPlugin == null) return;
        handLandmarksPlugin.call(frame);
    }, []);

    const handlePermissionRequest = async () => {
        const granted = await requestPermission();
        if (!granted) Alert.alert('Permission Required');
    };

    const transformPoint = (p)=>{
        const rotatedX = 1 - p.y;
        const rotatedY = p.x;
        return vec(rotatedX * PREVIEW_WIDTH, rotatedY * PREVIEW_HEIGHT);
    };

    // 2. Skeleton Renderer
    const renderSkeleton = () => {
        if (!handData || handData.length === 0) return null;

        return handData.map((hand, handIndex) => {
            // Convert normalized coordinates (0-1) to pixel coordinates (350x350)
            const points = hand.map(p=>transformPoint(p));            
            return (
                <Group key={handIndex}>
                    <Paint color="#00FF00" strokeWidth={2} style="stroke" />
                    {HAND_CONNECTIONS.map(([start, end], i) => (
                        <Line
                            key={`bone-${i}`}
                            p1={points[start]}
                            p2={points[end]}
                        />
                    ))}
                    {points.map((p, i) => (
                        <Circle key={`joint-${i}`} cx={p.x} cy={p.y} r={4} color="red" style="fill" />
                    ))}
                </Group>
            );
        });
    };

    if (!hasPermission) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Camera Permission Required</Text>
                <TouchableOpacity onPress={handlePermissionRequest}><Text>Grant</Text></TouchableOpacity>
            </SafeAreaView>
        );
    }
    if (device == null) return <View><Text>No Camera Device</Text></View>;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Handterpreter</Text>
                <Text style={styles.subText}>Show me your hands!</Text>
            </View>
            <View style={[styles.cameraWrapper, { width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }]}>
                {/* LAYER 1: The Camera */}
                <Camera
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                    frameProcessor={frameProcessor}
                    pixelFormat="yuv"
                />

                {/* LAYER 2: The Overlay Canvas */}
                <Canvas style={styles.overlay} pointerEvents="none">
                    {renderSkeleton()}
                </Canvas>
            </View>

            <View style={styles.outputContainer}>
                <Text>{isHandLandmarkerInitialized ? "System Ready" : "Initializing..."}</Text>
                <Text>Hands detected: {handData ? handData.length : 0}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d0e0a2ff",
        alignItems: 'center',
        paddingVertical: 15,
    },
    headerContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subText: {
        textAlign: 'center',
        fontSize: 16,
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
        marginTop: 30,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: 'center',
        width: '90%'
    }
})