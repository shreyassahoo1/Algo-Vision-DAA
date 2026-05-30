export const tarjan = (graph, startNodeId) => {
  const snapshots = [];
  const visited = new Set();
  const dfn = {};
  const low = {};
  const onStack = new Set();
  const stack = [];
  const sccs = [];
  let index = 1;

  const nodeLabels = {};
  graph.nodes.forEach(n => {
    nodeLabels[n.id] = n.label || n.id;
  });

  const getNeighbors = (nodeId) => {
    const neighbors = graph.edges.filter(e => e.from === nodeId).map(e => e.to);
    if (!graph.directed) {
      graph.edges.filter(e => e.to === nodeId).forEach(e => {
        if (!neighbors.includes(e.from)) {
          neighbors.push(e.from);
        }
      });
    }
    return neighbors;
  };

  const dfsHelper = (u, pNode = null) => {
    visited.add(u);
    dfn[u] = index;
    low[u] = index;
    index++;
    stack.push(u);
    onStack.add(u);

    snapshots.push({
      activeNode: u,
      visitedNodes: Array.from(visited),
      dfn: { ...dfn },
      low: { ...low },
      stack: [...stack],
      sccs: sccs.map(scc => [...scc]),
      description: `DFS visiting node ${nodeLabels[u]}. Set DFN = ${dfn[u]} and LOW = ${low[u]}. Push to stack.`
    });

    const neighbors = getNeighbors(u);

    for (const v of neighbors) {
      // In undirected graph, skip immediate parent to avoid trivial cycles
      if (!graph.directed && v === pNode) continue;

      if (!visited.has(v)) {
        snapshots.push({
          activeNode: u,
          visitedNodes: Array.from(visited),
          dfn: { ...dfn },
          low: { ...low },
          stack: [...stack],
          sccs: sccs.map(scc => [...scc]),
          description: `Neighbor ${nodeLabels[v]} is unvisited. Recursively calling DFS on ${nodeLabels[v]} from ${nodeLabels[u]}.`
        });

        dfsHelper(v, u);

        const oldLow = low[u];
        low[u] = Math.min(low[u], low[v]);

        snapshots.push({
          activeNode: u,
          visitedNodes: Array.from(visited),
          dfn: { ...dfn },
          low: { ...low },
          stack: [...stack],
          sccs: sccs.map(scc => [...scc]),
          description: `Returned from DFS on ${nodeLabels[v]} to ${nodeLabels[u]}. Update LOW of ${nodeLabels[u]} = min(LOW[${nodeLabels[u]}], LOW[${nodeLabels[v]}]) = min(${oldLow}, ${low[v]}) = ${low[u]}.`
        });
      } else if (onStack.has(v)) {
        const oldLow = low[u];
        low[u] = Math.min(low[u], dfn[v]);

        snapshots.push({
          activeNode: u,
          visitedNodes: Array.from(visited),
          dfn: { ...dfn },
          low: { ...low },
          stack: [...stack],
          sccs: sccs.map(scc => [...scc]),
          description: `Back-edge found: Neighbor ${nodeLabels[v]} is already on the recursion stack. Update LOW of ${nodeLabels[u]} = min(LOW[${nodeLabels[u]}], DFN[${nodeLabels[v]}]) = min(${oldLow}, ${dfn[v]}) = ${low[u]}.`
        });
      } else {
        snapshots.push({
          activeNode: u,
          visitedNodes: Array.from(visited),
          dfn: { ...dfn },
          low: { ...low },
          stack: [...stack],
          sccs: sccs.map(scc => [...scc]),
          description: `Neighbor ${nodeLabels[v]} is already visited and not on the stack (cross-edge). No update to LOW of ${nodeLabels[u]}.`
        });
      }
    }

    if (low[u] === dfn[u]) {
      const currentSCC = [];
      let poppedNode;
      do {
        poppedNode = stack.pop();
        onStack.delete(poppedNode);
        currentSCC.push(poppedNode);
      } while (poppedNode !== u);

      // Reversing to preserve order of discovery / standard presentation
      currentSCC.reverse();
      sccs.push(currentSCC);

      snapshots.push({
        activeNode: u,
        visitedNodes: Array.from(visited),
        dfn: { ...dfn },
        low: { ...low },
        stack: [...stack],
        sccs: sccs.map(scc => [...scc]),
        description: `Completed processing node ${nodeLabels[u]}. DFN === LOW (${dfn[u]} === ${low[u]}). Identified new SCC: { ${currentSCC.map(id => nodeLabels[id]).join(', ')} }.`
      });
    }
  };

  const allNodes = graph.nodes.map(n => n.id);
  const startNodesOrder = startNodeId
    ? [startNodeId, ...allNodes.filter(id => id !== startNodeId)]
    : allNodes;

  for (const sNode of startNodesOrder) {
    if (!visited.has(sNode)) {
      snapshots.push({
        activeNode: null,
        visitedNodes: Array.from(visited),
        dfn: { ...dfn },
        low: { ...low },
        stack: [...stack],
        sccs: sccs.map(scc => [...scc]),
        description: `Starting Tarjan DFS traversal component from node ${nodeLabels[sNode]}.`
      });
      dfsHelper(sNode);
    }
  }

  snapshots.push({
    activeNode: null,
    visitedNodes: Array.from(visited),
    dfn: { ...dfn },
    low: { ...low },
    stack: [...stack],
    sccs: sccs.map(scc => [...scc]),
    isComplete: true,
    description: `Tarjan's algorithm complete. Found ${sccs.length} Strongly Connected Components: ${sccs.map(scc => `{${scc.map(id => nodeLabels[id]).join(', ')}}`).join(', ')}.`
  });

  return snapshots;
};
