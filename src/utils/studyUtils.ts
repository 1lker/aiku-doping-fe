// src/utils/study-utils.ts

import { StudySession, StudyAnalytics, Flashcard } from '../types/flashcard';
import { Difficulty } from '../data/courseData';

export const calculateStudyAnalytics = (
  sessions: StudySession[],
  flashcards: Flashcard[]
): StudyAnalytics => {
  if (sessions.length === 0) {
    return {
      totalCards: 0,
      averageTime: 0,
      correctPercentage: 0,
      difficultyBreakdown: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    };
  }

  const totalCards = sessions.length;
  const correctCards = sessions.filter((s) => s.isCorrect).length;
  const totalTime = sessions.reduce((acc, s) => acc + s.timeSpent, 0);

  const difficultyCount = sessions.reduce(
    (acc, s) => {
      acc[s.difficulty]++;
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 }
  );

  return {
    totalCards,
    averageTime: Math.round(totalTime / totalCards),
    correctPercentage: Math.round((correctCards / totalCards) * 100),
    difficultyBreakdown: {
      easy: Math.round((difficultyCount.easy / totalCards) * 100),
      medium: Math.round((difficultyCount.medium / totalCards) * 100),
      hard: Math.round((difficultyCount.hard / totalCards) * 100),
    },
  };
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const shuffleFlashcards = (flashcards: Flashcard[]): Flashcard[] => {
  return [...flashcards].sort(() => Math.random() - 0.5);
};

export const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case Difficulty.EASY:
      return 'text-green-600 bg-green-50';
    case Difficulty.MEDIUM:
      return 'text-yellow-600 bg-yellow-50';
    case Difficulty.HARD:
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};