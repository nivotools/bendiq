import React, { useState, useMemo } from 'react';
import { ArrowLeft, Zap, Search, X } from 'lucide-react';
import { quickTipsData, quickTipCategories } from '@/data/quickTipsData';

interface QuickTipsViewProps {
  theme: string;
  themeConfig: any;
  onBack: () => void;
}

const QuickTipsView: React.FC<QuickTipsViewProps> = ({ theme, themeConfig, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTips = useMemo(() => {
    let tips = quickTipsData;
    
    if (selectedCategory) {
      tips = tips.filter(t => t.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tips = tips.filter(t => t.tip.toLowerCase().includes(query));
    }
    
    return tips;
  }, [searchQuery, selectedCategory]);

  const groupedTips = useMemo(() => {
    const groups: { [key: string]: typeof quickTipsData } = {};
    filteredTips.forEach(tip => {
      if (!groups[tip.category]) {
        groups[tip.category] = [];
      }
      groups[tip.category].push(tip);
    });
    return groups;
  }, [filteredTips]);

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
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
            <Zap size={20} className="text-white" />
          </div>
          <h2 className={`text-lg font-black ${themeConfig.text} uppercase tracking-tight`}>
            3-Second Tips
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
            placeholder="Search quick tips..."
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
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
              : `${themeConfig.card} ${themeConfig.sub}`
          }`}
        >
          All
        </button>
        {quickTipCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                : `${themeConfig.card} ${themeConfig.sub}`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tips List */}
      <div className="space-y-6">
        {Object.entries(groupedTips).map(([category, tips]) => (
          <div key={category}>
            <h3 className={`text-[10px] font-black uppercase tracking-widest ${themeConfig.sub} mb-3 px-1`}>
              {category}
            </h3>
            <div className="space-y-2">
              {tips.map(tip => (
                <div 
                  key={tip.id} 
                  className={`${themeConfig.card} p-4 rounded-2xl shadow-sm border ${theme === 'light' ? 'border-slate-100' : 'border-white/5'} flex items-start gap-3`}
                >
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex-shrink-0">
                    <Zap size={14} className="text-emerald-500" />
                  </div>
                  <p className={`text-sm ${themeConfig.text} leading-relaxed font-medium`}>{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-sm ${themeConfig.sub}`}>No tips found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default QuickTipsView;
