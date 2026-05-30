export const algorithmDescriptions = {
  // Sorting Algorithms
  'Bubble Sort': {
    category: 'Brute Force / Comparison-Based',
    description: 'Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    complexity: 'O(n²)',
    space: 'O(1)',
    details: 'Operates by repeatedly swapping adjacent elements that are out of order until the entire array is sorted.'
  },
  'Selection Sort': {
    category: 'Brute Force / Comparison-Based',
    description: 'Selection Sort divides the input array into a sorted and an unsorted region, repeatedly finding the minimum element from the unsorted region and moving it to the sorted region.',
    complexity: 'O(n²)',
    space: 'O(1)',
    details: 'In-place comparison sort that is simple but inefficient on large lists.'
  },
  'Insertion Sort': {
    category: 'Decrease and Conquer (Incremental)',
    description: 'Insertion Sort builds the final sorted array one element at a time by taking each new element and inserting it into its correct position within the already sorted portion.',
    complexity: 'O(n²)',
    space: 'O(1)',
    details: 'Highly efficient for small datasets or arrays that are already mostly sorted.'
  },
  'Merge Sort': {
    category: 'Divide and Conquer',
    description: 'Merge Sort is a stable, comparison-based sorting algorithm that recursively splits the array into halves, sorts each half, and then merges the sorted halves back together.',
    complexity: 'O(n log n)',
    space: 'O(n)',
    details: 'A classic divide-and-conquer algorithm that guarantees efficient worst-case performance.'
  },
  'Quick Sort': {
    category: 'Divide and Conquer',
    description: 'Quick Sort partitions the array around a chosen pivot element, recursively sorting the sub-arrays of elements smaller and larger than the pivot.',
    complexity: 'O(n log n) average, O(n²) worst',
    space: 'O(log n)',
    details: 'Extremely fast in practice with low overhead, though its worst-case performance is quadratic.'
  },

  // Graph Algorithms
  'BFS': {
    category: 'Decrease and Conquer (State Space Traversal)',
    description: 'Breadth-First Search (BFS) is a graph traversal algorithm that visits all neighboring nodes at the current depth before moving to nodes at the next depth level.',
    complexity: 'O(V + E)',
    space: 'O(V)',
    details: 'Uses a queue data structure to find the shortest path in unweighted graphs.'
  },
  'DFS': {
    category: 'Decrease and Conquer (State Space Traversal)',
    description: 'Depth-First Search (DFS) is a graph traversal algorithm that explores as deep as possible along each branch before backtracking to explore alternative paths.',
    complexity: 'O(V + E)',
    space: 'O(V)',
    details: 'Uses recursion or a stack to explore paths fully; fundamental for cycle detection and connectivity.'
  },
  'Dijkstra': {
    category: 'Greedy Method',
    description: "Dijkstra's Algorithm finds the single-source shortest path from a starting vertex to all other vertices in a weighted graph with non-negative edge weights.",
    complexity: 'O((V + E) log V)',
    space: 'O(V)',
    details: 'Greedily selects the closest unvisited vertex, updating the tentative distances of its neighbors.'
  },
  'Topological Sort': {
    category: 'Decrease and Conquer (DFS-based or Source Removal)',
    description: 'Topological Sort provides a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u → v, vertex u comes before v.',
    complexity: 'O(V + E)',
    space: 'O(V)',
    details: 'Used to schedule tasks with pre-requisite dependencies; impossible if the graph contains cycles.'
  },
  'Bellman-Ford': {
    category: 'Dynamic Programming',
    description: 'Bellman-Ford computes single-source shortest paths in a weighted graph. Unlike Dijkstra, it can handle negative edge weights and detect negative cycles.',
    complexity: 'O(V * E)',
    space: 'O(V)',
    details: 'Repeatedly relaxes all edges V-1 times, dynamically building shortest path estimates.'
  },
  'A* Search': {
    category: 'Branch and Bound (Heuristic Search)',
    description: 'A* Search is a pathfinding algorithm that extends Dijkstra by using a heuristic function to estimate the remaining cost to the target, guiding the search efficiently.',
    complexity: 'O(E) worst-case',
    space: 'O(V)',
    details: 'Combines actual distance from start with heuristic estimate of distance to target to find optimal paths fast.'
  },
  'Tarjan algorithm': {
    category: 'Decrease and Conquer (DFS-based or Source Removal)',
    description: "Tarjan's Algorithm is an efficient linear-time DFS-based method used primarily to identify Strongly Connected Components (SCCs) in a directed graph.",
    complexity: 'O(V + E)',
    space: 'O(V)',
    details: 'Utilizes a single DFS traversal combined with an active recursion stack to detect self-contained cycles where every vertex can reach every other vertex.'
  },

  // Dynamic Programming Algorithms
  'Knapsack 0/1': {
    category: 'Dynamic Programming',
    description: 'The 0/1 Knapsack problem selects items of given weights and values to maximize total value in a knapsack of capacity W, without taking fractions.',
    complexity: 'O(n * W)',
    space: 'O(n * W)',
    details: 'Uses a table to store solutions to subproblems, building up to the optimal set of item choices.'
  },
  'Floyd-Warshall': {
    category: 'Dynamic Programming',
    description: 'Floyd-Warshall is an all-pairs shortest path algorithm that dynamically computes shortest path distances between every pair of vertices in a weighted graph.',
    complexity: 'O(V³)',
    space: 'O(V²)',
    details: 'Computes intermediate paths through increasingly large subsets of vertices in a triple-nested loop.'
  },

  // Greedy Algorithms
  'Fractional Knapsack': {
    category: 'Greedy Method',
    description: 'Fractional Knapsack maximizes item value in a knapsack of capacity W by sorting items by value-to-weight ratio and greedily taking fractions of items.',
    complexity: 'O(n log n)',
    space: 'O(n)',
    details: 'Unlike 0/1 Knapsack, the greedy choice of picking items with highest density guarantees an optimal solution.'
  },
  "Prim's MST": {
    category: 'Greedy Method',
    description: "Prim's Algorithm constructs a Minimum Spanning Tree (MST) for a weighted undirected graph by greedily adding the cheapest edge from the tree to a new vertex.",
    complexity: 'O(E log V)',
    space: 'O(V)',
    details: 'Starts with a single node and grows the tree by choosing minimum-weight edges incident to visited nodes.'
  },
  "Kruskal's MST": {
    category: 'Greedy Method',
    description: "Kruskal's Algorithm finds a Minimum Spanning Tree (MST) by sorting all graph edges by weight and greedily adding them if they do not create a cycle.",
    complexity: 'O(E log E)',
    space: 'O(V)',
    details: 'Uses a Disjoint Set Union (DSU) data structure to efficiently check and merge separate tree components.'
  },

  // Backtracking Algorithms
  'N-Queens': {
    category: 'Backtracking',
    description: 'The N-Queens problem is the puzzle of placing N chess queens on an N×N chessboard so that no two queens threaten each other.',
    complexity: 'O(N!)',
    space: 'O(N)',
    details: 'Solved using recursive depth-first trial and error, placing queens row by row and backtracking on conflicts.'
  }
};
