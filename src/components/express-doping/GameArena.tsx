import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Timer, Lightbulb, Trophy, Users, MessageCircle, Star, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gameEffects } from '@/utils/effects';

interface PowerUp {
  type: 'timeExtend' | 'eliminateOptions' | 'doublePoints';
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isNPC?: boolean;
}

interface GameArenaProps {
  player1: Player;
  player2: Player;
  onGameEnd: (winner: Player) => void;
  timeLeft: number;
  questionNumber: number;
  answers: {[key: string]: {
    answer: string;
    timeSpent: number;
    isCorrect: boolean;
  }};
  onEliminateOptions: () => void;
  children?: React.ReactNode;
}

export const GameArena: React.FC<GameArenaProps> = ({ 
  player1, 
  player2, 
  onGameEnd,
  timeLeft,
  questionNumber,
  answers,
  onEliminateOptions,
  children 
}) => {
  const [showNextQuestion, setShowNextQuestion] = useState(false);
  const [emojis, setEmojis] = useState<{emoji: string, playerId: string}[]>([]);
  const [powerUps, setPowerUps] = useState<{[key: string]: PowerUp[]}>({
    [player1.id]: [
      { type: 'timeExtend', icon: <Clock className="h-4 w-4" />, label: 'Süre Uzat', active: true },
      { type: 'eliminateOptions', icon: <Lightbulb className="h-4 w-4" />, label: 'Eleme', active: true },
      { type: 'doublePoints', icon: <Zap className="h-4 w-4" />, label: '2x Puan', active: true }
    ],
    [player2.id]: []
  });

  const handlePowerUp = (playerId: string, type: string) => {
    switch (type) {
      case 'eliminateOptions':
        onEliminateOptions();
        break;
    }

    setPowerUps(prev => ({
      ...prev,
      [playerId]: prev[playerId].map(p => 
        p.type === type ? { ...p, active: false } : p
      )
    }));
  };

  const handleEmojiReaction = (emoji: string, playerId: string) => {
    const newEmoji = { emoji, playerId };
    setEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setEmojis(prev => prev.filter(e => e !== newEmoji));
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header with Player Info */}
      <motion.div 
        className="grid grid-cols-2 gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {[player1, player2].map((player) => (
          <Card 
            key={player.id} 
            className={`relative ${
              answers[player.id]?.isCorrect 
                ? 'bg-gradient-to-br from-green-50 to-white border-green-200' 
                : answers[player.id]?.answer 
                  ? 'bg-gradient-to-br from-red-50 to-white border-red-200'
                  : 'bg-gradient-to-br from-blue-50 to-white'
            } transition-all duration-300`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={player.avatar} />
                  <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold flex items-center gap-2">
                    {player.name}
                    {player.isNPC && 
                      <Badge variant="secondary">Bot</Badge>
                    }
                  </h3>
                  <motion.div 
                    className="flex items-center gap-2 text-sm"
                    animate={player.score > 0 ? {
                      scale: [1, 1.2, 1],
                      transition: { duration: 0.3 }
                    } : {}}
                  >
                    <Trophy className="h-4 w-4" />
                    <span>{player.score} puan</span>
                  </motion.div>
                </div>

                {/* Power-ups */}
                {powerUps[player.id] && (
                  <div className="flex gap-1">
                    {powerUps[player.id].map((powerUp) => (
                      <Button
                        key={powerUp.type}
                        size="sm"
                        variant="outline"
                        className={`p-1 ${!powerUp.active && 'opacity-50'}`}
                        onClick={() => powerUp.active && handlePowerUp(player.id, powerUp.type)}
                        disabled={!powerUp.active}
                        title={powerUp.label}
                      >
                        {powerUp.icon}
                      </Button>
                    ))}
                  </div>
                )}

                {answers[player.id] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`p-2 rounded-full ${
                      answers[player.id].isCorrect 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}
                  >
                    <div className="text-xs font-medium">
                      {answers[player.id].timeSpent.toFixed(1)}s
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
            
            {/* Emoji Reactions */}
            <AnimatePresence>
              {emojis.filter(e => e.playerId === player.id).map((emoji, index) => (
                <motion.div
                  key={`${emoji.emoji}-${index}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: -20, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl"
                >
                  {emoji.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </Card>
        ))}
      </motion.div>

      {/* Timer and Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{questionNumber}/10. Soru</span>
          <motion.div 
            className="flex items-center gap-2"
            animate={timeLeft <= 5 ? {
              scale: [1, 1.2, 1],
              transition: { repeat: Infinity, duration: 0.5 }
            } : {}}
          >
            <Timer className="h-4 w-4" />
            <span className={timeLeft <= 5 ? 'text-red-500 font-bold' : ''}>
              {timeLeft} saniye
            </span>
          </motion.div>
        </div>
        <Progress 
          value={(questionNumber / 10) * 100}
          className={`h-2 ${timeLeft <= 5 ? 'bg-red-100' : ''}`}
        />
      </div>

      {/* Question Area */}
      {children}

      {/* Emoji Reaction Bar */}
      <motion.div 
        className="fixed bottom-4 right-4 flex gap-2"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        {['👍', '👏', '🎉', '🤔', '😅', '🔥'].map((emoji) => (
          <Button
            key={emoji}
            variant="outline"
            className="w-10 h-10 rounded-full"
            onClick={() => handleEmojiReaction(emoji, player1.id)}
          >
            {emoji}
          </Button>
        ))}
      </motion.div>
    </div>
  );
};

export default GameArena;