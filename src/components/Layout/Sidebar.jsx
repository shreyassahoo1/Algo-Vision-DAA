import { Link, useLocation } from 'react-router-dom';
import { BarChart2, GitCommit, LayoutGrid, Network, ListTree, ArrowRightLeft } from 'lucide-react';

const categories = [
  { name: 'Sorting', path: '/sorting', icon: BarChart2 },
  { name: 'Graph', path: '/graph', icon: Network },
  { name: 'Dynamic Programming', path: '/dp', icon: LayoutGrid },
  { name: 'Greedy', path: '/greedy', icon: ListTree },
  { name: 'Backtracking', path: '/backtracking', icon: GitCommit },
  { name: 'Comparison', path: '/comparison', icon: ArrowRightLeft },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold tracking-tight">Algorithm Lab</Link>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {categories.map((cat) => {
          const isActive = location.pathname.startsWith(cat.path);
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              to={cat.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{cat.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800 text-sm text-slate-400">
        Interactive Visualization
      </div>
    </aside>
  );
};

export default Sidebar;
