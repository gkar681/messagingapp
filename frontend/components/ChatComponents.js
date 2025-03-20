import { View, Text, TouchableOpacity, StyleSheet, PanResponder } from 'react-native'
import React, { useContext } from 'react';
import { GlobalContext } from '../context';
import { router } from 'expo-router';
import { Icon } from 'react-native-paper';


export default function ChatComponents ({item}) {
    const { currentUser } = useContext(GlobalContext);
    
    // Get the last message from the item's messages array
    const lastMessage = item.messages && item.messages.length > 0 
        ? item.messages[item.messages.length - 1] 
        : null;

    const handlePress = () => {
        router.push({
            pathname: "/ChatRoom",
            params: { roomId: item.id, roomName: item.roomName }
        });
    };

    // Format the time string
    const getFormattedTime = (timeString) => {
        if (!timeString) return 'now';
        return timeString;
    };

    return(
        <View style={styles.container}>
           <TouchableOpacity onPress={handlePress}>
                <View style={styles.chatRoomContainer}>
                  <View style={styles.roomNameContainer}>
                  <Text style={styles.roomName}>{item.roomName}</Text>
                      <Icon source="message" size={20} color="black" />
                  
                  
                  </View>
                   
                    <Text style={styles.messageText}>
                        {lastMessage?.text || 'Start messaging now'}
                    </Text>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                            {getFormattedTime(lastMessage?.time)}
                        </Text>
                    </View>
                </View>
           </TouchableOpacity>
        </View>
    )}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 10,
        marginVertical: 1,
        width: '100%',
    },
    chatRoomContainer:{
        padding: 20,
        borderWidth: 7,
        borderColor: 'black',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10,
    },
    roomName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    messageText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    timeContainer: {
        alignItems: 'flex-end',
    },
    timeText: {
        fontSize: 12,
        color: '#888',
    },
    roomNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})

