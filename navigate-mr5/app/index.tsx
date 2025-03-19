// import components we need from react and expo
import { useEffect, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function Index() {
	// hide the expo header
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
	
	// variables for the user to choose their current location and destination
	const local = useLocalSearchParams();
	const [selectedLocation, updateLocation] = useState(local.currentLocation || '');
	const [selectedDestination, updateDestination] = useState('');

	const locations = ['Select one', 'MR4 Entrance', 'MR6 Entrance', 'Pinn Hall Entrance', 'Lane Road Entrance', 'Atrium', 'Second floor entrance', 'First floor entrance', 'Labs entrance', 'Classroom', 'Restroom', 'BME Faculty Office'];
	
	const [errorMessage, setErrorMessage] = useState('');

	// send the user to the graphing algorithm and handle poor inputs from the user
	function submit() {
		if (!locations.includes(selectedDestination) || selectedDestination === locations[0]) {
			setErrorMessage("Please choose a destination");
		} else if (!locations.includes(selectedLocation) || selectedLocation === locations[0]) {
			setErrorMessage("Please choose your current location");
		} else if (selectedDestination === selectedLocation) {
			setErrorMessage("Location and destination should be different");
		} else if (locations.includes(selectedLocation) && locations.includes(selectedDestination) && selectedLocation !== locations[0] && selectedDestination !== locations[0]) {
			router.push("/map?currentLocation=" + selectedLocation + "&destination=" + selectedDestination);
		} else {
			setErrorMessage("Something went wrong... :(");
			// Send error data to backend 
		}
	}
	
	// create the layout
  return (
    <View style={ styles.container }>
      <Text style={ styles.title }>Navigate MR5</Text>
			<View style={ styles.PickerContainer }>
				<Text style={ styles.PickerLabel }>Current Location</Text>
				<Picker style={ styles.Picker} selectedValue={ selectedLocation } onValueChange={ (location, index) => updateLocation(location) } >
					{locations.map(location => <Picker.Item label={location} value={location}/>)}
				</Picker> 
			</View>
			<View style={ styles.PickerContainer }>
				<Text style= { styles.PickerLabel }>Destination</Text>
				<Picker style={ styles.Picker } selectedValue={ selectedDestination } onValueChange={ (location, index) => updateDestination(location) } >
					{locations.map(location => <Picker.Item label={location} value={location}/>)}
				</Picker> 
			</View>
			<Pressable style={ ({pressed}) => pressed ? styles.buttonPressed : styles.button } onPress={ submit } >
				<Text style={ styles.buttonText }>Find</Text>
			</Pressable>
			<Text style={ styles.error }>{errorMessage}</Text>
    </View>
  );
}

// make it pretty
const styles = StyleSheet.create({
  container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 30
	},
  title: { 
		fontSize: 40, 
		textAlign: 'center' 
	},
  PickerContainer: {
		gap: 2,
		alignItems	: 'center'
	},
  PickerLabel: {
		padding: 10,
		fontSize: 20
	},
	Picker: {
		fontSize: 20
	},
	button: {
		backgroundColor: '#2196F3',
		borderRadius: 3,
		margin: 20
	},
	buttonPressed: {
		backgroundColor: '#55aef7',
		borderRadius: 3,
		margin: 20
	},
	buttonText: {
		fontSize: 20,
		color: 'white',
		marginVertical: 10,
		marginHorizontal: 20,
	},
  error: {
		padding: 10,
		fontSize: 20,
		color: 'red'
	},
});
