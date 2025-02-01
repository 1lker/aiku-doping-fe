// types/flashcard.ts
export interface Flashcard {
    id: string;
    question: string;
    answer: string;
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }
  
  export interface FlashcardResponse {
    timestamp: string;
    url: string;
    flashcards: Flashcard[];
  }
  
  export interface StudySession {
    cardId: string;
    timeSpent: number;
    isCorrect: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
    timestamp: Date;
  }
  
  export interface StudyAnalytics {
    totalCards: number;
    averageTime: number;
    correctPercentage: number;
    difficultyBreakdown: {
      easy: number;
      medium: number;
      hard: number;
    };
  }