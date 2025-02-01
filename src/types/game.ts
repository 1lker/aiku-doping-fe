// src/features/express-doping/types/game.ts
export interface Player {
    id: string;
    name: string;
    avatar: string;
    score: number;
    rank?: number;
    previousRank?: number;
    newRank?: number;
  }
  
  export interface Question {
    soru_tipi: 'şıklı';
    soru: string;
    muhtemel_cevaplar: string;
    dogru_cevap: string;
    soru_zorlugu: number;
  }
  
  export interface GameState {
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
  
  export interface Achievement {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
  }
  
  export interface ChatMessage {
    id: string;
    playerId: string;
    message: string;
    timestamp: number;
  }
  
  export interface GameAction {
    type: 'ANSWER' | 'CHAT' | 'READY';
    payload: any;
  }
  
  export interface MatchmakingState {
    status: 'idle' | 'searching' | 'matched' | 'error';
    opponent: Player | null;
    error: string | null;
  }