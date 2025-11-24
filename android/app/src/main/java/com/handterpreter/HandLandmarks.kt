package com.handterpreter

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.core.OutputHandler
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult

class HandLandmarks(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "HandLandmarks"
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        if (reactApplicationContext.hasActiveCatalystInstance()) {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        }
    }

    // FIX: Renamed from 'initialize' (which is reserved) to 'initHandLandmarker'
    @ReactMethod
    fun initHandLandmarker(promise: Promise) {
        if (HandLandmarkerHolder.handLandmarker != null) {
            promise.resolve("Already initialized")
            return
        }

        val resultListener = OutputHandler.ResultListener { result: HandLandmarkerResult, _: MPImage ->
            if (result.landmarks().isEmpty()) return@ResultListener

            val landmarksArray = Arguments.createArray()

            for (handLandmarks in result.landmarks()) {
                val handMap = Arguments.createArray()
                for ((index, handmark) in handLandmarks.withIndex()) {
                    val landmarkMap = Arguments.createMap()
                    landmarkMap.putInt("keypoint", index)
                    landmarkMap.putDouble("x", handmark.x().toDouble())
                    landmarkMap.putDouble("y", handmark.y().toDouble())
                    landmarkMap.putDouble("z", handmark.z().toDouble())
                    handMap.pushMap(landmarkMap)
                }
                landmarksArray.pushArray(handMap)
            }

            var handName = "Unknown"
            if (result.handedness().isNotEmpty() && result.handedness()[0].isNotEmpty()) {
                handName = result.handedness()[0][0].categoryName()
            }

            val params = Arguments.createMap()
            params.putArray("landmarks", landmarksArray)
            params.putString("hand", handName)
            
            sendEvent("onHandLandmarksDetected", params)
        }

        try {
            val baseOptions = BaseOptions.builder()
                    .setModelAssetPath("hand_landmarker.task")
                    .build()

            val handLandmarkerOptions = HandLandmarker.HandLandmarkerOptions.builder()
                    .setBaseOptions(baseOptions)
                    .setNumHands(2)
                    .setRunningMode(RunningMode.LIVE_STREAM)
                    .setResultListener(resultListener)
                    .build()

            HandLandmarkerHolder.handLandmarker = HandLandmarker.createFromOptions(reactApplicationContext, handLandmarkerOptions)

            promise.resolve("Model initialized successfully")

        } catch (e: Exception) {
            Log.e("HandLandmarks", "Error initializing HandLandmarker", e)
            promise.reject("INIT_ERROR", e)
        }
    }
}