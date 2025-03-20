import React from 'react';
import { createContext, useState,} from 'react';


export const GlobalContext = createContext(null);



function GlobalState({ children }) {
  const [showLoginView, setShowLoginView] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [allChatRooms, setAllChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const[currentChatRoom, setCurrentChatRoom] = useState(null);
  const[modalVisible, setModalVisible ] = useState(false);

  return (
    <GlobalContext.Provider 
      value={{
      showLoginView,
      setShowLoginView,
      currentUserName,
      setCurrentUserName,
      currentUser,
      setCurrentUser,
      allUsers,
      setAllUsers,
      allChatRooms,
      setAllChatRooms,
      messages,
      setMessages,
      currentChatRoom,
      setCurrentChatRoom, 
      modalVisible,
      setModalVisible,  

    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalState; 