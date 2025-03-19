// import components we need from react and expo
import { useEffect, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, Stack, useLocalSearchParams, useNavigation, useRootNavigationState } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import ImageCanvas from './Image_Canvas';
import GraphComponent from './Graph';

export default function Map() {
	// hide the expo header
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
	
	// current location and destination
	const local = useLocalSearchParams();
	const location = local.currentLocation;
	const destination = local.destination;
	
  const rootNavigationState = useRootNavigationState();
	if (rootNavigationState?.key !== undefined) {
		const locations = ['Select one', 'MR4 Entrance', 'MR6 Entrance', 'Pinn Hall Entrance', 'Lane Road Entrance', 'Atrium', 'Second floor entrance', 'First floor entrance', 'Labs entrance', 'Classroom', 'Restroom', 'BME Faculty Office'];
		if (!locations.includes(location) || !locations.includes(destination) || location === locations[0] || destination === locations[0] || !router.canGoBack || location === destination) {
			router.dismissTo("/?currentLocation=")
		}
	}
	
  const [nodes, setNodes] = useState([]);
  const [graph, setGraph] = useState(null);

  return (
    <View style={ styles.container }>
      <Text style={ styles.title }>Navigate MR5: Map</Text>
			<Text>Current Location: {location}</Text>
			<Text>Destination: {destination}</Text>
      <ImageCanvas setNodes={setNodes} setGraph={setGraph} />
      {graph && <GraphComponent nodes={nodes} graph={graph} />}
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
