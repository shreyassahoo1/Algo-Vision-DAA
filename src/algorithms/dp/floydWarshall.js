export const floydWarshall = (graphMatrix) => {
  const snapshots = [];
  const n = graphMatrix.length;
  // Deep copy
  const dist = graphMatrix.map(row => [...row]);

  snapshots.push({
    type: 'INIT',
    dp: dist.map(row => [...row]),
    description: 'Initialize distance matrix with original graph edges. (Infinity = no edge)',
    activeCell: null,
    highlightCells: []
  });

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // Skip comparing if there's no path to/from intermediate node k
        if (dist[i][k] === Infinity || dist[k][j] === Infinity) continue;
        
        const oldVal = dist[i][j];
        const newVal = dist[i][k] + dist[k][j];
        
        if (newVal < oldVal) {
          dist[i][j] = newVal;
          snapshots.push({
            type: 'UPDATE',
            dp: dist.map(row => [...row]),
            description: `Path from node ${i} to ${j} via ${k} is shorter: ${dist[i][k]} + ${dist[k][j]} = ${newVal} < ${oldVal === Infinity ? '∞' : oldVal}.`,
            activeCell: { r: i, c: j },
            highlightCells: [{ r: i, c: k }, { r: k, c: j }]
          });
        } else {
          snapshots.push({
            type: 'NO_UPDATE',
            dp: dist.map(row => [...row]),
            description: `Path from node ${i} to ${j} via ${k} (${newVal}) is NOT shorter than direct path (${oldVal === Infinity ? '∞' : oldVal}).`,
            activeCell: { r: i, c: j },
            highlightCells: [{ r: i, c: k }, { r: k, c: j }]
          });
        }
      }
    }
  }

  snapshots.push({
    type: 'DONE',
    dp: dist.map(row => [...row]),
    description: 'Floyd-Warshall complete. Matrix contains all-pairs shortest paths.',
    activeCell: null,
    highlightCells: []
  });

  return snapshots;
};
