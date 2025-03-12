import { Text, View, Image, TouchableOpacity } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <Text>Home</Text>
    <Image source={require('../assets/images/react-logo.png')} />

    <View style={{
      flexDirection:'row',
      justifyContent: 'space-between'
,

    }}>
    <TouchableOpacity
    style={
      {backgroundColor:'indigo',
        padding:12,
        borderRadius:10,
        margin:10,
        width:'23%'
      }

      
    }>
      <Text
      style={{
        color:'white',
        fontSize:14,
        fontWeight:'bold',
        textAlign:'center'
      }}
      
      >
      Login    
      </Text>     
     </TouchableOpacity>

    <TouchableOpacity
    style={{
      padding:10,
      borderRadius:10,
      margin:10,
      borderColor:'indigo',
      borderWidth:2,
      width:'23%'


    }}>
      <Text
      
      style={{
        color:'indigo',
        fontSize:14,
        fontWeight:'bold',
        textAlign:'center',
      }}>
      Sign Up  
      </Text>
      
    </TouchableOpacity>
    </View>
  
    </View>
  );
}
