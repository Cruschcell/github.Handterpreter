import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; 
import { getLogs, deleteLog } from './LogService';
import {useLogs} from './LogContext';

const HandsIcon = () => (<Svg width="26" height="26" fill="none"><Path fill="#565656" d="m13.53 14.083-1.007-2.015a1.623 1.623 0 0 1 .726-2.177l.282-.141 6.207 5.915c.542.51.845 1.224.845 1.96v5.667A2.708 2.708 0 0 1 17.875 26H5.958a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h4.875V22.75h-6.5a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h6.5V19.5H3.25a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h7.583V16.25H4.875a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h8.656Zm-.768-6.37c-.91.434-1.268.672-1.766 1.29L8.07 5.914a1.08 1.08 0 0 1 1.57-1.484l3.12 3.282Zm-2.319 2.264a3.75 3.75 0 0 0-.216 1.94h-.932l-2.46-2.59A1.07 1.07 0 0 1 6.88 7.8a1.079 1.079 0 0 1 1.528.043l2.036 2.134Zm11.581 5.092.954-.899c.541-.51.855-1.224.855-1.972V3.63l-.292-.108a1.623 1.623 0 0 0-2.08.975l-.77 2.123L14.734.336a1.08 1.08 0 1 0-1.57 1.484l4.105 4.322-.79.748-5.222-5.503a1.079 1.079 0 0 0-1.866.711 1.08 1.08 0 0 0 .295.773l4.095 4.311 2.882 2.568 3.91 3.716.661.628c.315.293.575.618.791.975Z"/></Svg>);
const TTSIcon = () => (<Svg width="26" height="26" fill="none"><Path fill="#565656" d="M4.5 24.75c-.619 0-1.148-.22-1.588-.66a2.17 2.17 0 0 1-.662-1.59v-18c0-.619.22-1.148.662-1.588.44-.44.97-.661 1.588-.662h9.169l-2.25 2.25H4.5v18h12.375v-2.25h2.25v2.25a2.17 2.17 0 0 1-.66 1.59c-.44.44-.97.66-1.59.66H4.5Zm2.25-4.5V18h7.875v2.25H6.75Zm0-3.375v-2.25h5.625v2.25H6.75Zm10.125 0-4.5-4.5H9V6.75h3.375l4.5-4.5v14.625Zm2.25-3.431V5.68a4.606 4.606 0 0 1 1.631 1.603c.413.675.619 1.435.619 2.279 0 .843-.206 1.603-.619 2.278a4.606 4.606 0 0 1-1.631 1.603Zm0 4.837V15.92c1.313-.469 2.39-1.28 3.234-2.433.844-1.152 1.266-2.46 1.266-3.924 0-1.463-.422-2.77-1.266-3.923-.843-1.153-1.922-1.964-3.234-2.433V.844c1.95.506 3.563 1.56 4.837 3.164 1.276 1.604 1.913 3.455 1.913 5.554 0 2.1-.637 3.952-1.913 5.556-1.274 1.604-2.887 2.658-4.837 3.163Z"/></Svg>)
const LearnIcon = () => (<Svg width="26" height = "26" fill="none"><Path fill="#565656" fillRule="evenodd" d="M4.219 14.221v3.68a3.094 3.094 0 0 0 1.766 2.794l5.625 2.671a3.094 3.094 0 0 0 2.655 0l5.625-2.67a3.095 3.095 0 0 0 1.766-2.795v-3.679l-7.284 3.642a3.207 3.207 0 0 1-2.869 0L4.22 14.22Z" clipRule="evenodd"/><Path fill="#565656" fillRule="evenodd" d="M12.258 3.897a1.52 1.52 0 0 1 1.359 0l9.74 4.87c1.12.56 1.12 2.157 0 2.717l-9.74 4.871a1.52 1.52 0 0 1-1.359 0l-9.74-4.871c-1.12-.56-1.12-2.158 0-2.717l9.74-4.87Z" clipRule="evenodd"/><Path fill="#565656" fillRule="evenodd" d="M22.309 9.186a.844.844 0 0 1 1.131-.378l2.25 1.125a.843.843 0 0 1 .466.755v3.937a.844.844 0 1 1-1.687 0V11.21l-1.783-.893a.844.844 0 0 1-.377-1.131Z" clipRule="evenodd"/></Svg>)
const LogsIcon = () =>(<Svg width="26" height="26" fill="none"><Path stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.333} d="M12 22H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v9m-2.25 10v-6.5"/><Path stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.333} d="m15.5 17.25.75-.75 1.5-1.5 1.5 1.5.75.75"/><Path stroke="#565656" strokeLinecap="round" strokeWidth={2.333} d="M8 8h8m-8 4h4"/></Svg>)
const ProfileIcon = () => (<Svg width="26" height="26" fill="none"><Path fill="#565656" fillRule="evenodd" d="M8.667 7.583a4.333 4.333 0 1 1 8.666 0 4.333 4.333 0 0 1-8.666 0Zm0 6.5A5.417 5.417 0 0 0 3.25 19.5a3.25 3.25 0 0 0 3.25 3.25h13a3.25 3.25 0 0 0 3.25-3.25 5.417 5.417 0 0 0-5.417-5.417H8.667Z" clipRule="evenodd"/></Svg>)
const SettingsIcon = () =>(<Svg width="26" height= "26" fill="none"><Path fill="#565656" d="M21.125 13c0-.25-.011-.488-.033-.737l2.015-1.527a1.09 1.09 0 0 0 .282-1.408l-2.026-3.5a1.07 1.07 0 0 0-1.354-.455l-2.33.986c-.4-.281-.822-.53-1.267-.736l-.314-2.503a1.087 1.087 0 0 0-1.072-.953h-4.041a1.09 1.09 0 0 0-1.083.953l-.315 2.503a8.22 8.22 0 0 0-1.267.736l-2.33-.986a1.07 1.07 0 0 0-1.353.455L2.61 9.338a1.092 1.092 0 0 0 .281 1.409l2.015 1.527a7.909 7.909 0 0 0 0 1.463l-2.015 1.527a1.09 1.09 0 0 0-.281 1.409l2.026 3.499c.27.476.855.671 1.354.455l2.329-.986c.4.282.823.53 1.267.737l.315 2.502c.065.542.53.953 1.072.953h4.04c.543 0 1.008-.411 1.073-.953l.314-2.502a8.218 8.218 0 0 0 1.268-.737l2.33.986a1.07 1.07 0 0 0 1.353-.455l2.026-3.5a1.092 1.092 0 0 0-.282-1.408l-2.015-1.527c.033-.25.044-.488.044-.737Zm-8.082 3.792c-2.09 0-3.791-1.701-3.791-3.792 0-2.09 1.7-3.792 3.791-3.792S16.835 10.91 16.835 13c0 2.09-1.701 3.792-3.792 3.792Z"/></Svg>)
const RedTrashIcon = () => (<Svg width="24" height="24" fill="none"><Path stroke="#D24E4E" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"/></Svg>);

const BottomNavBar = ({ navigation }) => {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Home')}>
        <HandsIcon />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('TTSMode')}>
        <TTSIcon />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('LearningHub')}>
        <LearnIcon />
      </TouchableOpacity>
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
  );
};

