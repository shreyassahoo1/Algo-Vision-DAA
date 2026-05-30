import { bfs, dfs, dijkstra, topologicalSort, bellmanFord, aStar, tarjan } from './src/algorithms/graph/index.js';

const graph = {
  nodes: [
    { id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }, { id: 'E' }
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'E' },
    { from: 'D', to: 'E' }
  ],
  directed: false
};

console.log("--- Testing Graph Algorithms ---");

// BFS
const bfsSnaps = bfs(graph, 'A');
const bfsFinal = bfsSnaps[bfsSnaps.length - 1];
console.log(`BFS: ${bfsFinal.visitedNodes.length === 5 ? '✅ PASS' : '❌ FAIL'} | Visited: ${bfsFinal.visitedNodes.join(',')}`);

// DFS
const dfsSnaps = dfs(graph, 'A');
const dfsFinal = dfsSnaps[dfsSnaps.length - 1];
console.log(`DFS: ${dfsFinal.visitedNodes.length === 5 ? '✅ PASS' : '❌ FAIL'} | Visited: ${dfsFinal.visitedNodes.join(',')}`);

// Dijkstra
const dijkstraSnaps = dijkstra(graph, 'A');
const dijkstraFinal = dijkstraSnaps[dijkstraSnaps.length - 1];
const distances = dijkstraFinal.distances;
const dijkstraPass = distances['A'] === 0 && distances['B'] === 1 && distances['E'] === 2;
console.log(`Dijkstra: ${dijkstraPass ? '✅ PASS' : '❌ FAIL'} | Distances from A: E=${distances['E']}`);

// Topological Sort
const directedGraph = {
  nodes: [
    { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }
  ],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
    { from: '3', to: '4' }
  ],
  directed: true
};

const topoSnaps = topologicalSort(directedGraph);
const topoFinal = topoSnaps[topoSnaps.length - 1];
// A valid topological order should put 1 before 2 and 3, and 2,3 before 4.
const ord = topoFinal.ordering;
const topoPass = ord.indexOf('1') < ord.indexOf('2') && ord.indexOf('2') < ord.indexOf('4');
console.log(`Topological Sort: ${topoPass ? '✅ PASS' : '❌ FAIL'} | Order: ${ord.join(' -> ')}`);

// Bellman-Ford
const bfSnaps = bellmanFord(graph, 'A');
const bfFinal = bfSnaps[bfSnaps.length - 1];
const bfDistances = bfFinal.distances;
const bfPass = bfDistances['A'] === 0 && bfDistances['B'] === 1 && bfDistances['E'] === 2;
console.log(`Bellman-Ford: ${bfPass ? '✅ PASS' : '❌ FAIL'} | Distances from A: E=${bfDistances['E']}`);

// A* Search
const aStarGraph = {
  nodes: [
    { id: 'A', x: 0, y: 0 }, { id: 'B', x: 10, y: 0 }, { id: 'C', x: 10, y: 10 }
  ],
  edges: [
    { from: 'A', to: 'B', weight: 10 },
    { from: 'B', to: 'C', weight: 10 },
    { from: 'A', to: 'C', weight: 30 } // direct path is worse
  ],
  directed: false
};
const aStarSnaps = aStar(aStarGraph, 'A', 'C');
const aStarFinal = aStarSnaps[aStarSnaps.length - 1];
const aStarDistances = aStarFinal.distances;
const aStarPass = aStarDistances['C'] === 20; // A->B->C
console.log(`A* Search: ${aStarPass ? '✅ PASS' : '❌ FAIL'} | Target Distance: ${aStarDistances['C']}`);

// Tarjan's SCC Algorithm Test
const tarjanGraph = {
  nodes: [
    { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }
  ],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '1' },
    { from: '3', to: '4' },
    { from: '4', to: '5' }
  ],
  directed: true
};

const tarjanSnaps = tarjan(tarjanGraph, '1');
const tarjanFinal = tarjanSnaps[tarjanSnaps.length - 1];
const discoveredSCCs = tarjanFinal.sccs;

// Expecting 3 SCCs: [['5'], ['4'], ['1', '2', '3']] or similar
const tarjanPass = discoveredSCCs.length === 3 &&
  discoveredSCCs.some(scc => scc.includes('5')) &&
  discoveredSCCs.some(scc => scc.includes('4')) &&
  discoveredSCCs.some(scc => scc.includes('1') && scc.includes('2') && scc.includes('3'));

console.log(`Tarjan's Algorithm: ${tarjanPass ? '✅ PASS' : '❌ FAIL'} | Discovered SCCs: ${discoveredSCCs.map(s => `[${s.join(',')}]`).join(', ')}`);

