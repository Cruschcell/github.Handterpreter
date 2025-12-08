import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const LOG_STORAGE_KEY = 'ASL_INTERPRETER_LOGS'; 
const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(LOG_STORAGE_KEY);
        if (jsonValue != null) {
          setLogs(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Failed to load logs", e);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  const addLog = async (text) => {
    if (!text || text.trim() === "") return;

    const newLog = {
      id: Date.now().toString(),
      text: text,
      timestamp: Date.now(),
    };

    setLogs(prevLogs => {
      const updatedLogs = [newLog, ...prevLogs];
      AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs)).catch(e => 
        console.error("Failed to save log to storage", e)
      );
      return updatedLogs;
    });
  };

  const removeLog = async (id) => {
    setLogs(prevLogs => {
      const updatedLogs = prevLogs.filter(log => log.id !== id);
      AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs)).catch(e => 
        console.error("Failed to delete log from storage", e)
      );
      return updatedLogs;
    });
  };

  return (
    <LogContext.Provider value={{ logs, addLog, removeLog, loading }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => useContext(LogContext);