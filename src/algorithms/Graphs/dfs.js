export const dfs = (graph, startNodeId) => {
  const snapshots = [];
  const visited = new Set();
  const componentsTraversal = [];
  const recStack = new Set();
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

  const dfsHelper = (node, currentComponent, pNode = null) => {
    visited.add(node);
    recStack.add(node);
    if (pNode) parent[node] = pNode;

    if (!currentComponent.includes(node)) {
      currentComponent.push(node);
    }
    
    const nodeObj = graph.nodes.find(n => n.id === node);
    const label = nodeObj ? nodeObj.label : node;

    snapshots.push({ 
      activeNode: node, 
      visitedNodes: Array.from(visited),
      description: `DFS visiting node ${label}.`,
      componentsTraversal: componentsTraversal.map(arr => [...arr]),
      cycleDetected
    });

    const neighbors = graph.edges.filter(e => e.from === node).map(e => e.to);
    // Include undirected edges
    if (!graph.directed) {
      graph.edges.filter(e => e.to === node).forEach(e => neighbors.push(e.from));
    }

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor, currentComponent, node);
      }
    }

    recStack.delete(node);
  };

  const allNodes = graph.nodes.map(n => n.id);
  const startNodesOrder = startNodeId 
    ? [startNodeId, ...allNodes.filter(id => id !== startNodeId)]
    : allNodes;

  for (const sNode of startNodesOrder) {
    if (visited.has(sNode)) continue;
    
    const currentComponent = [];
    componentsTraversal.push(currentComponent);

    const nodeObj = graph.nodes.find(n => n.id === sNode);
    const label = nodeObj ? nodeObj.label : sNode;
    
    snapshots.push({
      activeNode: sNode,
      visitedNodes: Array.from(visited),
      description: `Starting DFS traversal on new component from node ${label}.`,
      componentsTraversal: componentsTraversal.map(arr => [...arr]),
      cycleDetected
    });
    
    dfsHelper(sNode, currentComponent);
  }

  snapshots.push({ 
    activeNode: null, 
    visitedNodes: Array.from(visited), 
    isComplete: true,
    description: `DFS Traversal Complete. ${cycleDetected ? 'Cycle detected!' : 'No cycles detected.'}`,
    componentsTraversal: componentsTraversal.map(arr => [...arr]),
    cycleDetected
  });
  
  return snapshots;
};



