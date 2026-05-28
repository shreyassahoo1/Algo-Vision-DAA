export const aStar = (graph, startNodeId, targetNodeId) => {
  const snapshots = [];
  const distances = {};
  const fScores = {};
  
  // Calculate heuristic (Euclidean distance)
  const heuristic = (nodeId) => {
    const node = graph.nodes.find(n => n.id === nodeId);
    const target = graph.nodes.find(n => n.id === targetNodeId);
    if (!node || !target) return 0;
    return Math.sqrt(Math.pow(node.x - target.x, 2) + Math.pow(node.y - target.y, 2)) / 50; // scaled down
  };

  graph.nodes.forEach(n => {
    distances[n.id] = Infinity;
    fScores[n.id] = Infinity;
  });
  distances[startNodeId] = 0;
  fScores[startNodeId] = heuristic(startNodeId);

  const pq = [{ id: startNodeId, f: fScores[startNodeId] }];
  const visited = new Set();
  const visitedNodesArray = [];

  snapshots.push({
    activeNode: startNodeId,
    visitedNodes: [],
    distances: { ...distances },
    description: `A* Search starting at ${graph.nodes.find(n=>n.id===startNodeId)?.label}. Target is ${graph.nodes.find(n=>n.id===targetNodeId)?.label}.`
  });

  while (pq.length > 0) {
    pq.sort((a, b) => a.f - b.f);
    const curr = pq.shift();
    const currId = curr.id;

    if (visited.has(currId)) continue;
    visited.add(currId);
    visitedNodesArray.push(currId);

    snapshots.push({
      activeNode: currId,
      visitedNodes: [...visitedNodesArray],
      distances: { ...distances },
      description: `Evaluating node ${graph.nodes.find(n => n.id === currId)?.label} with f-score ${fScores[currId].toFixed(1)}.`
    });

    if (currId === targetNodeId) {
      snapshots.push({
        activeNode: null,
        visitedNodes: [...visitedNodesArray],
        distances: { ...distances },
        description: `Target node ${graph.nodes.find(n => n.id === targetNodeId)?.label} reached! A* Search complete.`
      });
      return snapshots;
    }

    const neighbors = graph.edges.filter(e => e.from === currId || (!graph.directed && e.to === currId));
    
    for (const edge of neighbors) {
      const neighborId = edge.from === currId ? edge.to : edge.from;
      if (visited.has(neighborId)) continue;

      const weight = edge.weight || 1;
      const tentativeG = distances[currId] + weight;

      if (tentativeG < distances[neighborId]) {
        distances[neighborId] = tentativeG;
        fScores[neighborId] = tentativeG + heuristic(neighborId);
        pq.push({ id: neighborId, f: fScores[neighborId] });
        
        snapshots.push({
          activeNode: neighborId,
          visitedNodes: [...visitedNodesArray],
          distances: { ...distances },
          description: `Updated node ${graph.nodes.find(n => n.id === neighborId)?.label} (g: ${tentativeG}, f: ${fScores[neighborId].toFixed(1)}).`
        });
      }
    }
  }

  snapshots.push({
    activeNode: null,
    visitedNodes: [...visitedNodesArray],
    distances: { ...distances },
    description: 'A* Search complete. Target not reachable.'
  });

  return snapshots;
};
