import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Flame, Star, Clock, Medal } from "lucide-react";
import type { LeaderboardPlayer } from '@/utils/leaderboard';
import { loadLeaderboard, simulateBotActivity, saveLeaderboard, updateRanks } from '@/utils/leaderboard';

interface PlayerScoreboardProps {
  currentPlayerId: string;
  onRankUpdate?: (oldRank: number, newRank: number) => void;
}

export const PlayerScoreboard: React.FC<PlayerScoreboardProps> = ({ 
  currentPlayerId,
  onRankUpdate 
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [highlightedRank, setHighlightedRank] = useState<number | null>(null);

  // Load initial leaderboard
  useEffect(() => {
    setLeaderboard(loadLeaderboard());
  }, []);

  // Simulate bot activity every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard(prevLeaderboard => {
        const currentPlayer = prevLeaderboard.find(p => p.id === currentPlayerId);
        const oldRank = currentPlayer?.rank || 0;
        
        const updatedLeaderboard = updateRanks(simulateBotActivity(prevLeaderboard));
        saveLeaderboard(updatedLeaderboard);

        const newRank = updatedLeaderboard.find(p => p.id === currentPlayerId)?.rank || 0;
        if (oldRank !== newRank) {
          setHighlightedRank(newRank);
          onRankUpdate?.(oldRank, newRank);

          // Clear highlight after animation
          setTimeout(() => setHighlightedRank(null), 2000);
        }

        return updatedLeaderboard;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [currentPlayerId, onRankUpdate]);

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Liderlik Tablosu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {leaderboard.map((player, index) => {
              const isCurrentPlayer = player.id === currentPlayerId;
              const isHighlighted = player.rank === highlightedRank;

              return (
                <motion.div
                  key={player.id}
                  initial={isHighlighted ? { scale: 0.95 } : false}
                  animate={isHighlighted ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`
                    p-3 rounded-lg
                    ${isCurrentPlayer ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}
                    ${isHighlighted ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div className="w-8 text-center font-bold">
                      {player.rank <= 3 ? (
                        <Medal className={`h-6 w-6 ${
                          player.rank === 1 ? 'text-yellow-500' :
                          player.rank === 2 ? 'text-gray-400' :
                          'text-amber-600'
                        }`} />
                      ) : (
                        player.rank
                      )}
                    </div>

                    {/* Avatar & Name */}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {player.name}
                        {isCurrentPlayer && (
                          <Badge variant="secondary" className="text-xs">
                            Sen
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{player.score} puan</span>
                        {player.winStreak > 2 && (
                          <Badge variant="outline" className="gap-1">
                            <Flame className="h-3 w-3 text-red-500" />
                            {player.winStreak}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{player.wins}/{player.gamesPlayed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {Math.floor((Date.now() - new Date(player.lastActive).getTime()) / 60000)}d
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PlayerScoreboard;