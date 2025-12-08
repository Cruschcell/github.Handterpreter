import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Switch, Alert } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from './SettingsContext';

const HandsIcon = () => (
  <Svg width="26" height="26" fill="none">
    <Path fill="#565656" 
    d="m13.53 14.083-1.007-2.015a1.623 1.623 0 0 1 .726-2.177l.282-.141 6.207 5.915c.542.51.845 1.224.845 1.96v5.667A2.708 2.708 0 0 1 17.875 26H5.958a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h4.875V22.75h-6.5a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h6.5V19.5H3.25a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h7.583V16.25H4.875a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h8.656Zm-.768-6.37c-.91.434-1.268.672-1.766 1.29L8.07 5.914a1.08 1.08 0 0 1 1.57-1.484l3.12 3.282Zm-2.319 2.264a3.75 3.75 0 0 0-.216 1.94h-.932l-2.46-2.59A1.07 1.07 0 0 1 6.88 7.8a1.079 1.079 0 0 1 1.528.043l2.036 2.134Zm11.581 5.092.954-.899c.541-.51.855-1.224.855-1.972V3.63l-.292-.108a1.623 1.623 0 0 0-2.08.975l-.77 2.123L14.734.336a1.08 1.08 0 1 0-1.57 1.484l4.105 4.322-.79.748-5.222-5.503a1.079 1.079 0 0 0-1.866.711 1.08 1.08 0 0 0 .295.773l4.095 4.311 2.882 2.568 3.91 3.716.661.628c.315.293.575.618.791.975Z" />
  </Svg>
);
const TTSIcon = () => (
    <Svg width="26" height="26" fill="none">
        <Path fill="#565656" 
        d="M4.5 24.75c-.619 0-1.148-.22-1.588-.66a2.17 2.17 0 0 1-.662-1.59v-18c0-.619.22-1.148.662-1.588.44-.44.97-.661 1.588-.662h9.169l-2.25 2.25H4.5v18h12.375v-2.25h2.25v2.25a2.17 2.17 0 0 1-.66 1.59c-.44.44-.97.66-1.59.66H4.5Zm2.25-4.5V18h7.875v2.25H6.75Zm0-3.375v-2.25h5.625v2.25H6.75Zm10.125 0-4.5-4.5H9V6.75h3.375l4.5-4.5v14.625Zm2.25-3.431V5.68a4.606 4.606 0 0 1 1.631 1.603c.413.675.619 1.435.619 2.279 0 .843-.206 1.603-.619 2.278a4.606 4.606 0 0 1-1.631 1.603Zm0 4.837V15.92c1.313-.469 2.39-1.28 3.234-2.433.844-1.152 1.266-2.46 1.266-3.924 0-1.463-.422-2.77-1.266-3.923-.843-1.153-1.922-1.964-3.234-2.433V.844c1.95.506 3.563 1.56 4.837 3.164 1.276 1.604 1.913 3.455 1.913 5.554 0 2.1-.637 3.952-1.913 5.556-1.274 1.604-2.887 2.658-4.837 3.163Z" />
    </Svg>
)
const LearnIcon = () => (
    <Svg width="26" height = "26" fill="none">
        <Path fill="#565656" 
        fillRule="evenodd" 
        d="M4.219 14.221v3.68a3.094 3.094 0 0 0 1.766 2.794l5.625 2.671a3.094 3.094 0 0 0 2.655 0l5.625-2.67a3.095 3.095 0 0 0 1.766-2.795v-3.679l-7.284 3.642a3.207 3.207 0 0 1-2.869 0L4.22 14.22Z" 
        clipRule="evenodd" 
        />
        <Path fill="#565656" 
        fillRule="evenodd" 
        d="M12.258 3.897a1.52 1.52 0 0 1 1.359 0l9.74 4.87c1.12.56 1.12 2.157 0 2.717l-9.74 4.871a1.52 1.52 0 0 1-1.359 0l-9.74-4.871c-1.12-.56-1.12-2.158 0-2.717l9.74-4.87Z" 
        clipRule="evenodd" 
        />
        <Path fill="#565656" 
        fillRule="evenodd" 
        d="M22.309 9.186a.844.844 0 0 1 1.131-.378l2.25 1.125a.843.843 0 0 1 .466.755v3.937a.844.844 0 1 1-1.687 0V11.21l-1.783-.893a.844.844 0 0 1-.377-1.131Z" 
        clipRule="evenodd" 
        />
    </Svg>
)
const LogsIcon = () =>(
    <Svg width="26" height="26" fill="none">
        <Path stroke="#565656" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2.333} 
        d="M12 22H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v9m-2.25 10v-6.5" 
        />
        <Path stroke="#565656" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2.333} 
        d="m15.5 17.25.75-.75 1.5-1.5 1.5 1.5.75.75" 
        />
        <Path stroke="#565656" 
        strokeLinecap="round" 
        strokeWidth={2.333} 
        d="M8 8h8m-8 4h4" 
        />
    </Svg>
)
const ProfileIcon = () => (
    <Svg width="26" height="26" fill="none">
        <Path fill="#565656" 
        fillRule="evenodd" 
        d="M8.667 7.583a4.333 4.333 0 1 1 8.666 0 4.333 4.333 0 0 1-8.666 0Zm0 6.5A5.417 5.417 0 0 0 3.25 19.5a3.25 3.25 0 0 0 3.25 3.25h13a3.25 3.25 0 0 0 3.25-3.25 5.417 5.417 0 0 0-5.417-5.417H8.667Z" 
        clipRule="evenodd" 
        />
    </Svg>
)
const SettingsIcon = () =>(
    <Svg width="26" height= "26" fill="none">
        <Path fill="#565656" 
        d="M21.125 13c0-.25-.011-.488-.033-.737l2.015-1.527a1.09 1.09 0 0 0 .282-1.408l-2.026-3.5a1.07 1.07 0 0 0-1.354-.455l-2.33.986c-.4-.281-.822-.53-1.267-.736l-.314-2.503a1.087 1.087 0 0 0-1.072-.953h-4.041a1.09 1.09 0 0 0-1.083.953l-.315 2.503a8.22 8.22 0 0 0-1.267.736l-2.33-.986a1.07 1.07 0 0 0-1.353.455L2.61 9.338a1.092 1.092 0 0 0 .281 1.409l2.015 1.527a7.909 7.909 0 0 0 0 1.463l-2.015 1.527a1.09 1.09 0 0 0-.281 1.409l2.026 3.499c.27.476.855.671 1.354.455l2.329-.986c.4.282.823.53 1.267.737l.315 2.502c.065.542.53.953 1.072.953h4.04c.543 0 1.008-.411 1.073-.953l.314-2.502a8.218 8.218 0 0 0 1.268-.737l2.33.986a1.07 1.07 0 0 0 1.353-.455l2.026-3.5a1.092 1.092 0 0 0-.282-1.408l-2.015-1.527c.033-.25.044-.488.044-.737Zm-8.082 3.792c-2.09 0-3.791-1.701-3.791-3.792 0-2.09 1.7-3.792 3.791-3.792S16.835 10.91 16.835 13c0 2.09-1.701 3.792-3.792 3.792Z" />
    </Svg>
)

const SettingCameraIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

const SettingVoiceIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <Line x1="12" y1="19" x2="12" y2="23" />
    <Line x1="8" y1="23" x2="16" y2="23" />
  </Svg>
);

const SettingTTSIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <Path d="M9 9h6" />
      <Path d="M9 13h6" />
    </Svg>
);

const SettingSpeedIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </Svg>
);

const SettingLogsIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <Path d="M12 2v14" />
    <Path d="m5 9 7 7 7-7" />
  </Svg>
);

// const SettingHapticIcon = () => (
//     <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <Path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6" />
//       <Path d="M18 16a6 6 0 0 1-6 6 6 6 0 0 1-6-6" />
//       <Line x1="12" y1="2" x2="12" y2="22" />
//     </Svg>
// );

const SettingThemeIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="2" x2="12" y2="22" />
    </Svg>
);

const ChevronDownIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Path d="m6 9 6 6 6-6"/>
  </Svg>
);

const ChevronUpIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Path d="m6 15 6-6 6 6"/>
  </Svg>
);

const {width:SCREEN_WIDTH} = Dimensions.get('window');

const BottomNavBar = ({navigation}) => {
  return (
    <View style={styles.navContainer}>
        <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('Home')}>
            <HandsIcon/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={()=> navigation.navigate('TTSMode')}>
            <TTSIcon/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('LearningHub')}>
            <LearnIcon/>
        </TouchableOpacity>
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
  );
};