export default function Logs({ navigation }) {
  const {logs,removeLog} = useLogs();
  const [groupedLogs, setGroupedLogs] = useState({});

  useEffect(()=>{
    groupLogsByDate(logs);
  },[logs]);

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Log",
      "Are you sure you want to delete this log?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            removeLog(id);
          }
        }
      ]
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    return `Generated at: ${time} on ${dateStr}`;
  };

  const groupLogsByDate = (logsData) => {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const groups = {
      "Outputs generated this week": [],
      "Outputs generated last 30 days": [],
      "Outputs generated this year": [],
      "Older": []
    };

    logsData.forEach(log => {
      const logDate = new Date(log.timestamp);

      if (logDate >= startOfWeek) {
        groups["Outputs generated this week"].push(log);
      } else if (logDate >= thirtyDaysAgo) {
        groups["Outputs generated last 30 days"].push(log);
      } else if (logDate >= startOfYear) {
        groups["Outputs generated this year"].push(log);
      } else {
        groups["Older"].push(log);
      }
    });

    setGroupedLogs(groups);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Output logs</Text>
        {/* Placeholder for "Sort by" filter if needed in future */}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}>
        {Object.keys(groupedLogs).map((sectionTitle) => {
          const sectionLogs = groupedLogs[sectionTitle];
          
          if (sectionLogs.length === 0) return null;

          return (
            <View key={sectionTitle} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>
              
              {sectionLogs.map((log) => (
                <View key={log.id} style={styles.logCard}>
                  <View style={{flex: 1}}>
                    <Text style={styles.logText}>{log.text}</Text>
                    <Text style={styles.logTimestamp}>{formatTimestamp(log.timestamp)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(log.id)} style={styles.deleteButton}>
                    <RedTrashIcon />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          );
        })}
        
        {logs.length === 0 && (
            <Text style={{textAlign:'center', marginTop: 50, color:'#888'}}>No logs recorded yet.</Text>
        )}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: '#555', 
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
    opacity: 0.8,
  },
  logCard: {
    backgroundColor: '#E7E6E1', 
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  logTimestamp: {
    fontSize: 11,
    color: '#769271', 
  },
  deleteButton: {
    padding: 10,
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
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
});