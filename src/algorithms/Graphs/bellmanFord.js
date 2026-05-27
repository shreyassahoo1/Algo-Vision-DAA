export const bellmanFord = (graph, startNodeId) => {
  const snapshots = [];
  const distances = {};
  graph.nodes.forEach(n => distances[n.id] = Infinity);
  distances[startNodeId] = 0;

  snapshots.push({
    activeNode: null,
    visitedNodes: [],
    distances: { ...distances },
    description: 'Initialize distances to Infinity, and Start Node to 0.'
  });

  const V = graph.nodes.length;
  // Create directed edges if graph is undirected
  let edges = graph.edges;
  if (!graph.directed) {
    edges = [];
    graph.edges.forEach(e => {
      edges.push({ ...e });
      edges.push({ from: e.to, to: e.from, weight: e.weight });
    });
  }

  // Assign random weights if missing (simulate weight 1 for visualizer if not given)
  edges.forEach(e => { if (e.weight === undefined) e.weight = 1; });

  for (let i = 0; i < V - 1; i++) {
    for (const edge of edges) {
      if (distances[edge.from] !== Infinity && distances[edge.from] + edge.weight < distances[edge.to]) {
        distances[edge.to] = distances[edge.from] + edge.weight;
        snapshots.push({
          activeNode: edge.to,
          visitedNodes: [edge.from, edge.to],
          distances: { ...distances },
          description: `Iteration ${i+1}: Relaxed edge from ${graph.nodes.find(n => n.id === edge.from)?.label} to ${graph.nodes.find(n => n.id === edge.to)?.label}. New distance: ${distances[edge.to]}.`
        });
      }
    }
  }

  snapshots.push({
    activeNode: null,
    visitedNodes: graph.nodes.map(n => n.id),
    distances: { ...distances },
    description: 'Bellman-Ford complete. Shortest paths found.'
  });

  return snapshots;
};
