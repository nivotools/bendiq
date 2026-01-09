import React from 'react';
import { Progress } from '@/components/ui/progress';
import { getRank, getNextRankThreshold, getCurrentRankThreshold } from '@/hooks/useIQSystem';

interface IQMeterProps {
  score: number;
  theme: string;
  themeConfig: any;
}

const IQMeter: React.FC<IQMeterProps> = ({ score, theme, themeConfig }) => {
  const rank = getRank(score);
  const nextThreshold = getNextRankThreshold(score);
  const currentThreshold = getCurrentRankThreshold(score);
  const progressToNextRank = ((score - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  const clampedProgress = Math.min(Math.max(progressToNextRank, 0), 100);

  return (
    <div className={`${themeConfig.card} p-4 rounded-2xl shadow-lg mb-6 border ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{rank.emoji}</span>
          <span className={`text-sm font-black ${themeConfig.text} uppercase tracking-tight`}>
            Rank: <span className={rank.isWizard ? 'text-yellow-500' : 'text-blue-500'}>{rank.title}</span>
          </span>
        </div>
        <span className={`text-sm font-bold ${themeConfig.sub}`}>
          IQ: <span className={themeConfig.text}>{score}</span> / {nextThreshold}
        </span>
      </div>
      <div className="relative">
        <Progress 
          value={clampedProgress} 
          className="h-3 bg-gray-200 dark:bg-gray-700"
        />
        <div 
          className={`absolute inset-0 h-3 rounded-full transition-all duration-500 overflow-hidden`}
          style={{ 
            width: `${clampedProgress}%`,
            background: rank.isWizard 
              ? 'linear-gradient(90deg, #F59E0B, #EAB308, #FCD34D)' 
              : 'linear-gradient(90deg, #3B82F6, #60A5FA)'
          }}
        />
      </div>
    </div>
  );
};

export default IQMeter;
