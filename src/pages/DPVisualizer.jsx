import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { knapsackDP, floydWarshall } from '../algorithms/dp';
import CodeEditorPanel from '../components/CodeEditorPanel';

const algorithms = {
  'Knapsack 0/1': { best: 'O(n * W)', avg: 'O(n * W)', worst: 'O(n * W)', space: 'O(n * W)' },
  'Floyd-Warshall': { best: 'O(V³)', avg: 'O(V³)', worst: 'O(V³)', space: 'O(V²)' }
};

const DPVisualizer = () => {
  const [selectedAlgo, setSelectedAlgo] = useState('Knapsack 0/1');
  
  // Knapsack state
  const [items, setItems] = useState([]);
  const [capacity, setCapacity] = useState(10);
  
  // Floyd-Warshall state
  const [graphMatrix, setGraphMatrix] = useState([]);

  const [snapshots, setSnapshots] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // ms per step
  
  const [inputMode, setInputMode] = useState('Random');

  const timerRef = useRef(null);

  useEffect(() => {
    generateNewData();
  }, [selectedAlgo]);

  useEffect(() => {
    if ((selectedAlgo === 'Knapsack 0/1' && items.length > 0) || 
        (selectedAlgo === 'Floyd-Warshall' && graphMatrix.length > 0)) {
      resetAndPrepare();
    }
  }, [items, capacity, graphMatrix, selectedAlgo]);

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
      if (selectedAlgo === 'Knapsack 0/1') {
        const newItems = [];
        const numItems = Math.floor(Math.random() * 2) + 4; // 4 to 5 items
        for (let i = 0; i < numItems; i++) {
          newItems.push({
            id: i + 1,
            weight: Math.floor(Math.random() * 5) + 1,
            value: Math.floor(Math.random() * 20) + 10
          });
        }
        setCapacity(Math.floor(Math.random() * 5) + 8);
        setItems(newItems);
      } else {
        const n = 5;
        const matrix = Array(n).fill(0).map(() => Array(n).fill(Infinity));
        for (let i = 0; i < n; i++) {
          matrix[i][i] = 0;
          for (let j = 0; j < n; j++) {
            if (i !== j && Math.random() > 0.4) {
              matrix[i][j] = Math.floor(Math.random() * 10) + 1;
            }
          }
        }
        setGraphMatrix(matrix);
      }
    }
  };

  const handleMatrixChange = (r, c, val) => {
    const newMatrix = [...graphMatrix.map(row => [...row])];
    if (val === '') {
      newMatrix[r][c] = Infinity;
    } else {
      newMatrix[r][c] = parseInt(val) || 0;
    }
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
    if (selectedAlgo === 'Knapsack 0/1') {
      snaps = knapsackDP(items, capacity);
    } else {
      snaps = floydWarshall(graphMatrix);
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

  const currentSnapshot = snapshots[currentStep] || { dp: [], description: '', activeCell: null, highlightCells: [] };
  const { dp, description, activeCell, highlightCells } = currentSnapshot;

  const isHighlighted = (r, c) => {
    return highlightCells?.some(cell => cell.r === r && cell.c === c);
  };

  const isActive = (r, c) => {
    return activeCell?.r === r && activeCell?.c === c;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header / Controls */}
      <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap items-center justify-between shadow-sm z-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dynamic Programming</h2>
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
              min="100" 
              max="2000" 
              step="100"
              value={2100 - speed}
              onChange={(e) => setSpeed(2100 - e.target.value)}
              className="w-24 accent-blue-600"
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

      {/* Main Visualization Area */}
      <div className="flex-1 p-6 flex flex-col overflow-auto relative">
        
        {/* Manual Data Builder Overlay */}
        {inputMode === 'Manual' && !isPlaying && currentStep === 0 && (
          <div className="absolute inset-0 bg-white/95 z-30 p-8 overflow-auto backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Manual Data Builder: {selectedAlgo}</h3>
            
            {selectedAlgo === 'Knapsack 0/1' ? (
              <div className="max-w-2xl">
                <div className="flex items-center space-x-4 mb-6 bg-slate-100 p-4 rounded-lg">
                  <label className="font-medium text-slate-700">Total Sack Capacity:</label>
                  <input 
                    type="number" 
                    value={capacity} 
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border border-slate-300 rounded focus:outline-blue-500"
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
                <button onClick={addKnapsackItem} className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200">+ Add New Item</button>
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
                    className="w-24 px-3 py-2 border border-slate-300 rounded focus:outline-blue-500"
                  />
                  <span className="text-sm text-slate-500 ml-4">(Leave cell blank for ∞)</span>
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
                                className="w-16 h-10 text-center outline-none focus:bg-blue-50 disabled:bg-slate-100"
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
               <button onClick={togglePlay} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm flex items-center">
                 <Play className="mr-2" /> Start Algorithm
               </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left panel: Items (Only for Knapsack) */}
          {selectedAlgo === 'Knapsack 0/1' && (
            <div className="w-full lg:w-64 bg-white p-4 rounded-xl shadow-sm border border-slate-200 shrink-0">
              <h3 className="font-bold text-slate-800 mb-3 border-b pb-2">Items (Capacity: {capacity})</h3>
              <ul className="space-y-2">
                {items.map((item, idx) => (
                  <li key={item.id} className={`p-3 rounded border flex justify-between items-center ${activeCell?.r === idx + 1 ? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="font-semibold text-slate-700">Item {item.id}</span>
                    <div className="text-sm text-slate-600 text-right">
                      <div>W: <span className="font-mono font-medium">{item.weight}</span></div>
                      <div>V: <span className="font-mono font-medium text-emerald-600">${item.value}</span></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Right panel: DP Table */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-auto flex flex-col">
            <div className="mb-4 bg-slate-100 p-3 rounded-lg border border-slate-200 text-slate-700 min-h-[4rem] flex items-center">
              <p className="font-medium text-lg">{description || 'Click play to start the visualization.'}</p>
            </div>
            
            <div className="flex-1 overflow-auto flex justify-center items-start pt-4">
              <table className="border-collapse border border-slate-300 text-center shadow-sm">
                <thead>
                  {selectedAlgo === 'Knapsack 0/1' ? (
                    <tr>
                      <th className="border border-slate-300 p-3 bg-slate-100 text-slate-600">i \ w</th>
                      {Array.from({ length: capacity + 1 }).map((_, w) => (
                        <th key={w} className="border border-slate-300 p-3 bg-slate-100 text-slate-600 w-12">{w}</th>
                      ))}
                    </tr>
                  ) : (
                    <tr>
                      <th className="border border-slate-300 p-3 bg-slate-100 text-slate-600">From \ To</th>
                      {graphMatrix.map((_, idx) => (
                        <th key={idx} className="border border-slate-300 p-3 bg-slate-100 text-slate-600 w-16">Node {idx}</th>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {(dp || []).map((row, i) => (
                    <tr key={i}>
                      <td className="border border-slate-300 p-3 bg-slate-100 font-medium text-slate-600 whitespace-nowrap">
                        {selectedAlgo === 'Knapsack 0/1' ? (i === 0 ? '0' : `Item ${i}`) : `Node ${i}`}
                      </td>
                      {row.map((val, j) => {
                        let cellClass = "border border-slate-300 p-3 transition-colors duration-200 w-12 h-12";
                        if (isActive(i, j)) {
                          cellClass += " bg-blue-500 text-white font-bold transform scale-105 shadow-md relative z-10";
                        } else if (isHighlighted(i, j)) {
                          cellClass += " bg-amber-200 text-amber-900 font-bold";
                        } else if (val === Infinity) {
                          cellClass += " text-slate-400 bg-slate-50";
                        } else if (val > 0) {
                          cellClass += " text-slate-800";
                        } else {
                          cellClass += " text-slate-400";
                        }
                        
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
        </div>
      </div>
      <CodeEditorPanel selectedAlgo={selectedAlgo} />
    </div>
  );
};

export default DPVisualizer;
