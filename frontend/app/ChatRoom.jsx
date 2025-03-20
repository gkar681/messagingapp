import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useLocalSearchParams, router } from 'expo-router';
import { GlobalContext } from '../context';
import { socket } from '../utils';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChatRoom = () => {
  const params = useLocalSearchParams();
  const roomId = params.roomId ? parseInt(params.roomId) : null;
  const roomName = params.roomName || '';
  const { currentUser } = useContext(GlobalContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!roomId) {
      console.error('No room ID provided');
      router.back();
      return;
    }

    console.log('Requesting room data for room:', roomId);
    socket.emit('getRoom', roomId);

    socket.on('roomData', (room) => {
      console.log('Received room data:', room);
      if (room && room.messages) {
        setMessages(room.messages);
      }
    });

    socket.on('messageReceived', (data) => {
      console.log('Received new message:', data);
      if (data.roomId === roomId) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    return () => {
      socket.off('roomData');
      socket.off('messageReceived');
    };
  }, [roomId]);

  const handleBack = () => {
    router.back();
  };

  const sendMessage = () => {
    if (message.trim() && roomId) {
      console.log('Sending message:', {
        roomId,
        message: message.trim(),
        sender: currentUser
      });
      
      socket.emit('sendMessage', {
        roomId,
        message: message.trim(),
        sender: currentUser
      });
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === currentUser ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={[
        styles.senderName,
        item.sender === currentUser ? styles.sentSenderName : styles.receivedSenderName
      ]}>{item.sender}</Text>
      <Text style={[
        styles.messageText,
        item.sender === currentUser ? styles.sentMessageText : styles.receivedMessageText
      ]}>{item.text}</Text>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.roomName}>{roomName}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        inverted={false}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Icon name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#F47648',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  roomName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'black',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#F47648',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFC31F',
  },
  senderName: {
    fontSize: 12,
    marginBottom: 2,
  },
  sentSenderName: {
    color: '#fff',
  },
  receivedSenderName: {
    color: '#666',
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 5,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    maxHeight: 100,
    backgroundColor: '#FFC31F',
  },
  sendButton: {
    backgroundColor: '#F47648',
    borderRadius: 10,
    padding: 10,
    borderWidth: 4,
    borderColor: 'black',
  },
});

export default ChatRoom;