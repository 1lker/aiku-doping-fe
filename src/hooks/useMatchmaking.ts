// src/features/express-doping/hooks/useMatchmaking.ts
import { useState, useEffect, useCallback } from 'react';

interface MatchmakingOptions {
  courseId: string;
  unitIds: string[];
  userId: string;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
}

type MatchmakingStatus = 'idle' | 'searching' | 'matched' | 'error';

export const useMatchmaking = ({ courseId, unitIds, userId }: MatchmakingOptions) => {
  const [status, setStatus] = useState<MatchmakingStatus>('idle');
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const startSearching = useCallback(() => {
    try {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
      
      ws.onopen = () => {
        setStatus('searching');
        ws.send(JSON.stringify({
          type: 'START_MATCHMAKING',
          payload: {
            userId,
            courseId,
            unitIds,
          },
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'MATCH_FOUND':
            setStatus('matched');
            setOpponent(data.payload.opponent);
            break;

          case 'MATCHMAKING_ERROR':
            setStatus('error');
            setError(data.payload.message);
            break;
        }
      };

      ws.onerror = () => {
        setStatus('error');
        setError('Bağlantı hatası oluştu.');
      };

      setSocket(ws);
    } catch (err) {
      setStatus('error');
      setError('Eşleşme başlatılırken bir hata oluştu.');
    }
  }, [courseId, unitIds, userId]);

  const cancelSearch = useCallback(() => {
    if (socket) {
      socket.send(JSON.stringify({
        type: 'CANCEL_MATCHMAKING',
        payload: { userId },
      }));
      socket.close();
      setSocket(null);
    }
    setStatus('idle');
    setOpponent(null);
    setError(null);
  }, [socket, userId]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return {
    status,
    opponent,
    error,
    startSearching,
    cancelSearch,
  };
};