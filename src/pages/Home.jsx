import { Link } from 'react-router-dom';
import { BarChart2, GitCommit, LayoutGrid, Network, ListTree } from 'lucide-react';

const categories = [
  { name: 'Sorting', path: '/sorting', icon: BarChart2, description: 'Visualize classic sorting algorithms like Quick Sort and Merge Sort.' },
  { name: 'Graph', path: '/graph', icon: Network, description: 'Explore graph traversals and shortest path algorithms visually.' },
  { name: 'Dynamic Programming', path: '/dp', icon: LayoutGrid, description: 'Understand DP with step-by-step table filling.' },
  { name: 'Greedy', path: '/greedy', icon: ListTree, description: 'See how greedy choices lead to optimal solutions.' },
  { name: 'Backtracking', path: '/backtracking', icon: GitCommit, description: 'Watch the algorithm explore and backtrack to find solutions.' },
];

const Home = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Welcome to Algorithm Lab</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Interactive, step-by-step visualizations of common algorithms. Select a category below to start exploring.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.path}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{cat.name}</h3>
                <p className="text-slate-500 text-sm">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
