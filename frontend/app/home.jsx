import { useContext, useEffect } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { GlobalContext } from "../context";
import { router } from 'expo-router';
import { socket } from '../utils';

export default function Home() {
  const { 
    showLoginView, 
    setShowLoginView, 
    currentUserName, 
    setCurrentUserName,
    currentUser,
    setCurrentUser
  } = useContext(GlobalContext);

  useEffect(() => {
    // Listen for authentication responses
    socket.on('authenticated', (data) => {
      setCurrentUser(data.username);
      router.push('/ChatScreen');
      Alert.alert('Success', 'Logged in successfully!');
    });

    socket.on('authError', (error) => {
      Alert.alert('Error', error.message);
    });

    // Listen for registration responses
    socket.on('registered', (data) => {
      setCurrentUser(data.username);
      Alert.alert('Success', 'Signed up successfully!');
    });

    socket.on('registerError', (error) => {
      Alert.alert('Error', error.message);
    });

    return () => {
      socket.off('authenticated');
      socket.off('authError');
      socket.off('registered');
      socket.off('registerError');
    };
  }, []);

  function handleSignUpandLogin(isLogin) {
    if(currentUserName.trim() === '') {
      Alert.alert('Error', 'Please enter a user name');
      return;
    }

    if (isLogin) {
      // Login logic
      socket.emit('authenticate', currentUserName.trim());
    } else {
      // Sign up logic
      socket.emit('register', currentUserName.trim());
    }
  }

  return (
    <View style={styles.container}>
      <Image 
        style={styles.backgroundImage}
        source={require('../assets/images/home-bg.jpeg')} 
      />

      <View style={styles.contentContainer}>
        {showLoginView ? (
          <View style={styles.formContainer}>
            <View>
              <TextInput
                placeholder="User Name"
                value={currentUserName}
                onChangeText={setCurrentUserName}
                autoCorrect={false}
                style={styles.input}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => handleSignUpandLogin(true)}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => handleSignUpandLogin(false)}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              The best messaging app
            </Text>
            <TouchableOpacity
              onPress={() => setShowLoginView(true)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Try Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
  },
  backgroundImage: {
    width: '100%',
    height: '75%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 30,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
    marginTop: 600,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 5,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '100%',
    minWidth: 250,
    height:60,
    backgroundColor: '#FFC31F',
  },
  button: {
    backgroundColor: '#F47648',
    padding: 10,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: 'black',
    minWidth: 180,
    alignItems: 'center',
    height:50,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: 'indigo',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 30,
  }
});
