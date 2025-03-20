import React from 'react';
import { createContext, useState, ReactNode } from 'react';

interface GlobalContextType {
  showLoginView: boolean;
  setShowLoginView: (show: boolean) => void;
  currentUserName: string;
  setCurrentUserName: (name: string) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  allUsers: string[];
  setAllUsers: (users: string[]) => void;
  allChatRooms: any[];
  setAllChatRooms: (rooms: any[]) => void;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  groupName: string;
  setGroupName: (name: string) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalStateProps {
  children: ReactNode;
}

function GlobalState({ children }: GlobalStateProps): JSX.Element {
  const [showLoginView, setShowLoginView] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [allChatRooms, setAllChatRooms] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');

  return (
    <GlobalContext.Provider value={{
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
      modalVisible,
      setModalVisible,
      groupName,
      setGroupName
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalState; 