import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, GitCommit } from 'lucide-react';
import { bfs, dfs, dijkstra, topologicalSort, bellmanFord, aStar } from '../algorithms/graph';
import CodeEditorPanel from '../components/CodeEditorPanel';
import AlgorithmInfoCard from '../components/AlgorithmInfoCard';

const algorithms = {
  'BFS': { fn: bfs, best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
  'DFS': { fn: dfs, best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
  'Dijkstra': { fn: dijkstra, best: 'O((V + E) log V)', avg: 'O((V + E) log V)', worst: 'O((V + E) log V)', space: 'O(V)' },
  'Topological Sort': { fn: topologicalSort, best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
  'Bellman-Ford': { fn: bellmanFord, best: 'O(E)', avg: 'O(V * E)', worst: 'O(V * E)', space: 'O(V)' },
  'A* Search': { fn: aStar, best: 'O(1)', avg: 'O(E)', worst: 'O(E)', space: 'O(V)' }
};

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mode, setMode] = useState('add_node'); // add_node, add_edge, delete
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Playback state
  const [snapshots, setSnapshots] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [selectedAlgo, setSelectedAlgo] = useState('BFS');
  const [startNodeId, setStartNodeId] = useState(null);
  const [isDirectedMode, setIsDirectedMode] = useState(false);
  const timerRef = useRef(null);

  // Dragging state
  const [draggedNode, setDraggedNode] = useState(null);
  const dragOccurred = useRef(false);

  // SVG interactions
  const handleSvgClick = (e) => {
    if (isPlaying) return;
    if (dragOccurred.current) {
      dragOccurred.current = false;
      return;
    }
    if (mode === 'add_node') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newNode = { id: Date.now().toString(), x, y, label: String.fromCharCode(65 + nodes.length) };
      setNodes([...nodes, newNode]);
      if (!startNodeId) setStartNodeId(newNode.id);
    }
  };

  const handleNodeMouseDown = (e, node) => {
    if (isPlaying) return;
    setDraggedNode(node.id);
    dragOccurred.current = false;
    e.stopPropagation();
  };

  const handleSvgMouseMove = (e) => {
    if (!draggedNode) return;
    dragOccurred.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNodes(nodes.map(n => n.id === draggedNode ? { ...n, x, y } : n));
  };

  const handleSvgMouseUp = () => {
    setDraggedNode(null);
  };

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    if (isPlaying || dragOccurred.current) {
      dragOccurred.current = false;
      return;
    }

    if (mode === 'add_edge') {
      if (!selectedNode) {
        setSelectedNode(node);
      } else {
        if (selectedNode.id !== node.id) {
          // Check if edge already exists
          const exists = edges.some(edge => 
            (edge.from === selectedNode.id && edge.to === node.id) || 
            (edge.from === node.id && edge.to === selectedNode.id)
          );
          if (!exists) {
            setEdges([...edges, { id: Date.now().toString(), from: selectedNode.id, to: node.id }]);
          }
        }
        setSelectedNode(null);
      }
    } else if (mode === 'delete') {
      setNodes(nodes.filter(n => n.id !== node.id));
      setEdges(edges.filter(edge => edge.from !== node.id && edge.to !== node.id));
      if (startNodeId === node.id) {
        setStartNodeId(nodes.length > 1 ? nodes.find(n => n.id !== node.id)?.id : null);
      }
    }
  };


  // Playback engine
  useEffect(() => {
    if (isPlaying && snapshots.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= snapshots.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed, snapshots]);

  const togglePlay = () => {
    if (!startNodeId && selectedAlgo !== 'Topological Sort') return alert('Add at least one node to start');
    
    if (snapshots.length === 0 || currentStep >= snapshots.length - 1) {
      const isDirected = isDirectedMode || selectedAlgo === 'Topological Sort';
      const targetNodeId = nodes.length > 1 ? nodes[nodes.length - 1].id : null;
      const snaps = algorithms[selectedAlgo].fn({ nodes, edges, directed: isDirected }, startNodeId, targetNodeId);
      setSnapshots(snaps);
      setCurrentStep(0);
      setTimeout(() => setIsPlaying(true), 50);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSnapshots([]);
  };

  const clearGraph = () => {
    reset();
    setNodes([]);
    setEdges([]);
    setStartNodeId(null);
    setSelectedNode(null);
  };

  // Current visual state
  const currentSnapshot = snapshots[currentStep] || { activeNode: null, visitedNodes: [], description: '' };
  const isDirected = isDirectedMode || selectedAlgo === 'Topological Sort';

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header / Controls */}
      <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap items-center justify-between shadow-sm z-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Graph Algorithms</h2>
          <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
            <select 
              value={selectedAlgo} 
              onChange={(e) => { setSelectedAlgo(e.target.value); reset(); }}
              className="bg-slate-100 border border-slate-200 rounded px-2 py-1 outline-none text-slate-700 font-medium"
              disabled={isPlaying}
            >
              {Object.keys(algorithms).map(algo => (
                <option key={algo} value={algo}>{algo}</option>
              ))}
            </select>
            <label className="flex items-center space-x-2 cursor-pointer text-slate-600 bg-slate-100 px-3 py-1 rounded border border-slate-200">
              <input 
                type="checkbox" 
                checked={isDirectedMode} 
                onChange={(e) => setIsDirectedMode(e.target.checked)} 
                disabled={isPlaying}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="font-medium">Directed Edges</span>
            </label>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                Best: {algorithms[selectedAlgo].best}
              </span>
              <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">
                Avg: {algorithms[selectedAlgo].avg}
              </span>
              <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100">
                Worst: {algorithms[selectedAlgo].worst}
              </span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                Space: {algorithms[selectedAlgo].space}
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setMode('add_node')}
            className={`p-2 rounded-md transition-colors ${mode === 'add_node' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
            title="Add Node"
            disabled={isPlaying}
          >
            <Plus size={20} />
          </button>
          <button 
            onClick={() => setMode('add_edge')}
            className={`p-2 rounded-md transition-colors ${mode === 'add_edge' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
            title="Add Edge"
            disabled={isPlaying}
          >
            <GitCommit size={20} />
          </button>
          <button 
            onClick={() => setMode('delete')}
            className={`p-2 rounded-md transition-colors ${mode === 'delete' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:bg-slate-200'}`}
            title="Delete Elements"
            disabled={isPlaying}
          >
            <Trash2 size={20} />
          </button>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex space-x-2">
            <button 
              onClick={clearGraph}
              disabled={isPlaying}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Clear Graph
            </button>
            <button 
              onClick={togglePlay}
              className={`px-6 py-2 flex items-center font-medium rounded-lg shadow-sm transition-colors ${
                isPlaying ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isPlaying ? (
                <><Pause size={18} className="mr-2" /> Pause</>
              ) : (
                <><Play size={18} className="mr-2" /> Play</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Graph Canvas */}
        <div className="flex-1 p-8 flex flex-col space-y-6 overflow-y-auto h-full relative">
          <div className="flex-1 min-h-[400px] w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-crosshair relative">
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col justify-center items-center text-slate-400 pointer-events-none text-center p-4">
                <p className="text-xl font-medium mb-2">Canvas is empty</p>
                <p className="text-sm">Click anywhere to add nodes. Select the "Add Edge" tool to connect them.</p>
                <p className="text-xs text-slate-400 mt-2">Click edges to customize their weight.</p>
              </div>
            )}
            <svg 
              className="w-full h-full" 
              onClick={handleSvgClick}
              onMouseMove={handleSvgMouseMove}
              onMouseUp={handleSvgMouseUp}
              onMouseLeave={handleSvgMouseUp}
            >
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
                </marker>
              </defs>
              {/* Edges */}
              {edges.map(edge => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;

                const handleEdgeClick = (e) => {
                  e.stopPropagation();
                  if (isPlaying) return;
                  if (mode === 'delete') {
                    setEdges(edges.filter(el => el.id !== edge.id));
                  } else {
                    const newWeight = prompt("Enter weight for this edge:", edge.weight || 1);
                    if (newWeight !== null) {
                      const parsed = parseInt(newWeight, 10);
                      setEdges(edges.map(el => el.id === edge.id ? { ...el, weight: isNaN(parsed) ? 1 : parsed } : el));
                    }
                  }
                };

                return (
                  <g key={edge.id} className="group cursor-pointer" onClick={handleEdgeClick}>
                    {/* Thicker invisible line to make hover and click easier */}
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="transparent"
                      strokeWidth="15"
                    />
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="#cbd5e1"
                      strokeWidth="3"
                      className="group-hover:stroke-blue-400 transition-colors"
                      markerEnd={isDirected ? "url(#arrow)" : ""}
                    />
                    {/* Weight badge background */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-10"
                        y="-10"
                        width="20"
                        height="20"
                        rx="10"
                        fill="#f8fafc"
                        stroke="#cbd5e1"
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        dy=".3em"
                        fill="#475569"
                        fontSize="10px"
                        fontWeight="bold"
                        className="select-none"
                      >
                        {edge.weight || 1}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map(node => {
                const isStart = node.id === startNodeId;
                const isVisited = currentSnapshot.visitedNodes.includes(node.id);
                const isActive = currentSnapshot.activeNode === node.id;
                const isSelected = selectedNode?.id === node.id;

                let fillColor = '#ffffff';
                let strokeColor = '#3b82f6';

                if (isActive) {
                  fillColor = '#fbbf24'; // amber-400
                  strokeColor = '#b45309';
                } else if (isVisited) {
                  fillColor = '#dbeafe'; // blue-100
                  strokeColor = '#3b82f6';
                } else if (isSelected) {
                  fillColor = '#f1f5f9'; // slate-100
                  strokeColor = '#0ea5e9'; // sky-500
                }

                return (
                  <g 
                    key={node.id} 
                    onClick={(e) => handleNodeClick(e, node)} 
                    onMouseDown={(e) => handleNodeMouseDown(e, node)}
                    style={{ cursor: 'grab' }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="20"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? "4" : "3"}
                      className="transition-colors duration-200"
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dy=".3em"
                      fill="#1e293b"
                      fontSize="14px"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {node.label}
                    </text>
                    {isStart && !isPlaying && currentStep === 0 && (
                      <text
                        x={node.x}
                        y={node.y - 30}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="12px"
                        className="pointer-events-none select-none"
                      >
                        Start
                      </text>
                    )}
                    {currentSnapshot.distances && currentSnapshot.distances[node.id] !== undefined && (
                      <text
                        x={node.x + 25}
                        y={node.y - 25}
                        fill="#10b981"
                        fontSize="14px"
                        fontWeight="bold"
                        className="pointer-events-none select-none bg-white"
                      >
                        d: {currentSnapshot.distances[node.id] === Infinity ? '∞' : currentSnapshot.distances[node.id]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            
            {/* Floating Info Overlay (Simplified) */}
            {currentSnapshot.description && (
              <div className="absolute top-4 left-4 bg-white/95 p-4 rounded-xl shadow-lg border border-slate-200 max-w-sm backdrop-blur-sm z-20 pointer-events-none">
                <p className="text-slate-700 font-medium">{currentSnapshot.description}</p>
              </div>
            )}
          </div>
          <AlgorithmInfoCard selectedAlgo={selectedAlgo} />
        </div>

        {/* Right Side: Live Output Panel */}
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-md z-10">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800">Live Execution Output</h3>
            <p className="text-xs text-slate-500">Live traversal order & algorithm results</p>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Current Step / Description */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Current Action</span>
              <p className="text-sm text-slate-700 mt-1 font-medium">
                {currentSnapshot.description || "Click Play to begin visualization."}
              </p>
            </div>

            {/* Cycle Detection Warning */}
            {currentSnapshot.cycleDetected && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex flex-col space-y-1 animate-pulse">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Cycle Warning</span>
                <p className="text-sm text-rose-800 font-semibold flex items-center">
                  ⚠️ Cycle Detected in Graph!
                </p>
                <p className="text-xs text-rose-600">
                  {selectedAlgo === 'Topological Sort' 
                    ? "A cycle exists. A valid topological ordering is impossible." 
                    : "Back-edge/cross-edge visited an active or already visited ancestor."}
                </p>
              </div>
            )}


            {/* Traversal Order for BFS, DFS, Topological Sort */}
            {(selectedAlgo === 'BFS' || selectedAlgo === 'DFS' || selectedAlgo === 'Topological Sort') && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {selectedAlgo === 'Topological Sort' ? 'Topological Order' : 'Traversals by Component'}
                </span>
                
                {selectedAlgo === 'Topological Sort' ? (
                  <div className="flex flex-wrap gap-1 items-center">
                    {(() => {
                      const list = currentSnapshot.ordering || [];
                      if (list.length === 0) return <span className="text-sm text-slate-400 italic">Empty</span>;
                      return list.map((nodeId, idx) => {
                        const n = nodes.find(node => node.id === nodeId);
                        return (
                          <div key={idx} className="flex items-center">
                            <span className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-sm font-bold shadow-sm">
                              {n ? n.label : nodeId}
                            </span>
                            {idx < list.length - 1 && <span className="text-slate-400 mx-1 text-xs">→</span>}
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      const comps = currentSnapshot.componentsTraversal || [];
                      if (comps.length === 0) return <span className="text-sm text-slate-400 italic">No traversal started</span>;
                      return comps.map((list, compIdx) => (
                        <div key={compIdx} className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Component {compIdx + 1}
                          </span>
                          <div className="flex flex-wrap gap-1 items-center">
                            {list.length === 0 ? (
                              <span className="text-xs text-slate-400 italic">Empty</span>
                            ) : (
                              list.map((nodeId, idx) => {
                                const n = nodes.find(node => node.id === nodeId);
                                return (
                                  <div key={idx} className="flex items-center">
                                    <span className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-sm font-bold shadow-sm">
                                      {n ? n.label : nodeId}
                                    </span>
                                    {idx < list.length - 1 && <span className="text-slate-400 mx-1 text-xs">→</span>}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Dijkstra, Bellman-Ford, A* Distances */}
            {(selectedAlgo === 'Dijkstra' || selectedAlgo === 'Bellman-Ford' || selectedAlgo === 'A* Search') && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Distance Table</span>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-xs">
                      <tr>
                        <th className="p-2">Node</th>
                        <th className="p-2">Distance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {nodes.map(node => {
                        const dist = currentSnapshot.distances ? currentSnapshot.distances[node.id] : undefined;
                        const isStart = node.id === startNodeId;
                        return (
                          <tr key={node.id} className={node.id === currentSnapshot.activeNode ? "bg-amber-50" : ""}>
                            <td className="p-2 font-bold text-slate-700">
                              {node.label} {isStart && <span className="text-xs text-blue-500 font-normal">(Start)</span>}
                            </td>
                            <td className="p-2 font-mono">
                              {dist === undefined ? '-' : dist === Infinity ? '∞' : dist}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Disjoint components visited ratio */}
            {(selectedAlgo === 'BFS' || selectedAlgo === 'DFS') && snapshots.length > 0 && (
              <div className="space-y-1 border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Coverage Status</span>
                <div className="text-xs space-y-1 mt-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Visited Nodes:</span>
                    <span className="font-bold text-slate-800">
                      {currentSnapshot.visitedNodes ? currentSnapshot.visitedNodes.length : 0} / {nodes.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${nodes.length > 0 ? ((currentSnapshot.visitedNodes ? currentSnapshot.visitedNodes.length : 0) / nodes.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CodeEditorPanel selectedAlgo={selectedAlgo} />
    </div>
  );
};

export default GraphVisualizer;

