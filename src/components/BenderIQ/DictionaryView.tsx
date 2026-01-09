import React, { useState, useMemo } from 'react';
import { ArrowLeft, Book, Search, X } from 'lucide-react';
import { dictionaryData, dictionaryCategories } from '@/data/dictionaryData';

interface DictionaryViewProps {
  theme: string;
  themeConfig: any;
  onBack: () => void;
}

const DictionaryView: React.FC<DictionaryViewProps> = ({ theme, themeConfig, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    let terms = dictionaryData;
    
    if (selectedCategory) {
      terms = terms.filter(t => t.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      terms = terms.filter(t => 
        t.term.toLowerCase().includes(query) || 
        t.definition.toLowerCase().includes(query)
      );
    }
    
    return terms;
  }, [searchQuery, selectedCategory]);

  const groupedTerms = useMemo(() => {
    const groups: { [key: string]: typeof dictionaryData } = {};
    filteredTerms.forEach(term => {
      if (!groups[term.category]) {
        groups[term.category] = [];
      }
      groups[term.category].push(term);
    });
    return groups;
  }, [filteredTerms]);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className={`p-2 rounded-xl ${themeConfig.card} shadow-md active:scale-95 transition-transform`}
        >
          <ArrowLeft size={20} className={themeConfig.text} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Book size={20} className="text-white" />
          </div>
          <h2 className={`text-lg font-black ${themeConfig.text} uppercase tracking-tight`}>
            Conduit Dictionary
          </h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`${themeConfig.card} rounded-2xl shadow-md mb-4 overflow-hidden`}>
        <div className="flex items-center px-4 py-3">
          <Search size={18} className={themeConfig.sub} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terms..."
            className={`flex-1 bg-transparent px-3 py-1 text-sm outline-none ${themeConfig.text}`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1">
              <X size={16} className={themeConfig.sub} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${
            !selectedCategory 
              ? 'bg-blue-600 text-white' 
              : `${themeConfig.card} ${themeConfig.sub}`
          }`}
        >
          All
        </button>
        {dictionaryCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-blue-600 text-white' 
                : `${themeConfig.card} ${themeConfig.sub}`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Terms List */}
      <div className="space-y-6">
        {Object.entries(groupedTerms).map(([category, terms]) => (
          <div key={category}>
            <h3 className={`text-[10px] font-black uppercase tracking-widest ${themeConfig.sub} mb-3 px-1`}>
              {category}
            </h3>
            <div className="space-y-2">
              {terms.map(term => (
                <div 
                  key={term.id} 
                  className={`${themeConfig.card} p-4 rounded-2xl shadow-sm border ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}
                >
                  <h4 className={`text-sm font-bold ${themeConfig.text} mb-1`}>{term.term}</h4>
                  <p className={`text-xs ${themeConfig.sub} leading-relaxed`}>{term.definition}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-sm ${themeConfig.sub}`}>No terms found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default DictionaryView;
