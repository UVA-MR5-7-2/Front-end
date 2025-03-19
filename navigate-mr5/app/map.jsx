// import components we need from react and expo
import { useEffect, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
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
	
	
  const [nodes, setNodes] = useState([]);
  const [graph, setGraph] = useState(null);

  return (
    <div>
      <h1>Lab Map Navigation</h1>
      <ImageCanvas setNodes={setNodes} setGraph={setGraph} />
      {graph && <GraphComponent nodes={nodes} graph={graph} />}
    </div>
  );
};