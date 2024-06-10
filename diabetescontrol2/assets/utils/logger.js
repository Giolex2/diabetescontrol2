// utils/logger.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar los logs
const LOG_STORAGE_KEY = 'app_logs';

// Función para agregar un log
export const addLog = async (log) => {
  try {
    const existingLogs = await AsyncStorage.getItem(LOG_STORAGE_KEY);
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push({ log, timestamp: new Date().toISOString() });
    await AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving log:', error);
  }
};

// Función para obtener todos los logs
export const getLogs = async () => {
  try {
    const logs = await AsyncStorage.getItem(LOG_STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error retrieving logs:', error);
    return [];
  }
};

// Función para limpiar los logs
export const clearLogs = async () => {
  try {
    await AsyncStorage.removeItem(LOG_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing logs:', error);
  }
};
