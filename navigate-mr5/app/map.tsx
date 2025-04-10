// import components we need from react and expo
import { useEffect, useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Image } from 'react-native-svg';
import { router, Stack, useLocalSearchParams, useNavigation, useRootNavigationState } from 'expo-router';
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
    <ScrollView contentContainerStyle={ styles.container }>
			<View>
				<Text style={ styles.title }>Navigate MR5: Map</Text>
				<Text style={ styles.text }>Current Location: {location}</Text>
				<Text style={ styles.text }>Destination: {destination}</Text>
			</View>
				{/*
      <ImageCanvas setNodes={setNodes} setGraph={setGraph} />
				{graph && <GraphComponent nodes={nodes} graph={graph} />}*/}
			<Svg height="1000" width="1000" viewBox="0 25 100 100">
			  <Image
					x="-12.5%"
					y="0"
					width="125%"
					height="125%"
					href={require('./blueprint.png')}
					clipPath="url(#clip)"
				/>
			</Svg>
    </ScrollView>
  );
}

// make it pretty
const styles = StyleSheet.create({
  container: {
		flex: 1,
		alignItems: "center",
		gap: 30
	},
  title: { 
		fontSize: 40, 
		margin: 40
	},
	text: {
		textAlign: 'center', 
		margin: 10,
		fontSize: 20
	},
});
