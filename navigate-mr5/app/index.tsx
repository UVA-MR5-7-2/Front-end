import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from "react-native";
import { Stack, useNavigation } from 'expo-router';

function submit() {
	
}

export default function Index() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
	
 const [currentLocation, updateCurrentLocation] = useState('');
 const [destination, updateDestination] = useState('');
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text style={{ fontSize: 30, margin: 50 }} >Navigate MR5 (BME Labs and Classroom)</Text>
			<TextInput 
				style={{ borderWidth: 1, padding: 10, margin: 10, width: 300 }}
				placeholder='Enter current location' placeholderTextColor='#999'
				onChangeText={ updateCurrentLocation } onSubmitEditing={ submit } />
			<TextInput 
				style={{ borderWidth: 1, padding: 10, margin: 10, width: 300 }}
				placeholder='Enter destination' placeholderTextColor='#999'
				onChangeText={ updateDestination } onSubmitEditing={ submit } />
				<Pressable style={ ({pressed}) => [{ backgroundColor: 'lightblue', borderRadius: 3, borderColor: pressed ? 'white' : 'lightblue', borderWidth: 1 }] } onPress={ submit } >
					<Text style={{ marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10, fontSize: 20 }}>Login</Text>
				</Pressable>
    </View>
  );
}
