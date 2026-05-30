import { knapsackDP, floydWarshall } from './src/algorithms/dp/index.js';
import { fractionalKnapsack, primsMST, kruskalsMST } from './src/algorithms/greedy/index.js';

console.log("--- Testing DP Algorithms ---");

// Knapsack DP
const items = [
  { id: 1, weight: 2, value: 12 },
  { id: 2, weight: 1, value: 10 },
  { id: 3, weight: 3, value: 20 },
  { id: 4, weight: 2, value: 15 }
];
const capacity = 5;
const knapsackSnaps = knapsackDP(items, capacity);
const knapsackFinal = knapsackSnaps[knapsackSnaps.length - 1];
// max value should be: items[1](10, w:1) + items[3](15, w:2) + items[0](12, w:2) = 37 (weight 5)
const maxVal = knapsackFinal.dp[4][5];
console.log(`Knapsack 0/1 DP: ${maxVal === 37 ? '✅ PASS' : '❌ FAIL'} | Max Value: ${maxVal}`);

// Floyd-Warshall
const inf = Infinity;
const fwGraph = [
  [0, 5, inf, 10],
  [inf, 0, 3, inf],
  [inf, inf, 0, 1],
  [inf, inf, inf, 0]
];
const fwSnaps = floydWarshall(fwGraph);
const fwFinal = fwSnaps[fwSnaps.length - 1];
// Shortest path from 0 to 3 should be 0->1->2->3 = 5 + 3 + 1 = 9
const sp0to3 = fwFinal.dp[0][3];
console.log(`Floyd-Warshall: ${sp0to3 === 9 ? '✅ PASS' : '❌ FAIL'} | Distance 0->3: ${sp0to3}`);


console.log("\n--- Testing Greedy Algorithms ---");

// Fractional Knapsack
const fracItems = [
  { id: 1, weight: 10, value: 60 },
  { id: 2, weight: 20, value: 100 },
  { id: 3, weight: 30, value: 120 }
];
const fracCap = 50;
const fracSnaps = fractionalKnapsack(fracItems, fracCap);
const fracFinal = fracSnaps[fracSnaps.length - 1];
// takes item 1 (60), item 2 (100), and 20/30 of item 3 (80). Total = 240.
const fracVal = fracFinal.totalValue;
console.log(`Fractional Knapsack: ${fracVal === 240 ? '✅ PASS' : '❌ FAIL'} | Total Value: ${fracVal}`);

// Prim's MST
const primGraph = [
  [0, 2, inf, 6, inf],
  [2, 0, 3, 8, 5],
  [inf, 3, 0, inf, 7],
  [6, 8, inf, 0, 9],
  [inf, 5, 7, 9, 0]
];
const primSnaps = primsMST(primGraph);
const primFinal = primSnaps[primSnaps.length - 1];
// MST edges should be: (0,1)=2, (1,2)=3, (1,4)=5, (0,3)=6. Total = 16.
const mstWeight = primFinal.mstEdges.reduce((sum, e) => sum + e.weight, 0);
console.log(`Prim's MST: ${mstWeight === 16 ? '✅ PASS' : '❌ FAIL'} | Total MST Weight: ${mstWeight}`);

// Kruskal's MST
const kruskalSnaps = kruskalsMST(primGraph); // using the same graph
const kruskalFinal = kruskalSnaps[kruskalSnaps.length - 1];
const kruskalWeight = kruskalFinal.mstEdges.reduce((sum, e) => sum + e.weight, 0);
console.log(`Kruskal's MST: ${kruskalWeight === 16 ? '✅ PASS' : '❌ FAIL'} | Total MST Weight: ${kruskalWeight}`);
