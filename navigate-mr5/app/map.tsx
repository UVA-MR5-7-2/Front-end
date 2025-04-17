// import components we need from react and expo
import { useEffect, useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Image, Path } from 'react-native-svg';
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
		path.push({coordinate: graph.node(node.predecessor), name: node.predecessor});
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
			<Svg height="1100" width="1100" viewBox="0 15 100 100">
			  <Image
					x="-12.5%"
					y="0"
					width="125%"
					height="125%"
					href={require('./blueprint.png')}
					clipPath="url(#clip)"
				/>
				<Path d={'M ' + path.map(v => v.coordinate.map((w, i) => Math.round(i ? w / 14 + 15 : w / 14 - 16)).join(' ')).join(' ')} stroke='blue' strokeWidth='0.3' fill='none' />
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
