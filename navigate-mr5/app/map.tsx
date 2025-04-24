// import components we need from react and expo
import { useEffect, useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Image, Path, Rect, Text as SVGText } from 'react-native-svg';
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
				<Text style={ styles.description }>The Green square labeled 1 is where you are now. The yellow squares are in-between nodes that you will check off as you head to your destination. As you visit each yellow node, check it off using the checklist below the map. The pink square is your final destination. Follow the green path to navigate to your destination. If you require elevator access, there is an elevator located next to the staircase.</Text>
			</View>
			<Svg height="400" width="400" viewBox='0 0 1370 974'>
				<Image x={0} y={0} width={670} height={974} href={ require('./map 1.png') } />
				<Image x={670} y={0} width={670} height={974} href={ require('./map 2.png') } />
				
				<Path d={'M ' + path.map(v => v.coordinate.map((w, i) => i ? w += 8 : w + 3).join(' ')).join(' ')} stroke='black' strokeWidth='7' fill='none' />
				<Path d={'M ' + path.map(v => v.coordinate.map((w, i) => i ? w += 8 : w + 3).join(' ')).join(' ')} stroke='#00ff00' strokeWidth='4' fill='none' />
				{
					path.map(v => 
						<Rect x={ v.coordinate[0] - 5 + 3 } y={ v.coordinate[1] - 5 + 8 } width={10} height={10}  fill='black' />
					)
				}
				{
					path.map(v => 
						<Rect x={ v.coordinate[0] - 3 + 3 } y={ v.coordinate[1] - 3 + 8 } width={6} height={6}  fill='yellow' />
					)
				}
				{
					path.map((v, i) => 
						<SVGText x={ v.coordinate[0] + 7 + 3 } y={ v.coordinate[1] - 7 + 8 } fontSize={30} fontFamily="Verdana" fill="navy" stroke='black' strokeWidth={1}>{i+1}</SVGText>
					)
				}
				<Rect x={ path[0].coordinate[0] - 7 + 3 } y={ path[0].coordinate[1] - 7 + 8 } width={14} height={14}  fill='black' />
				<Rect x={ path[0].coordinate[0] - 5 + 3 } y={ path[0].coordinate[1] - 5 + 8 } width={10} height={10}  fill='#00ff00' />
				<Rect x={ path[path.length-1].coordinate[0] - 7 + 3 } y={ path[path.length-1].coordinate[1] - 7 + 8 } width={14} height={14}  fill='black' />
				<Rect x={ path[path.length-1].coordinate[0] - 5 + 3 } y={ path[path.length-1].coordinate[1] - 5 + 8 } width={10} height={10}  fill='#ff00ff' />
			</Svg>
			{path.map((v, i) => <label style={ styles.label } ><input type="checkbox" id={ 'input-' + i } onInput={ () => { try {document.getElementById('input-' + (i+1)).disabled = false} catch(e){} } } disabled={ !!i } /><Text style={ styles.inputText } >{i+1}. {v.name}</Text></label>)}
    </ScrollView>
  );
}

// make it pretty
const styles = StyleSheet.create({
  container: {
	},
  title: { 
		fontSize: 40, 
		marginTop: 40,
		marginBottom: 20,
		marginLeft: 10
	},
	text: {
		fontSize: 20,
		marginLeft: 10
	},
	description: {
		fontSize: 20,
		marginTop: 20,
		marginLeft: 10,
		marginRight: 10,
	},
	label: {
		fontSize: 20,
		paddingLeft: 20
	},
	inputText: {
		fontSize: 20,
		paddingLeft: 10,
		paddingRight: 10,
	}
});
