import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';

const DATA = ['First Item','Second Item','Third Item',1,2,3,4,5,5,6];

let filteredData = [];

export default function Index() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
	
	const local = useLocalSearchParams();

	let [showItems, setShowItems] = useState(false);
		
	const [currentLocation, updateCurrentLocation] = useState(local.currentLocation || '');
	const [destination, updateDestination] = useState('');

	function submit() {
		
	}
	
	function filterData(newLocation) {
		filteredData = DATA.filter(v => v.toString().toLowerCase().includes(newLocation.toLowerCase()));
	}

	function currentLocationChanged(newLocation) {
		filterData(newLocation);
		updateCurrentLocation(newLocation);
	}
	
	function showList() {
		filterData(currentLocation);
		setShowItems(true);
	}
	
	function hideList() {
		setShowItems(false);
	}
	
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
				gap: 20
      }}>
      <Text style={{ fontSize: 30, marginTop: -200 }} >Navigate MR5 (BME Labs and Classroom)</Text>
			<View style={{height: 200, zIndex: 2}}>
				<Text style= {{ padding: 10 }} >Current Location</Text>
				<TextInput 
					style={{ borderWidth: 1, padding: 10, margin: 0, width: 300 }}
					placeholder='Enter current location' placeholderTextColor='#999'
					onChangeText={ currentLocationChanged } onSubmitEditing={ submit }
					value={ currentLocation }
					onFocus={ showList }
					onBlur={ hideList } />
					{showItems ? 
					<FlatList style={{ margin: 0, padding: 0, backgroundColor: 'white', borderWidth: 5, borderColor: 'white',flexGrow: 0, }} contentContainerStyle={{ alignItems: "center", gap: 10 }}
						data={filteredData}
						renderItem={({item}) => <Text>{item}</Text>}
						ListEmptyComponent=<Text>Nothing found</Text> /> : null}
			</View>
			<TextInput 
				style={{ borderWidth: 1, padding: 10, marginTop: -110, width: 300 }}
				placeholder='Enter destination' placeholderTextColor='#999'
				onChangeText={ updateDestination } onSubmitEditing={ submit } />
				<Pressable style={ ({pressed}) => [{ backgroundColor: 'lightblue', borderRadius: 3, borderColor: pressed ? 'white' : 'lightblue', borderWidth: 1 }] } onPress={ submit } >
					<Text style={{ marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10, fontSize: 20 }}>Login</Text>
				</Pressable>
    </View>
  );
}
