import React, { useEffect } from 'react';
var graphlib = require("graphlib");
var Graph = graphlib.Graph;
import nodes from "./nodes_edges.json"

export default function mr5graph() {
	let graph = new Graph({ directed: true, compound: false, multigraph: false });
	//graph.setLabel("mr5-graph");
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
	console.log(graphlib.alg.floydWarshall(graph, edge => graph.edge(edge)));
}