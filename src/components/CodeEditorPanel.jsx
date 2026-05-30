import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code2, ChevronRight } from 'lucide-react';
import { codeSnippets } from '../data/codeSnippets';

const CodeEditorPanel = ({ selectedAlgo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('C');
  
  const languages = ['C', 'C++', 'Java', 'Python', 'Javascript'];

  // Map to Prism language names
  const syntaxMap = {
    'C': 'c',
    'C++': 'cpp',
    'Java': 'java',
    'Python': 'python',
    'Javascript': 'javascript'
  };

  const snippetsForAlgo = codeSnippets[selectedAlgo] || codeSnippets['Bubble Sort'];
  const snippet = snippetsForAlgo[lang] || '// Snippet not found';

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 bg-slate-800 text-white p-3 rounded-l-xl shadow-lg hover:bg-slate-700 transition-all z-40 ${isOpen ? 'translate-x-full' : 'translate-x-0'}`}
        title="View Code"
      >
        <Code2 size={24} />
      </button>

      {/* Sliding Panel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-lg bg-slate-900 shadow-2xl z-50 transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center space-x-2">
            <Code2 size={20} className="text-emerald-400" />
            <h3 className="text-lg font-bold text-white">{selectedAlgo} Code</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex overflow-x-auto bg-slate-800 border-b border-slate-700 scrollbar-hide">
          {languages.map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                lang === l 
                  ? 'border-emerald-500 text-emerald-400 bg-slate-800/50' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 overflow-auto bg-[#1d1f21] p-0 m-0">
          <SyntaxHighlighter 
            language={syntaxMap[lang]} 
            style={atomDark}
            customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', minHeight: '100%' }}
            showLineNumbers={true}
          >
            {snippet}
          </SyntaxHighlighter>
        </div>

      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default CodeEditorPanel;