const Separator = () => <View style={styles.separator} />;

const DropdownSetting = ({ label, icon, selectedValue, options, onSelect, isExpanded, onExpand, zIndex }) => (
  <View style={[styles.dropdownWrapper, { zIndex: zIndex }]}>
    <View style={styles.settingRow}>
      <View style={styles.labelContainer}>
        <Text style={styles.settingLabel}>{label}</Text>
        <View style={styles.iconContainer}>{icon}</View>
      </View>
      <TouchableOpacity 
        style={[
            styles.dropdownButton, 
            isExpanded && styles.dropdownButtonExpanded 
        ]} 
        onPress={onExpand}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownButtonText}>{selectedValue}</Text>
        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />} 
      </TouchableOpacity>
    </View>
    
    {isExpanded && (
      <View style={styles.floatingOptions}>
        {options.map((opt, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.floatingOptionItem, 
              index === options.length - 1 && styles.lastOptionItem
            ]}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={styles.floatingOptionText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

const SwitchSetting = ({ label, icon, value, onValueChange }) => (
  <View style={styles.settingRow}>
    <View style={styles.labelContainer}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.iconContainer}>{icon}</View>
    </View>
    <Switch
      trackColor={{ false: "#D1D1D1", true: "#81c784" }}
      thumbColor={value ? "#ffffff" : "#f4f3f4"}
      ios_backgroundColor="#D1D1D1"
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

const ActionSetting = ({ label, onPress, isDestructive }) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress}>
    <Text style={[styles.settingLabel, isDestructive && styles.destructiveLabel]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function Settings({ navigation }) {
  const { settings, updateSetting, resetData } = useSettings();
  
  const [expandedDropdown, setExpandedDropdown] = useState(null); 

  const handleToggle = (key) => {
    updateSetting(key, !settings[key]);
  };

  const handleSelect = (key, value) => {
    updateSetting(key, value);
    setExpandedDropdown(null); 
  };

  const handleExpand = (key) => {
    if (expandedDropdown === key) {
      setExpandedDropdown(null); 
    } else {
      setExpandedDropdown(key); 
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: async () => {
            await AsyncStorage.removeItem('currentUser');
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }}
    ]);
  };

  const handleDeleteData = () => {
      Alert.alert("Delete Local Data", "This action cannot be undone.", [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: async () => {
              await resetData(); 
              Alert.alert("Success", "Local data cleared.");
          }}
      ]);
  }

  const cameraOptions = [{ label: 'Back', value: 'Back' }, { label: 'Front', value: 'Front' }];
  const voiceOptions = [{ label: 'Ryan', value: 'Ryan' }, { label: 'Matilda', value: 'Matilda' }, {label:'Joe', value:'Joe'}, {label:'Kristine', value:'Kristine'}];
  const speedOptions = [{ label: '0.5x', value: '0.5x' }, { label: '1x', value: '1x' }, { label: '1.5x', value: '1.5x' }, { label: '2x', value: '2x' }];
  const themeOptions = [{ label: 'Light', value: 'Light' }, { label: 'Dark', value: 'Dark' }];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Settings</Text>

        <View style={styles.settingsCard}>
          {/* Default Camera */}
          <DropdownSetting
            label="Default Camera"
            icon={<SettingCameraIcon />}
            selectedValue={settings.defaultCamera}
            options={cameraOptions}
            isExpanded={expandedDropdown === 'camera'}
            onExpand={() => handleExpand('camera')}
            onSelect={(val) => handleSelect('defaultCamera', val)}
            zIndex={4000} 
          />
          <Separator />

          {/* Default Voice */}
          <DropdownSetting
            label="Default Voice Model"
            icon={<SettingVoiceIcon />}
            selectedValue={settings.defaultVoice}
            options={voiceOptions}
            isExpanded={expandedDropdown === 'voice'}
            onExpand={() => handleExpand('voice')}
            onSelect={(val) => handleSelect('defaultVoice', val)}
            zIndex={3000}
          />
          <Separator />

          {/* TTS Enabled */}
          <SwitchSetting
            label="TTS enabled by default"
            icon={<SettingTTSIcon />}
            value={settings.ttsEnabled}
            onValueChange={() => handleToggle('ttsEnabled')}
          />
          <Separator />

          {/* TTS Speed */}
          <DropdownSetting
            label="TTS speed"
            icon={<SettingSpeedIcon />}
            selectedValue={settings.ttsSpeed}
            options={speedOptions}
            isExpanded={expandedDropdown === 'speed'}
            onExpand={() => handleExpand('speed')}
            onSelect={(val) => handleSelect('ttsSpeed', val)}
            zIndex={2000}
          />
          <Separator />

          {/* Enable Logs */}
          <SwitchSetting
            label="Enable logs"
            icon={<SettingLogsIcon />}
            value={settings.logsEnabled}
            onValueChange={() => handleToggle('logsEnabled')}
          />
          <Separator />

          {/* Enable Haptic */}
          {/* <SwitchSetting
            label="Enable haptic"
            icon={<SettingHapticIcon />}
            value={settings.hapticEnabled}
            onValueChange={() => handleToggle('hapticEnabled')}
          />
          <Separator /> */}

          {/* Theme */}
          <DropdownSetting
            label="Theme"
            icon={<SettingThemeIcon />}
            selectedValue={settings.theme}
            options={themeOptions}
            isExpanded={expandedDropdown === 'theme'}
            onExpand={() => handleExpand('theme')}
            onSelect={(val) => handleSelect('theme', val)}
            zIndex={1000}
          />
          <Separator />

          {/* Allow Camera */}
          <SwitchSetting
            label="Allow camera"
            value={settings.cameraAllowed}
            onValueChange={() => handleToggle('cameraAllowed')}
          />
          <Separator />

          {/* Destructive Actions */}
          <ActionSetting label="Delete local data" onPress={handleDeleteData} isDestructive />
          <Separator />
          <ActionSetting label="Logout" onPress={handleLogout} isDestructive />
        </View>
      </ScrollView>

      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C9C2B5",
  },
  scrollContent: {
    paddingBottom: 120, 
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 20,
  },
  settingsCard: {
    backgroundColor: "#E7E6E1",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'visible', 
    zIndex: 1, 
  },
  dropdownWrapper: {
    flexDirection: 'column',
    position: 'relative',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 10,
  },
  iconContainer: {
    opacity: 0.7,
  },
  destructiveLabel: {
    color: '#DA7676',
    fontWeight: '600',
  },
  
  dropdownButton: {
    backgroundColor: '#565656',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 90,
    height: 36,
  },
  dropdownButtonExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  floatingOptions: {
    position: 'absolute',
    top: '100%', 
    right: 0,
    width: 90,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: -8, 
    paddingTop: 0, 
  },
  floatingOptionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  lastOptionItem: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  floatingOptionText: {
    color: '#333',
    fontSize: 14,
  },

  separator: {
    height: 1,
    backgroundColor: '#D1D1D1',
    marginLeft: 0, 
  },
  navContainer: {
    position: "absolute",
    height: 80,
    width: "100%",
    bottom: 0,
    backgroundColor: '#E0E0E0',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
});