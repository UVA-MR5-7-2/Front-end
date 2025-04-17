// import components we need from react and expo
import { useEffect, useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { ClipPath, Image, Path, Rect } from 'react-native-svg';
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
	
	let x = -Math.round(path.map(v => v.coordinate[0]).sort((a, b) => a-b)[0]);
	console.log(x);
	let y = -Math.round(path.map(v => v.coordinate[1]).sort((a, b) => a-b)[0]);

  return (
    <ScrollView contentContainerStyle={ styles.container }>
			<View>
				<Text style={ styles.title }>Navigate MR5: Map</Text>
				<Text style={ styles.text }>Current Location: {location}</Text>
				<Text style={ styles.text }>Destination: {destination}</Text>
			</View>
			<View style={{ flexDirection: 'row' }} >
				<Svg height="1000" width="1000" viewBox='0 0 1273.5 886.5'>
					<ClipPath id="clip" >
						<Rect x="0" y="0" width="100%" height="100%" fill="red" />
					</ClipPath>
					<Image
						x={ 0 /* 2*x + 500 */ }
						y={ 0 /* 2*y + 400 */ }
						width={1273.5}
						height='886.5'
						href={require('./blueprint.png')}
					/>
					<Path d={'M ' + path.map(v => v.coordinate.map((w, i) => i ? w / 1.5 : w / 1.45).join(' ')).join(' ')} stroke='blue' strokeWidth='3' fill='none' />
				</Svg>
				<View style={{ flexDirection: 'column', top: 200 }} >
					{path.map(v => <input type="checkbox" value={v.name}/>)}
				</View>
			</View>
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
});
