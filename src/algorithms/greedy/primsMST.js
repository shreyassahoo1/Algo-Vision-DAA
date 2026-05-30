export const primsMST = (graphMatrix) => {
  const snapshots = [];
  const n = graphMatrix.length;
  const inMST = Array(n).fill(false);
  const key = Array(n).fill(Infinity);
  const parent = Array(n).fill(-1);

  key[0] = 0;
  
  snapshots.push({
    type: 'INIT',
    inMST: [...inMST],
    key: [...key],
    parent: [...parent],
    mstEdges: [],
    description: 'Start with node 0. Set its key to 0, and all other keys to Infinity.'
  });

  const mstEdges = [];

  for (let count = 0; count < n; count++) {
    // Find min key vertex not in MST
    let u = -1;
    let min = Infinity;
    for (let v = 0; v < n; v++) {
      if (!inMST[v] && key[v] < min) {
        min = key[v];
        u = v;
      }
    }

    if (u === -1) break; // Graph disconnected

    inMST[u] = true;
    if (parent[u] !== -1) {
      mstEdges.push({ u: parent[u], v: u, weight: graphMatrix[parent[u]][u] });
    }

    snapshots.push({
      type: 'INCLUDE',
      inMST: [...inMST],
      key: [...key],
      parent: [...parent],
      mstEdges: [...mstEdges],
      activeNode: u,
      description: `Included Node ${u} in MST. Minimum edge weight connecting it was ${min === 0 ? 'N/A (Start)' : min}.`
    });

    // Update keys of adjacent vertices
    for (let v = 0; v < n; v++) {
      if (graphMatrix[u][v] !== Infinity && graphMatrix[u][v] !== 0 && !inMST[v] && graphMatrix[u][v] < key[v]) {
        key[v] = graphMatrix[u][v];
        parent[v] = u;
        snapshots.push({
          type: 'UPDATE_KEY',
          inMST: [...inMST],
          key: [...key],
          parent: [...parent],
          mstEdges: [...mstEdges],
          activeNode: u,
          description: `Update key for adjacent Node ${v} to ${key[v]} via Node ${u}.`
        });
      }
    }
  }

  snapshots.push({
    type: 'DONE',
    inMST: [...inMST],
    key: [...key],
    parent: [...parent],
    mstEdges: [...mstEdges],
    activeNode: null,
    description: `Prim's Algorithm complete. Total MST weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}.`
  });

  return snapshots;
};
