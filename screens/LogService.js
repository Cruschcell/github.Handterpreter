import AsyncStorage from '@react-native-async-storage/async-storage';

const LOG_STORAGE_KEY = 'ASL_INTERPRETER_LOGS';

export const saveLog = async (text) => {
  if (!text || text.trim() === "") return;

  try {
    const newLog = {
      id: Date.now().toString(),
      text: text,
      timestamp: Date.now(),
    };

    const existingLogs = await getLogs();
    const updatedLogs = [newLog, ...existingLogs];

    await AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
    console.log("Log saved:", newLog);
  } catch (e) {
    console.error("Failed to save log", e);
  }
};

export const getLogs = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(LOG_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to fetch logs", e);
    return [];
  }
};

export const deleteLog = async (id) => {
  try {
    const existingLogs = await getLogs();
    const filteredLogs = existingLogs.filter(log => log.id !== id);
    await AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(filteredLogs));
    return filteredLogs;
  } catch (e) {
    console.error("Failed to delete log", e);
    return [];
  }
};