import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../context'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { router } from 'expo-router'
import ChatComponents from '../components/ChatComponents'
import NewGroupModal from '../components/Modal'
import { socket } from '../utils'

const ChatScreen = () => {
  const { currentUser, setCurrentUser, allChatRooms, setAllChatRooms } = useContext(GlobalContext);

  useEffect(() => {
    console.log('ChatScreen mounted, requesting groups...');
    // Request initial chat rooms
    socket.emit('getAllGroups');

    // Listen for chat room updates
    socket.on('groupList', (groups) => {
      console.log('Received all groups:', JSON.stringify(groups, null, 2));
      setAllChatRooms(groups);
    });

    // Listen for new group creation
    socket.on('groupCreated', (newRoom) => {
      console.log('Received new room:', JSON.stringify(newRoom, null, 2));
      console.log('Current chat rooms:', JSON.stringify(allChatRooms, null, 2));
      setAllChatRooms(prev => {
        const updated = [newRoom, ...prev];
        console.log('Updated chat rooms:', JSON.stringify(updated, null, 2));
        return updated;
      });
    });

    // Cleanup listeners when component unmounts
    return () => {
      console.log('ChatScreen unmounting, cleaning up listeners...');
      socket.off('groupList');
      socket.off('groupCreated');
    };
  }, []); // Remove socket from dependencies

  const logouthandler = () => {
    setCurrentUser('');
    router.replace('/');
  };

  useEffect(() => {
    if (!currentUser.trim() ==="")
      router.push('/home');
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome {currentUser}</Text>
      </View>

      <View style={styles.chatContainer}>
        {allChatRooms && allChatRooms.length > 0 ? (
          <FlatList
            data={allChatRooms}
            renderItem={({ item }) => (
              <View style={styles.chatItemContainer}>
                <ChatComponents item={item}/>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        ) : (
          <Text style={styles.noChatRoomsText}>No chat rooms found</Text>
        )}
      </View>

      <View style={styles.footer}>
        <NewGroupModal />
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logouthandler}
        >
          <Icon name='logout' size={20} color='white' />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chatContainer: {
    flex: 1,
  },
  chatItemContainer: {
    flex: 1,
 
    maxWidth: '50%',
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#F47648',
    padding: 10,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noChatRoomsText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default ChatScreen