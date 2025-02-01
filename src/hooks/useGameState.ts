// src/features/express-doping/hooks/useGameState.ts
import { useState, useEffect, useCallback } from 'react';
import { useQuestions } from './useQuestions';

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
}

interface GameState {
  status: 'waiting' | 'playing' | 'finished';
  currentRound: number;
  timeLeft: number;
  answers: {
    [playerId: string]: {
      answer: string;
      timeSpent: number;
    }
  };
  scores: {
    [playerId: string]: number;
  };
}

const ROUNDS_PER_GAME = 10;
const INITIAL_TIME = 30;

const calculateScore = (timeSpent: number, maxTime: number, difficulty: number) => {
  const baseScore = Math.max(100 - Math.floor((timeSpent / maxTime) * 100), 10);
  return Math.round(baseScore * (difficulty * 0.5));
};

export const useGameState = (
  player1: Player,
  player2: Player,
  courseId: string,
  unitIds: string[]
) => {
  const { currentQuestion, loading, error, fetchNextQuestion } = useQuestions({
    courseId,
    unitIds,
  });

  const [gameState, setGameState] = useState<GameState>({
    status: 'waiting',
    currentRound: 0,
    timeLeft: INITIAL_TIME,
    answers: {},
    scores: {
      [player1.id]: 0,
      [player2.id]: 0,
    },
  });

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: 'playing',
      currentRound: 1,
      timeLeft: INITIAL_TIME,
      answers: {},
    }));
    fetchNextQuestion();
  }, [fetchNextQuestion]);

  const submitAnswer = useCallback((playerId: string, answer: string) => {
    if (gameState.status !== 'playing' || gameState.answers[playerId]) return;

    const timeSpent = INITIAL_TIME - gameState.timeLeft;
    
    setGameState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [playerId]: { answer, timeSpent },
      },
      scores: {
        ...prev.scores,
        [playerId]: prev.scores[playerId] + (
          answer === currentQuestion?.dogru_cevap
            ? calculateScore(timeSpent, INITIAL_TIME, currentQuestion.soru_zorlugu)
            : 0
        ),
      },
    }));
  }, [gameState, currentQuestion]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameState.status === 'playing' && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState.status, gameState.timeLeft]);

  // Advance to next round when both players answer or time runs out
  useEffect(() => {
    const bothPlayersAnswered = Object.keys(gameState.answers).length === 2;
    const timeExpired = gameState.timeLeft === 0;

    if (gameState.status === 'playing' && (bothPlayersAnswered || timeExpired)) {
      if (gameState.currentRound === ROUNDS_PER_GAME) {
        setGameState(prev => ({
          ...prev,
          status: 'finished',
        }));
      } else {
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            currentRound: prev.currentRound + 1,
            timeLeft: INITIAL_TIME,
            answers: {},
          }));
          fetchNextQuestion();
        }, 2000); // Show results for 2 seconds before next question
      }
    }
  }, [gameState, fetchNextQuestion]);

  return {
    gameState,
    currentQuestion,
    loading,
    error,
    startGame,
    submitAnswer,
  };
};