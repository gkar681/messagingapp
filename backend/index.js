const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http, {
    cors: {
        origin: ["http://10.0.2.2:4000", "http://localhost:4000", "exp://10.0.2.2:8081"],
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
    }
});

const PORT = 4000;
let chatRooms = [];
let users = [];
let activeUsers = new Set();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

socketIO.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Handle user authentication
    socket.on('authenticate', (username) => {
        if (!username) {
            socket.emit('authError', { message: 'Username is required' });
            return;
        }

        const user = users.find(u => u.username === username);
        if (!user) {
            socket.emit('authError', { message: 'User not found' });
            return;
        }

        // Store user info in socket
        socket.username = username;
        activeUsers.add(username);
        
        // Send success response with user data
        socket.emit('authenticated', { username });
        
        // Broadcast active users update
        socketIO.emit('activeUsers', Array.from(activeUsers));
    });

    // Handle user registration
    socket.on('register', (username) => {
        if (!username) {
            socket.emit('registerError', { message: 'Username is required' });
            return;
        }

        if (users.some(u => u.username === username)) {
            socket.emit('registerError', { message: 'Username already exists' });
            return;
        }

        // Create new user
        const newUser = {
            username,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);

        // Store user info in socket
        socket.username = username;
        activeUsers.add(username);

        // Send success response
        socket.emit('registered', newUser);
        
        // Broadcast active users update
        socketIO.emit('activeUsers', Array.from(activeUsers));
    });

    // Send all chat rooms when requested (only to authenticated users)
    socket.on('getAllGroups', () => {
        if (!socket.username) {
            socket.emit('error', { message: 'Authentication required' });
            return;
        }

        console.log('Sending all chat rooms:', JSON.stringify(chatRooms, null, 2));
        socket.emit('groupList', chatRooms);
    });

    // Get specific room data (only for authenticated users)
    socket.on('getRoom', (roomId) => {
        if (!socket.username) {
            socket.emit('error', { message: 'Authentication required' });
            return;
        }

        const room = chatRooms.find(room => room.id === roomId);
        if (room) {
            socket.emit('roomData', room);
        }
    });

    // Create new group (only for authenticated users)
    socket.on('createNewGroup', (data) => {
        if (!socket.username) {
            socket.emit('error', { message: 'Authentication required' });
            return;
        }

        console.log('Received create group request:', data);
        const newRoom = {
            id: chatRooms.length + 1,
            roomName: data.roomName,
            createdBy: data.createdBy,
            messages: [],
            createdAt: new Date().toLocaleTimeString(),
            members: [data.createdBy]
        };
        console.log('Creating new room:', JSON.stringify(newRoom, null, 2));
        chatRooms.unshift(newRoom);
        console.log('Updated chat rooms list:', JSON.stringify(chatRooms, null, 2));
        // Broadcast to all connected clients
        socketIO.emit('groupCreated', newRoom);
    });

    // Handle new message (only for authenticated users)
    socket.on('sendMessage', (data) => {
        if (!socket.username) {
            socket.emit('error', { message: 'Authentication required' });
            return;
        }

        const { roomId, message, sender } = data;
        const room = chatRooms.find(room => room.id === roomId);
        
        if (room) {
            const newMessage = {
                id: room.messages.length + 1,
                text: message,
                sender: sender,
                time: new Date().toLocaleTimeString()
            };
            
            room.messages.push(newMessage);
            // Broadcast the updated room to all clients
            socketIO.emit('messageReceived', { roomId, message: newMessage });
        }
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            activeUsers.delete(socket.username);
            socketIO.emit('activeUsers', Array.from(activeUsers));
        }
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

app.get('/api', (req, res) => {
    res.json(chatRooms);
});

http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});