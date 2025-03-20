import { Stack } from "expo-router";
import GlobalState from "../context";

export default function RootLayout() {
  return (
    <GlobalState>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="home" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ChatScreen" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ChatRoom" 
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }} 
        />
      </Stack>
    </GlobalState>
  );
}
