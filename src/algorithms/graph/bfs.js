export const bfs = (graph, startNodeId) => {
  const snapshots = [];
  const visited = new Set();
  const componentsTraversal = [];
  const parent = {};

  // Accurate cycle detection pre-pass
  const checkCycle = () => {
    const vis = new Set();
    const stack = new Set();
    
    const dfsCheck = (node, p = null) => {
      vis.add(node);
      stack.add(node);
      
      const neighbors = graph.edges.filter(e => e.from === node).map(e => e.to);
      if (!graph.directed) {
        graph.edges.filter(e => e.to === node).forEach(e => neighbors.push(e.from));
      }
      
      for (const neighbor of neighbors) {
        if (!vis.has(neighbor)) {
          if (dfsCheck(neighbor, node)) return true;
        } else {
          if (graph.directed) {
            if (stack.has(neighbor)) return true;
          } else {
            if (neighbor !== p) return true;
          }
        }
      }
      stack.delete(node);
      return false;
    };
    
    for (const n of graph.nodes) {
      if (!vis.has(n.id)) {
        if (dfsCheck(n.id)) return true;
      }
    }
    return false;
  };

  const cycleDetected = checkCycle();

  const allNodes = graph.nodes.map(n => n.id);
  // Prioritize the startNodeId, followed by the rest of the nodes
  const startNodesOrder = startNodeId 
    ? [startNodeId, ...allNodes.filter(id => id !== startNodeId)]
    : allNodes;

  for (const sNode of startNodesOrder) {
    if (visited.has(sNode)) continue;

    const currentComponent = [];
    componentsTraversal.push(currentComponent);

    const queue = [sNode];
    visited.add(sNode);
    
    const startNodeObj = graph.nodes.find(n => n.id === sNode);
    const startLabel = startNodeObj ? startNodeObj.label : sNode;

    snapshots.push({
      activeNode: sNode,
      visitedNodes: Array.from(visited),
      description: `Starting BFS traversal on new component from node ${startLabel}.`,
      componentsTraversal: componentsTraversal.map(arr => [...arr]),
      cycleDetected
    });

    while (queue.length > 0) {
      const current = queue.shift();
      const currentObj = graph.nodes.find(n => n.id === current);
      const currentLabel = currentObj ? currentObj.label : current;
      
      if (!currentComponent.includes(current)) {
        currentComponent.push(current);
      }

      snapshots.push({
        activeNode: current,
        visitedNodes: Array.from(visited),
        description: `Visiting node ${currentLabel} in BFS.`,
        componentsTraversal: componentsTraversal.map(arr => [...arr]),
        cycleDetected
      });
      
      const neighbors = graph.edges.filter(e => e.from === current).map(e => e.to);
      // Include undirected edges
      graph.edges.filter(e => e.to === current && !graph.directed).forEach(e => neighbors.push(e.from));

      for (const neighbor of neighbors) {
        const neighborObj = graph.nodes.find(n => n.id === neighbor);
        const neighborLabel = neighborObj ? neighborObj.label : neighbor;

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent[neighbor] = current;
          queue.push(neighbor);
          snapshots.push({
            activeNode: current,
            visitedNodes: Array.from(visited),
            description: `Discovered unvisited neighbor ${neighborLabel}. Adding to queue.`,
            componentsTraversal: componentsTraversal.map(arr => [...arr]),
            cycleDetected
          });
        }
      }
    }
  }

  snapshots.push({
    activeNode: null,
    visitedNodes: Array.from(visited),
    isComplete: true,
    description: `BFS Traversal Complete. ${cycleDetected ? 'Cycle detected!' : 'No cycles detected.'}`,
    componentsTraversal: componentsTraversal.map(arr => [...arr]),
    cycleDetected
  });

  return snapshots;
};




