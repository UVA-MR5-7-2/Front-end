import React, { useEffect } from 'react';
var graphlib = require("graphlib");
var Graph = graphlib.Graph;
import nodes from "./nodes_edges.json";
import dijkstra from "./dijkstra";

export default function mr5graph() {
	let graph = new Graph({ directed: false, compound: false, multigraph: false });
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
	let inbetween_nodes = dijkstra(graph, "Foyer", edge => graph.edge(edge));
	console.log(inbetween_nodes)
	//return inbetween_nodes;
}