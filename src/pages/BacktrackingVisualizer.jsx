import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { nQueens } from '../algorithms/backtracking';
import CodeEditorPanel from '../components/CodeEditorPanel';

const BacktrackingVisualizer = () => {
  const [boardSize, setBoardSize] = useState(4);
  const [snapshots, setSnapshots] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  
  const timerRef = useRef(null);

  useEffect(() => {
    resetAndPrepare();
  }, [boardSize]);

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

  const resetAndPrepare = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    const snaps = nQueens(boardSize);
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

  const currentSnapshot = snapshots[currentStep] || { 
    board: Array(boardSize).fill(0).map(() => Array(boardSize).fill(0)), 
    description: '', 
    activeCell: null, 
    isBacktracking: false 
  };

  const { board, description, activeCell, isBacktracking } = currentSnapshot;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header / Controls */}
      <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap items-center justify-between shadow-sm z-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Backtracking Algorithms</h2>
          <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
            <span className="font-medium text-slate-700">N-Queens Problem</span>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                Best: O(N!)
              </span>
              <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">
                Avg: O(N!)
              </span>
              <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100">
                Worst: O(N!)
              </span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                Space: O(N)
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-600">Board Size (N): {boardSize}</span>
            <input 
              type="range" 
              min="4" 
              max="8" 
              step="1"
              value={boardSize}
              onChange={(e) => setBoardSize(parseInt(e.target.value))}
              disabled={isPlaying}
              className="w-24 accent-purple-600"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-600">Speed</span>
            <input 
              type="range" 
              min="100" 
              max="1500" 
              step="100"
              value={1600 - speed}
              onChange={(e) => setSpeed(1600 - e.target.value)}
              className="w-24 accent-purple-600"
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={resetAndPrepare}
              disabled={isPlaying}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
              title="Reset"
            >
              <RotateCcw size={18} className="mr-2" />
              Reset
            </button>
            <button 
              onClick={togglePlay}
              className={`px-6 py-2 flex items-center font-medium rounded-lg shadow-sm transition-colors ${
                isPlaying ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-purple-600 text-white hover:bg-purple-700'
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
      <div className="flex-1 p-6 flex flex-col overflow-auto relative items-center justify-start">
        <div className="w-full max-w-3xl mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-slate-700 min-h-[4rem] flex items-center justify-center text-center">
          <p className="font-medium text-lg">{description || 'Click play to start the visualization.'}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 inline-block">
          <div 
            className="grid border-4 border-slate-800"
            style={{ 
              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
              width: `${Math.max(300, boardSize * 60)}px`,
              height: `${Math.max(300, boardSize * 60)}px`
            }}
          >
            {board.map((row, rIdx) => 
              row.map((cell, cIdx) => {
                const isBlack = (rIdx + cIdx) % 2 === 1;
                const isActive = activeCell?.r === rIdx && activeCell?.c === cIdx;
                
                let cellClass = "flex items-center justify-center transition-colors duration-200 relative ";
                
                if (isActive) {
                  if (isBacktracking) cellClass += "bg-red-400";
                  else cellClass += "bg-amber-300";
                } else {
                  cellClass += isBlack ? "bg-slate-500" : "bg-slate-100";
                }

                return (
                  <div 
                    key={`${rIdx}-${cIdx}`} 
                    className={cellClass}
                    style={{ aspectRatio: '1/1' }}
                  >
                    {cell === 1 && (
                      <span className="absolute text-4xl filter drop-shadow-md z-10 select-none flex items-center justify-center w-full h-full leading-none" role="img" aria-label="queen">♕</span>
                    )}
                    {isActive && !isBacktracking && cell !== 1 && (
                      <div className="absolute inset-0 border-4 border-amber-500 z-20"></div>
                    )}
                    {isActive && isBacktracking && (
                      <div className="absolute inset-0 border-4 border-red-600 z-20"></div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <CodeEditorPanel selectedAlgo="N-Queens" />
    </div>
  );
};

export default BacktrackingVisualizer;
