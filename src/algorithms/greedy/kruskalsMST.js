export const kruskalsMST = (graphMatrix) => {
  const snapshots = [];
  const n = graphMatrix.length;
  const edges = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (graphMatrix[i][j] !== Infinity && graphMatrix[i][j] !== 0) {
        edges.push({ u: i, v: j, weight: graphMatrix[i][j] });
      }
    }
  }

  edges.sort((a, b) => a.weight - b.weight);

  const parent = Array(n).fill(0).map((_, idx) => idx);
  const rank = Array(n).fill(0);

  const find = (i) => {
    if (parent[i] === i) return i;
    return parent[i] = find(parent[i]);
  };

  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      if (rank[rootI] < rank[rootJ]) {
        parent[rootI] = rootJ;
      } else if (rank[rootI] > rank[rootJ]) {
        parent[rootJ] = rootI;
      } else {
        parent[rootJ] = rootI;
        rank[rootI]++;
      }
      return true;
    }
    return false;
  };

  snapshots.push({
    type: 'INIT',
    mstEdges: [],
    activeEdge: null,
    status: 'none',
    description: `Extracted ${edges.length} edges and sorted them by weight.`
  });

  const mstEdges = [];
  let totalWeight = 0;

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const u = edge.u;
    const v = edge.v;

    snapshots.push({
      type: 'EVALUATE',
      mstEdges: [...mstEdges],
      activeEdge: edge,
      status: 'evaluating',
      description: `Evaluating edge between Node ${u} and Node ${v} (Weight: ${edge.weight}).`
    });

    if (union(u, v)) {
      mstEdges.push(edge);
      totalWeight += edge.weight;
      snapshots.push({
        type: 'ACCEPTED',
        mstEdges: [...mstEdges],
        activeEdge: edge,
        status: 'accepted',
        description: `Edge (${u}, ${v}) does not form a cycle. Added to MST. Total weight: ${totalWeight}.`
      });
    } else {
      snapshots.push({
        type: 'REJECTED',
        mstEdges: [...mstEdges],
        activeEdge: edge,
        status: 'rejected',
        description: `Edge (${u}, ${v}) forms a cycle. Rejected.`
      });
    }

    if (mstEdges.length === n - 1) break;
  }

  snapshots.push({
    type: 'DONE',
    mstEdges: [...mstEdges],
    activeEdge: null,
    status: 'none',
    description: `Kruskal's Algorithm complete. Total MST weight: ${totalWeight}.`
  });

  return snapshots;
};
