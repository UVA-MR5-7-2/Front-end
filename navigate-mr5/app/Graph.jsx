import React, { useEffect } from 'react';
import Graph from 'graphlib';

const GraphComponent = ({ nodes, graph }) => {
  useEffect(() => {
    if (graph) {
      const shortestPath = findShortestPath(graph, nodes[0], nodes[nodes.length - 1]);
      console.log(shortestPath);  // Log the shortest path
    }
  }, [graph, nodes]);

  // Dijkstra algorithm for finding the shortest path
  const findShortestPath = (graph, start, end) => {
    const distances = {};
    const previousNodes = {};
    const unvisitedNodes = new Set();

    // Initialize distances
    graph.nodes().forEach(node => {
      distances[node] = node === start ? 0 : Infinity;
      previousNodes[node] = null;
      unvisitedNodes.add(node);
    });

    while (unvisitedNodes.size) {
      const currentNode = getClosestNode(unvisitedNodes, distances);
      if (currentNode === end) break;
      unvisitedNodes.delete(currentNode);

      const neighbors = graph.neighbors(currentNode);
      neighbors.forEach(neighbor => {
        const newDist = distances[currentNode] + graph.edge(currentNode, neighbor).weight;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previousNodes[neighbor] = currentNode;
        }
      });
    }

    // Reconstruct the shortest path
    const path = [];
    let currentNode = end;
    while (previousNodes[currentNode] !== null) {
      path.unshift(currentNode);
      currentNode = previousNodes[currentNode];
    }
    return path;
  };

  const getClosestNode = (nodes, distances) => {
    let closestNode = null;
    let smallestDistance = Infinity;
    nodes.forEach(node => {
      if (distances[node] < smallestDistance) {
        smallestDistance = distances[node];
        closestNode = node;
      }
    });
    return closestNode;
  };

  return <div>Shortest Path: {JSON.stringify(nodes)}</div>;
};

export default GraphComponent;