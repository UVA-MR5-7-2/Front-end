// import components we need from react and expo
import { useEffect, useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Image, Path, Rect } from 'react-native-svg';
import { router, Stack, useLocalSearchParams, useNavigation, useRootNavigationState } from 'expo-router';
import nodes from "./nodes_edges.json"
const graphlib = require("graphlib");
const Graph = graphlib.Graph;

function NodeList({nodes}) {
	let components = [];
	for (const node of nodes) {
		components.push(<Text>{node}</Text>);
	}
	return components;
}

function graph(start, end) {
	let graph = new Graph({ directed: true, compound: false, multigraph: false });
	for (const name in nodes.nodes) {
		graph.setNode(name, nodes.nodes[name]);
	}
	for (const name in nodes.edges) {
		const x1 = graph.node(name)[0];
		const y1 = graph.node(name)[1];
		for (const connection of nodes.edges[name]) {
			const x2 = graph.node(connection)[0];
			const y2 = graph.node(connection)[1];
			const dx = x1-x2;
			const dy = y1-y2;
			graph.setEdge(name, connection, Math.sqrt(dx**2, dy**2));
		}
	}
	let goals = graphlib.alg.dijkstra(graph, start, edge => graph.edge(edge));
	let path = [{coordinate: graph.node(end), name: end}];
	let node = goals[end];
	while (node.predecessor !== undefined) {
		path.unshift({coordinate: graph.node(node.predecessor), name: node.predecessor});
		node = goals[node.predecessor];
	}
	return path;
}

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
	if (!rootNavigationState?.key) return null;
	else {
		const locations = Object.keys(nodes.nodes).sort();
		if (!locations.includes(location) || !locations.includes(destination) || location === destination || !router.canGoBack) {
			router.dismissTo("/?currentLocation=")
			return <Text>Returning you home...</Text>
		}
	}
	
	let path = graph(location, destination);

  return (
    <ScrollView contentContainerStyle={ styles.container }>
			<View>
				<Text style={ styles.title }>Navigate MR5: Map</Text>
				<Text style={ styles.text }>Current Location: {location}</Text>
				<Text style={ styles.text }>Destination: {destination}</Text>
			</View>
			<Svg height="400" width="400" viewBox='0 0 1340 974'>
				<Image x={0} y={0} width={670} height={974} href={ require('./map 1.png') } />
				<Image x={670} y={0} width={670} height={974} href={ require('./map 2.png') } />
				<Path d={'M ' + path.map(v => v.coordinate.join(' ')).join(' ')} stroke='black' strokeWidth='3' fill='none' />
				<Rect x={ path[0].coordinate[0] - 5 } y={ path[0].coordinate[1] - 5 } width={10} height={10}  fill='black' />
			</Svg>
			{path.map((v, i) => <label style={ styles.largeText } ><input type="checkbox" id={ 'input-' + i } onInput={ () => { try {document.getElementById('input-' + (i+1)).disabled = false} catch(e){} } } disabled={ !!i } /> {i+1}. <Text style={ styles.largeText } >{v.name}</Text></label>)}
    </ScrollView>
  );
}

// make it pretty
const styles = StyleSheet.create({
  container: {
		flex: 1,
		alignItems: "center",
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
	largeText: {
		fontSize: 20
	}
});
