import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface IQSystemState {
  score: number;
  viewedQuestions: string[];
  viewedDictionary: string[];
  viewedSearchResults: string[];
}

const STORAGE_KEY = 'benderIQ_userProgress';

const initialState: IQSystemState = {
  score: 0,
  viewedQuestions: [],
  viewedDictionary: [],
  viewedSearchResults: [],
};

export const getRank = (score: number): { title: string; emoji: string; isWizard: boolean } => {
  if (score >= 600) return { title: 'Pipe Wizard', emoji: '🧙‍♂️', isWizard: true };
  if (score >= 301) return { title: 'Foreman', emoji: '👷', isWizard: false };
  if (score >= 151) return { title: 'Journeyman', emoji: '⚡', isWizard: false };
  if (score >= 51) return { title: 'Apprentice', emoji: '🔨', isWizard: false };
  return { title: 'Greenhorn', emoji: '🟢', isWizard: false };
};

export const getNextRankThreshold = (score: number): number => {
  if (score >= 600) return 600;
  if (score >= 301) return 600;
  if (score >= 151) return 301;
  if (score >= 51) return 151;
  return 51;
};

export const getCurrentRankThreshold = (score: number): number => {
  if (score >= 600) return 600;
  if (score >= 301) return 301;
  if (score >= 151) return 151;
  if (score >= 51) return 51;
  return 0;
};

export const useIQSystem = () => {
  const [state, setState] = useState<IQSystemState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const showPointsToast = useCallback((points: number) => {
    toast({
      title: `+${points} IQ`,
      description: "Keep learning!",
      duration: 2000,
    });
  }, []);

  const addQuestionPoints = useCallback((questionId: string) => {
    setState(prev => {
      if (prev.viewedQuestions.includes(questionId)) {
        return prev;
      }
      const points = 5;
      showPointsToast(points);
      return {
        ...prev,
        score: prev.score + points,
        viewedQuestions: [...prev.viewedQuestions, questionId],
      };
    });
  }, [showPointsToast]);

  const addDictionaryPoints = useCallback((termId: string) => {
    setState(prev => {
      if (prev.viewedDictionary.includes(termId)) {
        return prev;
      }
      const points = 2;
      showPointsToast(points);
      return {
        ...prev,
        score: prev.score + points,
        viewedDictionary: [...prev.viewedDictionary, termId],
      };
    });
  }, [showPointsToast]);

  const addSearchResultPoints = useCallback((resultId: string) => {
    setState(prev => {
      if (prev.viewedSearchResults.includes(resultId)) {
        return prev;
      }
      const points = 3;
      showPointsToast(points);
      return {
        ...prev,
        score: prev.score + points,
        viewedSearchResults: [...prev.viewedSearchResults, resultId],
      };
    });
  }, [showPointsToast]);

  const rank = getRank(state.score);
  const nextThreshold = getNextRankThreshold(state.score);
  const currentThreshold = getCurrentRankThreshold(state.score);
  const progressToNextRank = ((state.score - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

  return {
    score: state.score,
    rank,
    nextThreshold,
    progressToNextRank: Math.min(progressToNextRank, 100),
    addQuestionPoints,
    addDictionaryPoints,
    addSearchResultPoints,
    viewedQuestions: state.viewedQuestions,
    viewedDictionary: state.viewedDictionary,
    viewedSearchResults: state.viewedSearchResults,
  };
};
