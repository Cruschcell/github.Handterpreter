import TTSManager from 'react-native-sherpa-onnx-offline-tts';
import RNFS from 'react-native-fs';
import {unzip} from 'react-native-zip-archive';
import {Platform} from 'react-native';

const VOICE_MAP = {
    'Ryan': {zip: 'modelRyan.zip', onnx:'en_US-ryan-medium.onnx'},
    'Matilda':{zip:'modelMatilda.zip', onnx:'en_US-matilda-medium.onnx'},
    'Joe': {zip:'modelJoe.zip',onnx:'en_US-joe-medium.onnx'},
    'Kristine': {zip:'modelKristine.zip', onnx:'en_US-kristine-medium.onnx'},
};

export const VOICE_KEYS = Object.keys(VOICE_MAP);

let lastConfig = null;

export const initTTS = async (voiceName) => {
    try{
        const voice = VOICE_MAP[voiceName];
        if(!voice){
            console.log(`Voice ${voiceName} not found`);
            return false;
        }

        const baseDir = `${RNFS.DocumentDirectoryPath}/voices/${voiceName}`;
        const modelPath = `${baseDir}/${voice.onnx}`;

        const modelExists = await RNFS.exists(modelPath);

        if (!modelExists){
            console.log(`Model for ${voiceName} not found, extracting...`);

            await RNFS.mkdir(baseDir);

            let sourcePath;
            if (Platform.OS==='android'){
                sourcePath = `${RNFS.DocumentDirectoryPath}/${voice.zip}`;
                await RNFS.copyFileAssets(voice.zip, sourcePath);
            }else{
                sourcePath=`${RNFS.MainBundlePath}/${voice.zip}`;
            }
            await unzip(sourcePath, baseDir);
            console.log(`Unzip success for ${voiceName}`);
        }
        const config ={
            modelPath: modelPath,
            tokensPath: `${baseDir}/tokens.txt`,
            dataDirPath: `${baseDir}/espeak-ng-data`,
            numThreads: 2,
            debug: true
        };

        lastConfig=JSON.stringify(config)

        await TTSManager.initialize(JSON.stringify(config));
        console.log(`Sherpa TTS Engine Ready: ${voiceName}`);
        return true;
    }catch(e){
        console.log('TTS setup error',e);
        return false;
    }
};

export const speak = async (text) =>{
    try{
        return await TTSManager.generateAndPlay(text,0,1.0);
    }catch(e){
        console.log("Error:",e);
    }
};

export const stopTTS = async () => {
    try {
        console.log("Killing TTS Engine...");
        try {
             await TTSManager.deinitialize(); 
        } catch (e) {
             console.log("De-init warning:", e);
        }
        if (lastConfig) {
            console.log("Rebuilding engine...");
            await TTSManager.initialize(lastConfig);
            console.log("Engine Restored");
        }
    } catch (e) {
        console.log("Stop Error:", e);
    }
};