import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

const defaultValues = {
  defaultCamera: 'Back',
  defaultVoice: 'Ryan',
  ttsEnabled: true,
  ttsSpeed: '1x',
  logsEnabled: true,
  hapticEnabled: true,
  theme: 'Light',
  cameraAllowed: true,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultValues);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const keys = Object.keys(defaultValues);
        const stored = await AsyncStorage.multiGet(keys);
        
        const newSettings = { ...defaultValues };
        stored.forEach(([key, value]) => {
          if (value !== null) {
            if (typeof defaultValues[key] === 'boolean') {
              newSettings[key] = JSON.parse(value);
            } else {
              newSettings[key] = value;
            }
          }
        });
        setSettings(newSettings);
      } catch (e) {
        console.error("Failed to load settings context", e);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateSetting = async (key, value) => {
    try {
      setSettings(prev => ({ ...prev, [key]: value }));
      
      const stringValue = typeof value !== 'string' ? JSON.stringify(value) : value;
      await AsyncStorage.setItem(key, stringValue);
    } catch (e) {
      console.error(`Failed to save ${key}`, e);
    }
  };

  const resetData = async () => {
      try {
          await AsyncStorage.clear();
          setSettings(defaultValues);
      } catch(e) { console.error(e) }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetData, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);