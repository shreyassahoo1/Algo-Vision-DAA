export const topologicalSort = (graph) => {
  const snapshots = [];
  const inDegree = {};
  const ordering = [];
  
  // Initialize in-degree
  graph.nodes.forEach(n => inDegree[n.id] = 0);
  
  // Calculate in-degree for directed edges
  graph.edges.forEach(e => {
    if (inDegree[e.to] !== undefined) {
      inDegree[e.to]++;
    }
  });

  const queue = graph.nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);

  snapshots.push({
    activeNode: null,
    visitedNodes: [...ordering],
    ordering: [...ordering],
    inDegree: { ...inDegree },
    description: "Calculated in-degrees. Adding nodes with in-degree 0 to the queue."
  });

  while (queue.length > 0) {
    const current = queue.shift();
    ordering.push(current);

    snapshots.push({
      activeNode: current,
      visitedNodes: [...ordering],
      ordering: [...ordering],
      inDegree: { ...inDegree },
      description: `Processing node with 0 in-degree. Adding to topological ordering.`
    });

    const neighbors = graph.edges.filter(e => e.from === current).map(e => e.to);
    for (const neighbor of neighbors) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }

    snapshots.push({
      activeNode: current,
      visitedNodes: [...ordering],
      ordering: [...ordering],
      inDegree: { ...inDegree },
      description: `Decremented in-degree of neighbors.`
    });
  }

  const isCycle = ordering.length !== graph.nodes.length;
  
  snapshots.push({
    activeNode: null,
    visitedNodes: [...ordering],
    ordering: [...ordering],
    inDegree: { ...inDegree },
    isComplete: true,
    cycleDetected: isCycle,
    description: isCycle 
      ? "Cycle detected! Valid topological ordering is not possible." 
      : "Topological Sort complete."
  });

  return snapshots;
};
