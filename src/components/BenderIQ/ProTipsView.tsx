import React, { useState, useMemo } from 'react';
import { ArrowLeft, Lightbulb, Search, X, ChevronDown } from 'lucide-react';
import { proTipsData, proTipCategories } from '@/data/proTipsData';

interface ProTipsViewProps {
  theme: string;
  themeConfig: any;
  onBack: () => void;
  onTipExpand: (tipId: string) => void;
}

const ProTipsView: React.FC<ProTipsViewProps> = ({ theme, themeConfig, onBack, onTipExpand }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const filteredTips = useMemo(() => {
    let tips = proTipsData;
    
    if (selectedCategory) {
      tips = tips.filter(t => t.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tips = tips.filter(t => 
        t.question.toLowerCase().includes(query) || 
        t.answer.toLowerCase().includes(query)
      );
    }
    
    return tips;
  }, [searchQuery, selectedCategory]);

  const groupedTips = useMemo(() => {
    const groups: { [key: string]: typeof proTipsData } = {};
    filteredTips.forEach(tip => {
      if (!groups[tip.category]) {
        groups[tip.category] = [];
      }
      groups[tip.category].push(tip);
    });
    return groups;
  }, [filteredTips]);

  const handleTipClick = (tipId: string) => {
    if (expandedTip !== tipId) {
      onTipExpand(tipId);
    }
    setExpandedTip(expandedTip === tipId ? null : tipId);
  };

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
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
            <Lightbulb size={20} className="text-white" />
          </div>
          <h2 className={`text-lg font-black ${themeConfig.text} uppercase tracking-tight`}>
            Pro Tips
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
            placeholder="Search tips..."
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
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
              : `${themeConfig.card} ${themeConfig.sub}`
          }`}
        >
          All
        </button>
        {proTipCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
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
            <div className="space-y-3">
              {tips.map(tip => (
                <div 
                  key={tip.id} 
                  className={`${themeConfig.card} rounded-2xl shadow-sm border overflow-hidden transition-all ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}
                >
                  <button
                    onClick={() => handleTipClick(tip.id)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb size={12} className="text-amber-500" />
                        <span className={`text-[9px] font-bold uppercase ${themeConfig.sub}`}>Pro Tip</span>
                      </div>
                      <h4 className={`text-sm font-bold ${themeConfig.text} leading-relaxed`}>{tip.question}</h4>
                    </div>
                    <div className={`p-1.5 rounded-full ${themeConfig.inset} transition-transform duration-300 ${expandedTip === tip.id ? 'rotate-180' : ''}`}>
                      <ChevronDown size={14} className={themeConfig.sub} />
                    </div>
                  </button>
                  
                  {/* Answer */}
                  <div className={`overflow-hidden transition-all duration-300 ${expandedTip === tip.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className={`px-4 pb-4 pt-0 border-t ${theme === 'light' ? 'border-slate-100' : 'border-white/10'}`}>
                      <p className={`text-sm ${themeConfig.sub} leading-relaxed pt-4`}>{tip.answer}</p>
                    </div>
                  </div>
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

export default ProTipsView;
