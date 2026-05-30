import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import SortingVisualizer from './pages/SortingVisualizer';
import GraphVisualizer from './pages/GraphVisualizer';
import DPVisualizer from './pages/DPVisualizer';
import GreedyVisualizer from './pages/GreedyVisualizer';
import BacktrackingVisualizer from './pages/BacktrackingVisualizer';
import ComparisonVisualizer from './pages/ComparisonVisualizer';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sorting" element={<SortingVisualizer />} />
          <Route path="/graph" element={<GraphVisualizer />} />
          <Route path="/dp" element={<DPVisualizer />} />
          <Route path="/greedy" element={<GreedyVisualizer />} />
          <Route path="/backtracking" element={<BacktrackingVisualizer />} />
          <Route path="/comparison" element={<ComparisonVisualizer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
