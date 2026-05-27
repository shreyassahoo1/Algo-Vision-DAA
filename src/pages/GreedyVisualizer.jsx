import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { fractionalKnapsack, primsMST, kruskalsMST } from '../algorithms/greedy';
import CodeEditorPanel from '../components/CodeEditorPanel';

const algorithms = {
  'Fractional Knapsack': { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  "Prim's MST": { best: 'O(E log V)', avg: 'O(E log V)', worst: 'O(V²)', space: 'O(V)' },
  "Kruskal's MST": { best: 'O(E log E)', avg: 'O(E log E)', worst: 'O(E log E)', space: 'O(V)' }
};

const GreedyVisualizer = () => {
  const [selectedAlgo, setSelectedAlgo] = useState('Fractional Knapsack');

  // Fractional Knapsack state
  const [items, setItems] = useState([]);
  const [initialCapacity, setInitialCapacity] = useState(20);

  // Prim's state
  const [graphMatrix, setGraphMatrix] = useState([]);

  // Shared playback state
  const [snapshots, setSnapshots] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms per step
  
  const [inputMode, setInputMode] = useState('Random');

  const timerRef = useRef(null);

  useEffect(() => {
    generateNewData();
  }, [selectedAlgo]);

  useEffect(() => {
    if ((selectedAlgo === 'Fractional Knapsack' && items.length > 0) || 
        (selectedAlgo !== 'Fractional Knapsack' && graphMatrix.length > 0)) {
      resetAndPrepare();
    }
  }, [items, initialCapacity, graphMatrix, selectedAlgo]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
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

  const generateNewData = () => {
    if (inputMode === 'Random') {
      if (selectedAlgo === 'Fractional Knapsack') {
        const newItems = [];
        const numItems = Math.floor(Math.random() * 3) + 4; // 4 to 6 items
        for (let i = 0; i < numItems; i++) {
          newItems.push({
            id: i + 1,
            weight: Math.floor(Math.random() * 8) + 2,
            value: Math.floor(Math.random() * 30) + 10
          });
        }
        setInitialCapacity(Math.floor(Math.random() * 10) + 15);
        setItems(newItems);
      } else {
        const n = 5;
        const matrix = Array(n).fill(0).map(() => Array(n).fill(Infinity));
        for (let i = 0; i < n; i++) {
          matrix[i][i] = 0;
          for (let j = i + 1; j < n; j++) {
            if (Math.random() > 0.4) {
              const weight = Math.floor(Math.random() * 10) + 1;
              matrix[i][j] = weight;
              matrix[j][i] = weight; // undirected graph
            }
          }
        }
        for (let i = 0; i < n - 1; i++) {
           if (matrix[i][i+1] === Infinity) {
               const weight = Math.floor(Math.random() * 20) + 1;
               matrix[i][i+1] = weight;
               matrix[i+1][i] = weight;
           }
        }
        setGraphMatrix(matrix);
      }
    }
  };

  const handleMatrixChange = (r, c, val) => {
    const newMatrix = [...graphMatrix.map(row => [...row])];
    let numVal = Infinity;
    if (val !== '') {
      numVal = parseInt(val) || 0;
    }
    newMatrix[r][c] = numVal;
    newMatrix[c][r] = numVal; // enforce symmetry for MST (undirected)
    setGraphMatrix(newMatrix);
  };

  const changeGraphNodes = (n) => {
    if (n < 2 || n > 10) return;
    const matrix = Array(n).fill(0).map(() => Array(n).fill(Infinity));
    for (let i=0; i<n; i++) matrix[i][i] = 0;
    setGraphMatrix(matrix);
  };

  const addKnapsackItem = () => {
    setItems([...items, { id: items.length + 1, weight: 1, value: 10 }]);
  };

  const updateKnapsackItem = (idx, field, val) => {
    const newItems = [...items];
    newItems[idx][field] = parseInt(val) || 0;
    setItems(newItems);
  };

  const removeKnapsackItem = (idx) => {
    const newItems = items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, id: i + 1 }));
    setItems(newItems);
  };

  const resetAndPrepare = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    let snaps = [];
    if (selectedAlgo === 'Fractional Knapsack') {
      snaps = fractionalKnapsack(items, initialCapacity);
    } else if (selectedAlgo === "Prim's MST") {
      snaps = primsMST(graphMatrix);
    } else {
      snaps = kruskalsMST(graphMatrix);
    }
    setSnapshots(snaps);
  };

  const togglePlay = () => {
    if (currentStep >= snapshots.length - 1) {
      resetAndPrepare();
      setTimeout(() => setIsPlaying(true), 50);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const currentSnapshot = snapshots[currentStep] || {};

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header / Controls */}
      <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap items-center justify-between shadow-sm z-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Greedy Algorithms</h2>
          <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
            <select 
              value={selectedAlgo} 
              onChange={(e) => setSelectedAlgo(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded px-2 py-1 outline-none text-slate-700 font-medium"
              disabled={isPlaying}
            >
              {Object.keys(algorithms).map(algo => (
                <option key={algo} value={algo}>{algo}</option>
              ))}
            </select>
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
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-600">Speed</span>
            <input 
              type="range" 
              min="200" 
              max="3000" 
              step="200"
              value={3200 - speed}
              onChange={(e) => setSpeed(3200 - e.target.value)}
              className="w-24 accent-emerald-600"
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="flex bg-slate-100 p-1 rounded-lg mr-2">
              <button
                onClick={() => setInputMode('Random')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${inputMode === 'Random' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                disabled={isPlaying}
              >
                Random
              </button>
              <button
                onClick={() => setInputMode('Manual')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${inputMode === 'Manual' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                disabled={isPlaying}
              >
                Manual
              </button>
            </div>
            
            {inputMode === 'Manual' ? (
              <div className="flex space-x-2">
                <button 
                  onClick={resetAndPrepare}
                  disabled={isPlaying}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Apply Data
                </button>
              </div>
            ) : (
              <button 
                onClick={generateNewData}
                disabled={isPlaying}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
                title="Generate New Data"
              >
                <RotateCcw size={18} className="mr-2" />
                New Data
              </button>
            )}
            <button 
              onClick={togglePlay}
              className={`px-6 py-2 flex items-center font-medium rounded-lg shadow-sm transition-colors ${
                isPlaying ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
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

      {/* Main Visualization Area */}
      <div className="flex-1 p-6 flex flex-col overflow-auto relative">
        
        {/* Manual Data Builder Overlay */}
        {inputMode === 'Manual' && !isPlaying && currentStep === 0 && (
          <div className="absolute inset-0 bg-white/95 z-30 p-8 overflow-auto backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Manual Data Builder: {selectedAlgo}</h3>
            
            {selectedAlgo === 'Fractional Knapsack' ? (
              <div className="max-w-2xl">
                <div className="flex items-center space-x-4 mb-6 bg-slate-100 p-4 rounded-lg">
                  <label className="font-medium text-slate-700">Total Sack Capacity:</label>
                  <input 
                    type="number" 
                    value={initialCapacity} 
                    onChange={(e) => setInitialCapacity(parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border border-slate-300 rounded focus:outline-emerald-500"
                  />
                </div>
                
                <div className="space-y-3 mb-6">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex items-center space-x-4 bg-slate-50 p-3 rounded border border-slate-200">
                      <span className="font-bold text-slate-500 w-16">Item {it.id}</span>
                      <label className="text-sm">Weight:</label>
                      <input type="number" value={it.weight} onChange={(e) => updateKnapsackItem(idx, 'weight', e.target.value)} className="w-20 px-2 py-1 border rounded" />
                      <label className="text-sm">Value:</label>
                      <input type="number" value={it.value} onChange={(e) => updateKnapsackItem(idx, 'value', e.target.value)} className="w-20 px-2 py-1 border rounded" />
                      <button onClick={() => removeKnapsackItem(idx)} className="text-red-500 hover:text-red-700 ml-auto">Remove</button>
                    </div>
                  ))}
                </div>
                <button onClick={addKnapsackItem} className="px-4 py-2 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200">+ Add New Item</button>
              </div>
            ) : (
              <div className="max-w-4xl">
                <div className="flex items-center space-x-4 mb-6 bg-slate-100 p-4 rounded-lg">
                  <label className="font-medium text-slate-700">Number of Nodes (V):</label>
                  <input 
                    type="number" 
                    value={graphMatrix.length} 
                    onChange={(e) => changeGraphNodes(parseInt(e.target.value) || 0)}
                    min="2" max="10"
                    className="w-24 px-3 py-2 border border-slate-300 rounded focus:outline-emerald-500"
                  />
                  <span className="text-sm text-slate-500 ml-4">(Leave cell blank for ∞. Matrix is symmetric.)</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 border border-slate-300 bg-slate-100">To ➔<br/>From ⬇</th>
                        {graphMatrix.map((_, i) => <th key={i} className="p-2 border border-slate-300 bg-slate-50 w-16 text-center">{i}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {graphMatrix.map((row, r) => (
                        <tr key={r}>
                          <th className="p-2 border border-slate-300 bg-slate-50 text-center">{r}</th>
                          {row.map((val, c) => (
                            <td key={c} className="p-0 border border-slate-300 relative">
                              <input 
                                type="text"
                                value={val === Infinity ? '' : val}
                                onChange={(e) => handleMatrixChange(r, c, e.target.value)}
                                disabled={r === c}
                                placeholder={r === c ? '0' : '∞'}
                                className={`w-16 h-10 text-center outline-none disabled:bg-slate-100 ${c < r ? 'bg-slate-50 text-slate-500' : 'focus:bg-emerald-50'}`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-200">
               <button onClick={togglePlay} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm flex items-center">
                 <Play className="mr-2" /> Start Algorithm
               </button>
            </div>
          </div>
        )}

        <div className="mb-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-slate-700 min-h-[4rem] flex items-center">
          <p className="font-medium text-lg">{currentSnapshot.description || 'Click play to start the visualization.'}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-full">
          
          {selectedAlgo === 'Fractional Knapsack' ? (
            <>
              {/* Left panel: Items List */}
              <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Available Items</h3>
                <div className="space-y-4">
                  {(currentSnapshot.items || []).map((item, idx) => {
                    const isActive = currentSnapshot.activeItemIdx === idx;
                    const isHighlighted = currentSnapshot.highlightItemIdx === idx;
                    
                    let cardClass = "p-4 rounded-lg border-2 transition-all duration-300 flex justify-between items-center ";
                    if (isActive) cardClass += "border-amber-400 bg-amber-50 transform scale-[1.02] shadow-md";
                    else if (isHighlighted || item.taken > 0) cardClass += "border-emerald-400 bg-emerald-50 opacity-80";
                    else cardClass += "border-slate-200 bg-slate-50";

                    return (
                      <div key={item.id} className={cardClass}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${item.taken > 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                            #{item.id}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">Weight: {item.weight} | Value: ${item.value}</div>
                            <div className="text-sm text-slate-500 font-mono mt-1">Ratio: {item.ratio?.toFixed(2) || (item.value/item.weight).toFixed(2)} $/W</div>
                          </div>
                        </div>
                        {item.taken > 0 && (
                          <div className="text-right">
                            <div className="text-emerald-600 font-bold">{(item.taken * 100).toFixed(0)}% taken</div>
                            <div className="text-sm text-emerald-800">+${(item.value * item.taken).toFixed(2)}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right panel: Knapsack Status */}
              <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Knapsack Status</h3>
                
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="w-full max-w-sm">
                    <div className="flex justify-between mb-2 text-sm font-bold text-slate-600">
                      <span>Capacity Used: {initialCapacity - (currentSnapshot.capacity ?? initialCapacity)} / {initialCapacity}</span>
                      <span className="text-emerald-600">Total Value: ${(currentSnapshot.totalValue ?? 0).toFixed(2)}</span>
                    </div>
                    
                    <div className="w-full h-12 bg-slate-100 border-2 border-slate-300 rounded-lg overflow-hidden flex relative">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                        style={{ width: `${((initialCapacity - (currentSnapshot.capacity ?? initialCapacity)) / initialCapacity) * 100}%` }}
                      >
                        <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="font-semibold text-slate-700 mb-2">Items inside:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(!currentSnapshot.items || currentSnapshot.items.filter(item => item.taken > 0).length === 0) ? (
                          <span className="text-slate-400 italic">Empty</span>
                        ) : (
                          currentSnapshot.items.filter(item => item.taken > 0).map(item => (
                            <div key={item.id} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium border border-emerald-300">
                              Item {item.id} ({(item.taken * 100).toFixed(0)}%)
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // MST Visualization (Prim's or Kruskal's)
            <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-6">
              
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Graph Adjacency Matrix</h3>
                <div className="overflow-auto">
                  <table className="border-collapse border border-slate-300 text-center shadow-sm w-full">
                    <thead>
                      <tr>
                        <th className="border border-slate-300 p-2 bg-slate-100 text-slate-600"></th>
                        {graphMatrix.map((_, idx) => (
                          <th key={idx} className="border border-slate-300 p-2 bg-slate-100 text-slate-600 w-12">N{idx}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {graphMatrix.map((row, i) => (
                        <tr key={i}>
                          <th className="border border-slate-300 p-2 bg-slate-100 text-slate-600">N{i}</th>
                          {row.map((val, j) => {
                            const isMSTEdge = currentSnapshot.mstEdges?.some(e => (e.u === i && e.v === j) || (e.u === j && e.v === i));
                            let isActive = false;
                            let isRejected = false;

                            if (selectedAlgo === "Prim's MST") {
                              isActive = currentSnapshot.activeNode === i || currentSnapshot.activeNode === j;
                            } else {
                              isActive = currentSnapshot.activeEdge?.u === i && currentSnapshot.activeEdge?.v === j || currentSnapshot.activeEdge?.u === j && currentSnapshot.activeEdge?.v === i;
                              isRejected = isActive && currentSnapshot.status === 'rejected';
                            }
                            
                            let cellClass = "border border-slate-300 p-2 font-medium ";
                            if (isMSTEdge) cellClass += "bg-emerald-500 text-white font-bold";
                            else if (val === Infinity) cellClass += "text-slate-400 bg-slate-50";
                            else if (isRejected) cellClass += "bg-red-400 text-white";
                            else if (isActive) cellClass += "bg-amber-100 text-amber-900";
                            else cellClass += "text-slate-700";

                            return (
                              <td key={j} className={cellClass}>
                                {val === Infinity ? '∞' : val}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedAlgo === "Prim's MST" ? (
                <div className="w-full lg:w-64 shrink-0">
                  <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Node Status (Key Array)</h3>
                  <div className="space-y-2">
                    {(currentSnapshot.key || []).map((keyVal, idx) => {
                      const inMST = currentSnapshot.inMST?.[idx];
                      const isActive = currentSnapshot.activeNode === idx;
                      
                      let rowClass = "p-3 rounded-lg border flex justify-between items-center ";
                      if (inMST) rowClass += "bg-emerald-50 border-emerald-300";
                      else if (isActive) rowClass += "bg-amber-100 border-amber-400";
                      else rowClass += "bg-slate-50 border-slate-200";

                      return (
                        <div key={idx} className={rowClass}>
                          <div className="flex items-center space-x-2">
                            <span className={`w-3 h-3 rounded-full ${inMST ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                            <span className="font-bold text-slate-700">Node {idx}</span>
                          </div>
                          <span className="font-mono font-bold text-slate-800">
                            {keyVal === Infinity ? '∞' : keyVal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="w-full lg:w-64 shrink-0">
                  <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Active Edge Evaluation</h3>
                  {currentSnapshot.activeEdge ? (
                    <div className="p-4 rounded-lg border-2 border-slate-300 bg-slate-50 flex flex-col items-center">
                      <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-2">Current Edge</div>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">N{currentSnapshot.activeEdge.u}</div>
                        <div className="h-1 w-8 bg-slate-300"></div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">N{currentSnapshot.activeEdge.v}</div>
                      </div>
                      <div className="font-mono text-lg font-bold text-slate-800 mb-4">Weight: {currentSnapshot.activeEdge.weight}</div>
                      
                      {currentSnapshot.status === 'accepted' && (
                        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-bold w-full text-center">ACCEPTED</div>
                      )}
                      {currentSnapshot.status === 'rejected' && (
                        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold w-full text-center">REJECTED (CYCLE)</div>
                      )}
                      {currentSnapshot.status === 'evaluating' && (
                        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold w-full text-center">CHECKING CYCLE...</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 italic mt-8">Waiting for evaluation...</div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
      <CodeEditorPanel selectedAlgo={selectedAlgo} />
    </div>
  );
};

export default GreedyVisualizer;
