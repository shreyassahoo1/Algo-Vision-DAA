import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort } from '../algorithms/sorting';
import CodeEditorPanel from '../components/CodeEditorPanel';

const algorithms = {
  'Bubble Sort': { fn: bubbleSort, complexity: 'O(n²)' },
  'Selection Sort': { fn: selectionSort, complexity: 'O(n²)' },
  'Insertion Sort': { fn: insertionSort, complexity: 'O(n²)' },
  'Merge Sort': { fn: mergeSort, complexity: 'O(n log n)' },
  'Quick Sort': { fn: quickSort, complexity: 'O(n log n)' }
};

const ArrayVisualizer = ({ array, activeIndices, isComplete, title, complexity, comparisons }) => (
  <div className="flex-1 flex flex-col items-center bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
    <div className="w-full flex justify-between items-center mb-6 border-b pb-4">
      <div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded mt-1 inline-block">{complexity}</span>
      </div>
      <div className="text-right">
        <div className="text-sm text-slate-500">Comparisons</div>
        <div className="text-2xl font-bold text-blue-600">{comparisons}</div>
      </div>
    </div>
    
    <div className="flex-1 w-full flex items-end justify-center space-x-1 relative">
      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 backdrop-blur-[1px]">
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform -translate-y-4">
            Finished
          </div>
        </div>
      )}
      {array.map((val, idx) => {
        const isActive = activeIndices.includes(idx);
        return (
          <div
            key={idx}
            style={{ height: `${val}%` }}
            className={`w-full max-w-[12px] rounded-t-sm transition-all duration-75 ${
              isComplete ? 'bg-emerald-400' : isActive ? 'bg-amber-400' : 'bg-blue-500'
            }`}
          ></div>
        );
      })}
    </div>
  </div>
);

const ComparisonVisualizer = () => {
  const [initialArray, setInitialArray] = useState([]);
  
  const [algo1, setAlgo1] = useState('Bubble Sort');
  const [algo2, setAlgo2] = useState('Quick Sort');
  
  const [snaps1, setSnaps1] = useState([]);
  const [snaps2, setSnaps2] = useState([]);
  
  const [step1, setStep1] = useState(0);
  const [step2, setStep2] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(20); // ms per tick
  
  const [inputMode, setInputMode] = useState('Random');
  const [manualInput, setManualInput] = useState('');

  const timerRef = useRef(null);

  useEffect(() => {
    generateNewArray();
  }, []);

  useEffect(() => {
    if (initialArray.length > 0) {
      resetAndPrepare();
    }
  }, [initialArray, algo1, algo2]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        let done1 = false;
        let done2 = false;

        setStep1(prev => {
          if (prev >= snaps1.length - 1) {
            done1 = true;
            return prev;
          }
          return prev + 1;
        });

        setStep2(prev => {
          if (prev >= snaps2.length - 1) {
            done2 = true;
            return prev;
          }
          return prev + 1;
        });

        if (done1 && done2) {
          setIsPlaying(false);
        }
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed, snaps1, snaps2]);

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
    setStep1(0);
    setStep2(0);
    
    // Generating snapshots takes a tiny bit of time, setTimeout allows UI to render 'Resetting...' if we wanted
    const s1 = algorithms[algo1].fn([...initialArray]);
    const s2 = algorithms[algo2].fn([...initialArray]);
    
    setSnaps1(s1);
    setSnaps2(s2);
  };

  const togglePlay = () => {
    if (step1 >= snaps1.length - 1 && step2 >= snaps2.length - 1) {
      resetAndPrepare();
      setTimeout(() => setIsPlaying(true), 50);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const currentSnap1 = snaps1[step1] || { array: initialArray, activeIndices: [], comparisons: 0, isComplete: false };
  const currentSnap2 = snaps2[step2] || { array: initialArray, activeIndices: [], comparisons: 0, isComplete: false };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header / Controls */}
      <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap items-center justify-between shadow-sm z-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Algorithm Comparison</h2>
          <p className="text-sm text-slate-500 mt-1">Run two sorting algorithms simultaneously to compare performance.</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-600">Speed</span>
            <input 
              type="range" 
              min="5" 
              max="100" 
              step="5"
              value={105 - speed}
              onChange={(e) => setSpeed(105 - e.target.value)}
              className="w-24 accent-indigo-600"
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
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-36 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  onClick={addManualData}
                  disabled={isPlaying || !manualInput}
                  className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-medium transition-colors disabled:opacity-50"
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
                title="Generate New Data"
              >
                <RotateCcw size={18} className="mr-2" />
                New Data
              </button>
            )}
            <button 
              onClick={togglePlay}
              className={`px-6 py-2 flex items-center font-medium rounded-lg shadow-sm transition-colors ${
                isPlaying ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        <div className="flex-1 flex flex-col h-full">
          <div className="mb-4 flex justify-center">
             <select 
                value={algo1} 
                onChange={(e) => setAlgo1(e.target.value)}
                className="bg-white border-2 border-slate-200 rounded-lg px-4 py-2 outline-none text-slate-700 font-bold shadow-sm focus:border-indigo-400"
                disabled={isPlaying}
              >
                {Object.keys(algorithms).map(algo => (
                  <option key={algo} value={algo}>{algo}</option>
                ))}
              </select>
          </div>
          <ArrayVisualizer 
            array={currentSnap1.array} 
            activeIndices={currentSnap1.activeIndices} 
            isComplete={currentSnap1.isComplete}
            title={algo1}
            complexity={algorithms[algo1].complexity}
            comparisons={currentSnap1.comparisons}
          />
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center pt-12 text-slate-400 font-bold italic text-2xl">
          VS
        </div>

        <div className="flex-1 flex flex-col h-full">
          <div className="mb-4 flex justify-center">
             <select 
                value={algo2} 
                onChange={(e) => setAlgo2(e.target.value)}
                className="bg-white border-2 border-slate-200 rounded-lg px-4 py-2 outline-none text-slate-700 font-bold shadow-sm focus:border-indigo-400"
                disabled={isPlaying}
              >
                {Object.keys(algorithms).map(algo => (
                  <option key={algo} value={algo}>{algo}</option>
                ))}
              </select>
          </div>
          <ArrayVisualizer 
            array={currentSnap2.array} 
            activeIndices={currentSnap2.activeIndices} 
            isComplete={currentSnap2.isComplete}
            title={algo2}
            complexity={algorithms[algo2].complexity}
            comparisons={currentSnap2.comparisons}
          />
        </div>

      </div>
      {/* Code Editors for both algorithms */}
      <CodeEditorPanel selectedAlgo={algo1} />
    </div>
  );
};

export default ComparisonVisualizer;
