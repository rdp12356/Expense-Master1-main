import axios from 'axios';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Use localhost for web, and your computer's IP for physical devices/simulators
// In a real app, this would be your production URL
const BASE_URL = __DEV__ 
  ? (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000')
  : 'https://api.expensemaster.global';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Device ID to every request
apiClient.interceptors.request.use(async (config) => {
  const deviceId = Device.osInternalBuildId || Device.modelId || 'browser-client';
  config.headers['x-device-id'] = deviceId;
  return config;
});

export const api = {
  sync: () => apiClient.get('/sync'),
  saveTransaction: (transaction: any) => apiClient.post('/transactions', transaction),
  updateSettings: (settings: any) => apiClient.patch('/settings', settings),
};

export default apiClient;
