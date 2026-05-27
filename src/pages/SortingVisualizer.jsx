import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Settings2 } from 'lucide-react';
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort } from '../algorithms/sorting';
import CodeEditorPanel from '../components/CodeEditorPanel';

const algorithms = {
  'Bubble Sort': { fn: bubbleSort, best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  'Selection Sort': { fn: selectionSort, best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  'Insertion Sort': { fn: insertionSort, best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  'Merge Sort': { fn: mergeSort, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  'Quick Sort': { fn: quickSort, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' }
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [initialArray, setInitialArray] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50); // ms per step
  const [selectedAlgo, setSelectedAlgo] = useState('Bubble Sort');
  const [activeIndices, setActiveIndices] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  
  const [inputMode, setInputMode] = useState('Random');
  const [manualInput, setManualInput] = useState('');

  const timerRef = useRef(null);

  useEffect(() => {
    generateNewArray();
  }, []);

  useEffect(() => {
    // Generate new snapshots when algorithm changes
    if (initialArray.length > 0) {
      resetAndPrepare();
    }
  }, [selectedAlgo, initialArray]);

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

  useEffect(() => {
    if (snapshots.length > 0 && currentStep < snapshots.length) {
      const currentSnapshot = snapshots[currentStep];
      setArray(currentSnapshot.array);
      setActiveIndices(currentSnapshot.activeIndices || []);
      setComparisons(currentSnapshot.comparisons || 0);
    }
  }, [currentStep, snapshots]);

  const generateNewArray = () => {
    if (inputMode === 'Random') {
      const newArray = [];
      for (let i = 0; i < 40; i++) {
        newArray.push(Math.floor(Math.random() * 90) + 10);
      }
      setInitialArray([...newArray]);
    }
  };

  const addManualData = () => {
    const parsed = manualInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      setInitialArray(prev => [...prev, ...parsed]);
      setManualInput('');
    }
  };

  const removeLastData = () => {
    setInitialArray(prev => prev.slice(0, prev.length - 1));
  };

  const clearManualData = () => {
    setInitialArray([]);
  };

  const resetAndPrepare = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setArray([...initialArray]);
    setComparisons(0);
    setActiveIndices([]);
    const snaps = algorithms[selectedAlgo].fn([...initialArray]);
    setSnapshots(snaps);
  };

  const togglePlay = () => {
    if (currentStep >= snapshots.length - 1) {
      resetAndPrepare();
      // Wait a tick before playing to allow state to reset
      setTimeout(() => setIsPlaying(true), 50);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header / Controls */}
      <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap items-center justify-between shadow-sm z-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sorting Algorithms</h2>
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
              min="10" 
              max="500" 
              step="10"
              value={510 - speed} // Invert slider so right = faster
              onChange={(e) => setSpeed(510 - e.target.value)}
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
                <input 
                  type="text" 
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && manualInput && !isPlaying && addManualData()}
                  placeholder="e.g. 50, 20"
                  disabled={isPlaying}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={addManualData}
                  disabled={isPlaying || !manualInput}
                  className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                  title="Add"
                >
                  Add
                </button>
                <button 
                  onClick={removeLastData}
                  disabled={isPlaying || initialArray.length === 0}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                  title="Remove Last"
                >
                  Undo
                </button>
                <button 
                  onClick={clearManualData}
                  disabled={isPlaying || initialArray.length === 0}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                  title="Clear All"
                >
                  Clear
                </button>
              </div>
            ) : (
              <button 
                onClick={generateNewArray}
                disabled={isPlaying}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
                title="Generate New Array"
              >
                <RotateCcw size={18} className="mr-2" />
                New Array
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
      <div className="flex-1 p-8 flex flex-col justify-end relative">
        <div className="absolute top-4 left-8 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600 font-medium">Comparisons: <span className="text-blue-600 text-lg">{comparisons}</span></p>
        </div>
        
        <div className="flex items-end justify-center space-x-1 h-full w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 pb-0">
          {array.map((val, idx) => {
            const isActive = activeIndices.includes(idx);
            return (
              <div
                key={idx}
                style={{ height: `${val}%` }}
                className={`w-full max-w-[24px] rounded-t-sm transition-all duration-100 ${
                  isActive ? 'bg-amber-400' : 'bg-blue-500'
                }`}
              ></div>
            );
          })}
        </div>
      </div>
      <CodeEditorPanel selectedAlgo={selectedAlgo} />
    </div>
  );
};

export default SortingVisualizer;
