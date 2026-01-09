import React, { useState, useMemo } from 'react';
import { Brain, ChevronDown, ChevronUp, Search, Book, Lightbulb, Zap, X } from 'lucide-react';
import { getQuestionOfTheDay } from '@/data/dailyQuestions';
import { dictionaryData } from '@/data/dictionaryData';
import { proTipsData } from '@/data/proTipsData';
import { quickTipsData } from '@/data/quickTipsData';

interface BenderIQViewProps {
  theme: string;
  themeConfig: any;
  onNavigate: (view: 'dictionary' | 'proTips' | 'quickTips') => void;
}

interface SearchResult {
  type: 'dictionary' | 'proTips' | 'quickTips';
  id: string;
  title: string;
  preview: string;
}

const BenderIQView: React.FC<BenderIQViewProps> = ({ theme, themeConfig, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const questionOfDay = useMemo(() => getQuestionOfTheDay(), []);

  const searchResults = useMemo((): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search dictionary
    dictionaryData.forEach(item => {
      if (item.term.toLowerCase().includes(query) || item.definition.toLowerCase().includes(query)) {
        results.push({
          type: 'dictionary',
          id: item.id,
          title: item.term,
          preview: item.definition.slice(0, 80) + '...'
        });
      }
    });

    // Search pro tips
    proTipsData.forEach(item => {
      if (item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query)) {
        results.push({
          type: 'proTips',
          id: item.id,
          title: item.question,
          preview: item.answer.slice(0, 80) + '...'
        });
      }
    });

    // Search quick tips
    quickTipsData.forEach(item => {
      if (item.tip.toLowerCase().includes(query)) {
        results.push({
          type: 'quickTips',
          id: item.id,
          title: item.tip.slice(0, 50) + (item.tip.length > 50 ? '...' : ''),
          preview: item.category
        });
      }
    });

    return results.slice(0, 10); // Limit to 10 results
  }, [searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setSearchQuery('');
    onNavigate(result.type);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain size={24} className="text-blue-500" />
          <h2 className={`text-xl font-black ${themeConfig.text} uppercase tracking-tighter`}>
            BENDER <span className="text-white">IQ</span>
          </h2>
        </div>
      </div>

      {/* Element A: Question of the Day */}
      <div 
        className={`${themeConfig.card} p-5 rounded-3xl mb-6 shadow-lg cursor-pointer transition-all duration-300 border hover:border-blue-500/50`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={14} className="text-yellow-500" />
              <span className={`text-[9px] font-black uppercase tracking-widest ${themeConfig.sub}`}>
                Question of the Day
              </span>
            </div>
            <h3 className={`text-sm font-bold ${themeConfig.text} leading-relaxed`}>
              {questionOfDay.question}
            </h3>
          </div>
          <div className={`p-2 rounded-full ${themeConfig.inset} transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={16} className={themeConfig.sub} />
          </div>
        </div>
        
        {/* Answer (Accordion) */}
        <div 
          className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        >
          <div className={`pt-4 border-t ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
            <p className={`text-sm ${themeConfig.sub} leading-relaxed`}>
              {questionOfDay.answer}
            </p>
          </div>
        </div>
      </div>

      {/* Element B: Quick Search Bar */}
      <div className="relative mb-6">
        <div className={`${themeConfig.card} rounded-2xl shadow-md overflow-hidden`}>
          <div className="flex items-center px-4 py-3">
            <Search size={18} className={themeConfig.sub} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Search topics, terms, or tips..."
              className={`flex-1 bg-transparent px-3 py-1 text-sm outline-none ${themeConfig.text} placeholder:${themeConfig.sub}`}
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setShowResults(false); }}
                className={`p-1 rounded-full hover:${themeConfig.inset}`}
              >
                <X size={16} className={themeConfig.sub} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className={`absolute top-full left-0 right-0 mt-2 ${themeConfig.card} rounded-2xl shadow-xl border ${theme === 'light' ? 'border-slate-200' : 'border-white/10'} overflow-hidden z-50 max-h-80 overflow-y-auto`}>
            {searchResults.map((result, index) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className={`w-full p-4 text-left hover:${themeConfig.inset} transition-colors ${index !== searchResults.length - 1 ? `border-b ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}` : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {result.type === 'dictionary' && <Book size={12} className="text-blue-500" />}
                  {result.type === 'proTips' && <Lightbulb size={12} className="text-amber-500" />}
                  {result.type === 'quickTips' && <Zap size={12} className="text-green-500" />}
                  <span className={`text-[9px] font-bold uppercase ${themeConfig.sub}`}>
                    {result.type === 'dictionary' ? 'Dictionary' : result.type === 'proTips' ? 'Pro Tip' : '3-Second Tip'}
                  </span>
                </div>
                <p className={`text-sm font-medium ${themeConfig.text} line-clamp-1`}>{result.title}</p>
                <p className={`text-xs ${themeConfig.sub} line-clamp-1 mt-1`}>{result.preview}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Element C: Three-Button Navigation Row */}
      <div className="grid grid-cols-1 gap-3">
        {/* Dictionary Button */}
        <button
          onClick={() => onNavigate('dictionary')}
          className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg active:scale-98 transition-transform"
        >
          <div className="p-3 bg-white/20 rounded-xl">
            <Book size={24} />
          </div>
          <div className="text-left flex-1">
            <h3 className="text-sm font-black uppercase tracking-wider">The Conduit Dictionary</h3>
            <p className="text-xs opacity-80 mt-0.5">Terms, definitions & concepts</p>
          </div>
          <ChevronDown size={20} className="rotate-[-90deg] opacity-60" />
        </button>

        {/* Pro Tips Button */}
        <button
          onClick={() => onNavigate('proTips')}
          className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg active:scale-98 transition-transform"
        >
          <div className="p-3 bg-white/20 rounded-xl">
            <Lightbulb size={24} />
          </div>
          <div className="text-left flex-1">
            <h3 className="text-sm font-black uppercase tracking-wider">Pro Tips</h3>
            <p className="text-xs opacity-80 mt-0.5">Detailed Q&A for complex problems</p>
          </div>
          <ChevronDown size={20} className="rotate-[-90deg] opacity-60" />
        </button>

        {/* 3-Second Tips Button */}
        <button
          onClick={() => onNavigate('quickTips')}
          className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg active:scale-98 transition-transform"
        >
          <div className="p-3 bg-white/20 rounded-xl">
            <Zap size={24} />
          </div>
          <div className="text-left flex-1">
            <h3 className="text-sm font-black uppercase tracking-wider">3-Second Tips</h3>
            <p className="text-xs opacity-80 mt-0.5">Quick math tricks & rules of thumb</p>
          </div>
          <ChevronDown size={20} className="rotate-[-90deg] opacity-60" />
        </button>
      </div>
    </div>
  );
};

export default BenderIQView;
