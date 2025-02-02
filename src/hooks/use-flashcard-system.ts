// src/hooks/use-flashcard-system.ts

import { useState, useEffect, useCallback } from 'react';
import { Flashcard, StudySession } from '../types/flashcard';
import { Difficulty, StudyStatus } from '../data/courseData';
import { shuffleFlashcards } from '../utils/studyUtils';

interface UseFlashcardSystemProps {
  onComplete?: (sessions: StudySession[]) => void;
  enableShuffling?: boolean;
}

export const useFlashcardSystem = ({
  onComplete,
  enableShuffling = true
}: UseFlashcardSystemProps = {}) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [status, setStatus] = useState<StudyStatus>(StudyStatus.NOT_STARTED);
  const [startTime, setStartTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === StudyStatus.IN_PROGRESS && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [status, startTime]);

  // src/hooks/use-flashcard-system.ts

  const handleGenerateFlashcards = useCallback(
    async (course: string, units: string[]) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/generate-flashcards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ course, units })
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error) {
            setError(errorData.error);
          } else {
            setError('Failed to generate flashcards');
          }
        } else {
          const data = await response.json();
          const cards = enableShuffling
            ? shuffleFlashcards(data.flashcards)
            : data.flashcards;

          setFlashcards(cards);
          setCurrentIndex(0);
          setIsFlipped(false);
          setSessions([]);
          setStartTime(Date.now());
          setStatus(StudyStatus.IN_PROGRESS);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
        console.error('Error generating flashcards:', error);
      } finally {
        setLoading(false);
      }
    },
    [enableShuffling]
  );

  const handleDifficultySelect = useCallback(
    (difficulty: Difficulty) => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      const newSession: StudySession = {
        cardId: flashcards[currentIndex].id,
        timeSpent,
        isCorrect: difficulty === Difficulty.EASY,
        difficulty,
        timestamp: new Date()
      };

      setSessions((prev) => [...prev, newSession]);
      setStartTime(Date.now());

      if (currentIndex === flashcards.length - 1) {
        setStatus(StudyStatus.COMPLETED);
        onComplete?.(sessions);
      } else {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsFlipped(false);
        }, 300);
      }
    },
    [currentIndex, flashcards, sessions, startTime, onComplete]
  );

  const reset = useCallback(() => {
    setFlashcards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessions([]);
    setStatus(StudyStatus.NOT_STARTED);
    setStartTime(0);
    setError(null);
  }, []);

  return {
    flashcards,
    currentIndex,
    isFlipped,
    setIsFlipped,
    sessions,
    status,
    error,
    loading,
    handleGenerateFlashcards,
    handleDifficultySelect,
    reset
  };
};
