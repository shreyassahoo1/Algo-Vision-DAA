# Algorithm Lab Implementation Plan

This document outlines the architecture, components, and implementation strategy for the Algorithm Lab application.

## 1. Goal Description

Build a modern, interactive web application using React and Tailwind CSS that allows users to visualize, explore, and compare various algorithms across different categories (Sorting, Graphs, Dynamic Programming, Greedy, Backtracking). The app will feature step-by-step animations, performance metrics, and educational summaries.

> [!IMPORTANT]
> **User Review Required**: This is a large-scale project. I have proposed an architecture below. Please review the "Open Questions" and the phased approach. I recommend we start with the core layout and the Sorting module first, as it establishes the animation and control patterns we will use throughout the app.

## 2. Technical Decisions (from Open Questions)

1. **Graph Visualization**: We will build a custom SVG-based interactive graph editor for precise control over algorithmic animations.
2. **State Management**: We will use React's built-in state/context for managing the algorithm execution states and playback.
3. **Styling**: We will use Tailwind CSS with basic styling initially, focusing on functionality first. We will refine the UX/UI in later stages.

## 3. Proposed Architecture & State Management

### Animation Strategy
To support pause, play, step forward/backward, and speed control, algorithms will not modify the UI directly. Instead, each algorithm will run and generate an array of "state snapshots" or "actions" (e.g., `[{type: 'COMPARE', indices: [0, 1]}, {type: 'SWAP', indices: [0, 1]}]`). 
A central playback engine will read these snapshots at the defined speed and update the UI state accordingly.

### Tech Stack
- **Framework**: React (via Vite for fast builds)
- **Styling**: Tailwind CSS
- **Icons**: `lucide-react`
- **Routing**: `react-router-dom` for navigating categories

## 4. Proposed Changes (Phased Implementation)

### Phase 1: Foundation & Sorting (Recommended Starting Point)
Set up the project, basic UI shell, and the Sorting visualization (which is the most straightforward to animate).

#### [NEW] Setup Project
- Run `npm create vite@latest . -- --template react`
- Install dependencies: `tailwindcss`, `react-router-dom`, `lucide-react`

#### [NEW] `src/App.jsx`
- Configure routing for categories.

#### [NEW] `src/components/Layout/`
- `Sidebar.jsx`: Navigation menu.
- `ControlPanel.jsx`: Play, pause, reset, speed slider.
- `InfoPanel.jsx`: Displays description, time/space complexity.

#### [NEW] `src/algorithms/sorting/`
- Logic for Bubble, Selection, Insertion, Merge, Quick sort returning state snapshots.

#### [NEW] `src/pages/SortingVisualizer.jsx`
- Renders array as bars, integrates `ControlPanel` and animation playback engine.

### Phase 2: Graph Algorithms
#### [NEW] `src/algorithms/graph/` & `src/pages/GraphVisualizer.jsx`
- Interactive SVG canvas to add nodes/edges.
- Implement BFS, DFS, Dijkstra, Topological Sort.

### Phase 3: Dynamic Programming & Greedy
#### [NEW] `src/pages/DPVisualizer.jsx` & `GreedyVisualizer.jsx`
- Grid/Table components for Knapsack/Floyd's.
- Tree visualizer for Huffman/Prim's.

### Phase 4: Backtracking & Comparison
#### [NEW] `src/pages/BacktrackingVisualizer.jsx`
- Chessboard UI for N-Queens.
#### [NEW] `src/pages/ComparisonVisualizer.jsx`
- Side-by-side execution engine for multiple algorithms.

## 5. Verification Plan

### Automated/Manual Verification
- **Visual Testing**: Run `npm run dev` and manually verify that sorting algorithms correctly sort arrays.
- **Playback Controls**: Test play, pause, step, reset, and speed changes to ensure the visualizer responds accurately without glitches.
- **Responsiveness**: Verify the layout works on smaller desktop/tablet screens.
