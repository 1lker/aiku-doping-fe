import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Award, ArrowRight, Share2 } from "lucide-react";
import confetti from 'canvas-confetti';
import { gameEffects } from '@/utils/effects';
import { useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  previousRank?: number;
  newRank?: number;
}

interface MatchResultProps {
  player1: Player;
  player2: Player;
  layerStats: {
    player1: Player;
    player2: Player;
  };
  onPlayAgain: () => void;
}

export const MatchResult: React.FC<MatchResultProps> = ({
  player1,
  player2,
  layerStats,
  onPlayAgain,
}) => {

  const winner = player1.score > player2.score ? player1 : player2;
  const loser = player1.score < player2.score ? player1 : player2;

  // Oyun sonu efektleri
  useEffect(() => {
    // Zafer konfetisi
    gameEffects.celebrateWin();

    // Zafer sesi
    gameEffects.playWinSound();
    
    // Skor animasyonu
    const pointDiff = winner.score - loser.score;
    const duration = 2000; // 2 saniye
    const fps = 60;
    const frames = duration / (1000 / fps);
    const increment = pointDiff / frames;

    let frame = 0;
    const animate = () => {
      if (frame < frames) {
        gameEffects.playPointSound();
        frame++;
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, []);

  React.useEffect(() => {
    // Victory confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    let skew = 1;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    (function frame() {
      const timeLeft = animationEnd - Date.now();
      const ticks = Math.max(200, 500 * (timeLeft / duration));

      skew = Math.max(0.8, skew - 0.001);

      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
          x: Math.random(),
          y: Math.random() * skew - 0.2,
        },
        colors: ['#FFD700', '#FFA500', '#FF4500'],
        shapes: ['star'],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.8, 1.4),
        drift: randomInRange(-0.4, 0.4),
      });

      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <Card className="bg-gradient-to-br from-yellow-100 to-white overflow-hidden">
        <CardHeader className="text-center pb-2">
          <CardTitle className="flex justify-center items-center gap-2 text-2xl text-yellow-700">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Oyun Bitti!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Winner Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-6"
          >
            <div className="inline-block relative">
              <img
                src={winner.avatar}
                alt={winner.name}
                className="w-24 h-24 rounded-full border-4 border-yellow-500"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-4 -right-4"
              >
                <Award className="w-8 h-8 text-yellow-500" />
              </motion.div>
            </div>
            <h3 className="mt-4 text-xl font-bold">{winner.name}</h3>
            <p className="text-yellow-600 font-semibold text-lg">
              {winner.score} puan
            </p>
          </motion.div>

          {/* Score Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {[winner, loser].map((player) => (
              <motion.div
                key={player.id}
                initial={{ x: player === winner ? -20 : 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg p-4 text-center"
              >
                <div className="text-sm text-gray-600">Sıralama</div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-lg font-semibold">
                    {player.previousRank}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <span className={`text-lg font-semibold ${
                    (player.newRank ?? 0) < (player.previousRank ?? 0) 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {player.newRank}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onPlayAgain}
              className="flex-1"
            >
              Tekrar Oyna
            </Button>
            <Button 
              variant="outline"
              className="flex gap-2"
            >
              <Share2 className="h-4 w-4" />
              Paylaş
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatchResult;

