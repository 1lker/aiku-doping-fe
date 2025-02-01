// src/features/express-doping/utils/game.ts
import type { Player, Achievement } from '../types/game';

export const calculateScore = (
  timeSpent: number,
  maxTime: number,
  difficulty: number,
  isCorrect: boolean
): number => {
  if (!isCorrect) return 0;

  const baseScore = Math.max(100 - Math.floor((timeSpent / maxTime) * 100), 10);
  return Math.round(baseScore * (difficulty * 0.5));
};

export const checkAchievements = (
  playerId: string,
  currentAchievements: Achievement[],
  answeredCorrectly: boolean,
  timeSpent: number,
  streak: number
): Achievement[] => {
  const newAchievements: Achievement[] = [];

  // İlk Kan
  if (!currentAchievements.some(a => a.id === 'first_blood')) {
    newAchievements.push({
      id: 'first_blood',
      icon: 'lightning',
      title: 'İlk Kan!',
      description: 'İlk soruyu doğru cevaplayan sen oldun!'
    });
  }

  // Hız Şeytanı
  if (timeSpent < 3 && answeredCorrectly) {
    newAchievements.push({
      id: 'speed_demon',
      icon: 'timer',
      title: 'Hız Şeytanı',
      description: '3 saniyeden kısa sürede doğru cevap!'
    });
  }

  // Seri Katil
  if (streak >= 3 && answeredCorrectly) {
    newAchievements.push({
      id: 'streak_master',
      icon: 'star',
      title: 'Seri Katil',
      description: 'Üst üste 3 doğru cevap!'
    });
  }

  return newAchievements;
};

export const calculateNewRank = (
  currentRank: number,
  scoreChange: number,
  totalPlayers: number
): number => {
  // Basit bir ELO benzeri hesaplama
  const rankChange = Math.floor(scoreChange / 10);
  const newRank = Math.max(1, Math.min(totalPlayers, currentRank - rankChange));
  return newRank;
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const generateStatsReport = (
  player: Player,
  answers: { correct: number; total: number; avgTime: number },
  achievements: Achievement[]
): string => {
  const accuracy = (answers.correct / answers.total) * 100;
  
  return `
    Oyuncu: ${player.name}
    Doğruluk: %${accuracy.toFixed(1)}
    Ortalama Süre: ${answers.avgTime.toFixed(1)} saniye
    Kazanılan Rozetler: ${achievements.length}
    Yeni Sıralama: ${player.newRank} (${
      player.newRank! < player.previousRank! ? '⬆️' : '⬇️'
    } ${Math.abs(player.newRank! - player.previousRank!)} sıra)
  `;
};