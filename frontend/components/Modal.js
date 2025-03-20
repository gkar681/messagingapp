import React, { useContext, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Keyboard, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { socket } from '../utils';
import { GlobalContext } from '../context';

const NewGroupModal = () => {
    const {
        modalVisible,
        setModalVisible,
        groupName,
        setGroupName,
        currentUser,
        allChatRooms,
        setAllChatRooms
    } = useContext(GlobalContext);

    useEffect(() => {
        // Listen for group creation response
        socket.on('groupCreated', (newRoom) => {
            setAllChatRooms([...allChatRooms, newRoom]);
            Alert.alert('Success', 'Group created successfully!');
        });

        socket.on('groupCreationError', (error) => {
            Alert.alert('Error', error.message || 'Failed to create group');
        });

        return () => {
            socket.off('groupCreated');
            socket.off('groupCreationError');
        };
    }, [allChatRooms]);

    function handleCreateNewRoom() {
        if (!groupName.trim()) {
            Alert.alert('Error', 'Please enter a group name');
            return;
        }

        socket.emit('createNewGroup', {
            roomName: groupName,
            createdBy: currentUser,
        });
        setModalVisible(false);
        setGroupName('');
        Keyboard.dismiss();
    }

    return (
        <View>
            <TouchableOpacity 
                style={styles.openButton}
                onPress={() => setModalVisible(true)}
            >
                <Icon name="group-add" size={24} color="white" />
                <Text style={styles.buttonText}>New Group</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Create New Group</Text>
                            <TouchableOpacity 
                                onPress={() => {
                                    setModalVisible(false);
                                    setGroupName('');
                                }}
                                style={styles.closeButton}
                            >
                                <Icon name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter group name"
                            value={groupName}
                            onChangeText={setGroupName}
                            autoCorrect={false}
                        />

                        <TouchableOpacity 
                            style={styles.createButton}
                            onPress={handleCreateNewRoom}
                        >
                            <Text style={styles.buttonText}>Create Group</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    input: {
        borderWidth: 5,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#FFC31F',
        height: 60,
    },
    openButton: {
        backgroundColor: '#F47648',
        padding: 10,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    createButton: {
        backgroundColor: '#F47648',
        padding: 10,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: 'black',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default NewGroupModal;
