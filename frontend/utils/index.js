import { Platform } from "react-native";
import { io } from 'socket.io-client';

export const BaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

// Initialize socket connection
export const socket = io(BaseUrl, {
    autoConnect: true,
    transports: ['websocket']
});

// Socket event listeners
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('error', (error) => {
    console.error('Socket error:', error);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Export socket instance
export default socket;
