import { algorithmDescriptions } from '../data/algorithmDescriptions';
import { Cpu, Zap, GitFork, Undo, Layers, Sliders, Sparkles, HelpCircle } from 'lucide-react';

const categoryConfig = {
  'Divide and Conquer': {
    icon: GitFork,
    gradient: 'from-indigo-500/10 to-purple-500/10 border-indigo-200/60 dark:border-indigo-800/40',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-600'
  },
  'Greedy Method': {
    icon: Zap,
    gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/60 dark:border-emerald-800/40',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600'
  },
  'Dynamic Programming': {
    icon: Cpu,
    gradient: 'from-blue-500/10 to-indigo-500/10 border-blue-200/60 dark:border-blue-800/40',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600'
  },
  'Backtracking': {
    icon: Undo,
    gradient: 'from-violet-500/10 to-pink-500/10 border-violet-200/60 dark:border-violet-800/40',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    iconColor: 'text-violet-600'
  },
  'Decrease and Conquer (State Space Traversal)': {
    icon: Sliders,
    gradient: 'from-amber-500/10 to-orange-500/10 border-amber-200/60 dark:border-amber-800/40',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600'
  },
  'Decrease and Conquer (DFS-based or Source Removal)': {
    icon: Sliders,
    gradient: 'from-amber-500/10 to-orange-500/10 border-amber-200/60 dark:border-amber-800/40',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600'
  },
  'Decrease and Conquer (Incremental)': {
    icon: Sliders,
    gradient: 'from-amber-500/10 to-orange-500/10 border-amber-200/60 dark:border-amber-800/40',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600'
  },
  'Brute Force / Comparison-Based': {
    icon: Layers,
    gradient: 'from-slate-500/10 to-zinc-500/10 border-slate-200/60 dark:border-slate-800/40',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    iconColor: 'text-slate-600'
  },
  'Branch and Bound (Heuristic Search)': {
    icon: Sparkles,
    gradient: 'from-fuchsia-500/10 to-rose-500/10 border-fuchsia-200/60 dark:border-fuchsia-800/40',
    badge: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
    iconColor: 'text-fuchsia-600'
  }
};

const AlgorithmInfoCard = ({ selectedAlgo }) => {
  const info = algorithmDescriptions[selectedAlgo] || algorithmDescriptions['Bubble Sort'];
  
  // Find category styling config or use a default fallback
  const config = categoryConfig[info.category] || {
    icon: HelpCircle,
    gradient: 'from-slate-500/10 to-zinc-500/10 border-slate-200/60',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    iconColor: 'text-slate-600'
  };

  const IconComponent = config.icon;

  return (
    <div className={`w-full bg-gradient-to-r ${config.gradient} border backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.005] hover:border-slate-300 transition-all duration-300`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title, Category & Icon */}
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-xl bg-white shadow-sm border border-slate-100 ${config.iconColor} shrink-0`}>
            <IconComponent size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-slate-800 leading-tight">{selectedAlgo}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badge} uppercase tracking-wider`}>
                {info.category}
              </span>
            </div>
            {/* Description (Exactly 2 lines structured as requested) */}
            <p className="text-slate-600 mt-2 text-sm leading-relaxed max-w-4xl font-medium">
              {info.description} <br className="hidden md:inline" />
              This program falls under the <span className="font-semibold text-slate-800">{info.category}</span> category of DAA, achieving a time complexity of <span className="font-mono font-bold text-slate-800 bg-white/70 px-1.5 py-0.5 rounded border border-slate-100">{info.complexity}</span>.
            </p>
          </div>
        </div>

        {/* Complexity Pill Badges */}
        <div className="flex flex-row md:flex-col gap-2 shrink-0 md:text-right border-t md:border-t-0 border-slate-200/50 pt-3 md:pt-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Time Complexity</span>
            <span className="inline-block bg-white text-slate-800 font-mono font-bold text-sm px-3 py-1 rounded-lg border border-slate-200 shadow-sm mt-0.5">
              {info.complexity}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mt-1">Space Complexity</span>
            <span className="inline-block bg-white text-slate-600 font-mono font-medium text-xs px-2.5 py-0.5 rounded-md border border-slate-150 shadow-sm mt-0.5">
              {info.space}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlgorithmInfoCard;
