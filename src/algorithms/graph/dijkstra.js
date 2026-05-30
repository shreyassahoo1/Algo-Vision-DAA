export const dijkstra = (graph, startNodeId) => {
  const snapshots = [];
  const distances = {};
  const visited = new Set();
  
  // Initialize distances
  graph.nodes.forEach(node => {
    distances[node.id] = Infinity;
  });
  distances[startNodeId] = 0;

  // Simple priority queue using array
  const pq = [{ id: startNodeId, dist: 0 }];

  snapshots.push({ 
    activeNode: null, 
    visitedNodes: [], 
    distances: { ...distances },
    description: "Initialize all distances to Infinity, and start node to 0." 
  });

  while (pq.length > 0) {
    // Sort to get minimum distance node
    pq.sort((a, b) => a.dist - b.dist);
    const current = pq.shift();

    if (visited.has(current.id)) continue;

    visited.add(current.id);
    snapshots.push({ 
      activeNode: current.id, 
      visitedNodes: Array.from(visited), 
      distances: { ...distances },
      description: `Visiting node with minimum distance (${current.dist}).`
    });

    const neighbors = graph.edges.filter(e => e.from === current.id).map(e => e.to);
    graph.edges.filter(e => e.to === current.id && !graph.directed).forEach(e => neighbors.push(e.from));

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        // Retrieve edge weight if available
        const edge = graph.edges.find(e => 
          (e.from === current.id && e.to === neighbor) || 
          (!graph.directed && e.from === neighbor && e.to === current.id)
        );
        const weight = edge ? (edge.weight || 1) : 1;
        const newDist = distances[current.id] + weight;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          pq.push({ id: neighbor, dist: newDist });
          
          snapshots.push({ 
            activeNode: current.id, 
            visitedNodes: Array.from(visited), 
            distances: { ...distances },
            description: `Updated distance to neighbor ${graph.nodes.find(n => n.id === neighbor)?.label} to ${newDist}.`
          });
        }
      }
    }
  }

  snapshots.push({ 
    activeNode: null, 
    visitedNodes: Array.from(visited), 
    distances: { ...distances },
    isComplete: true,
    description: "Dijkstra's algorithm complete."
  });

  return snapshots;
};

