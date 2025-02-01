"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseSelection } from '@/components/study/CourseSelection';
import { UnitSelection } from '@/components/study/UnitSelection';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Loader2, Swords, Trophy, Book } from "lucide-react";
import { GameArena } from '@/components/express-doping/GameArena';
import { MatchResult } from '@/components/express-doping/MatchResult';
import { QuestionDisplay } from '@/components/express-doping/QuestionDisplay';
import { PlayerScoreboard } from '@/components/express-doping/PlayerScoreboard';
import { gameEffects } from '@/utils/effects';
import { loadLeaderboard, updatePlayerScore, getPlayerRankChange } from '@/utils/leaderboard';

interface PlayerStats {
  rank: number;
  gamesPlayed: number;
  wins: number;
  winStreak: number;
}

const DEFAULT_STATS: PlayerStats = {
  rank: 150,
  gamesPlayed: 0,
  wins: 0,
  winStreak: 0
};

const MOCK_PLAYER = {
  id: '1',
  name: 'Test Kullanıcı',
  avatar: '/api/placeholder/100',
  score: 0,
  previousRank: 150,
  newRank: 145,
};

const SAMPLE_UNITS = [
  { 
    value: 'unit1', 
    label: 'Üslü Sayılar',
    learningOutcomes: ['M.9.1.1', 'M.9.1.2'],
    pageNumbers: [10, 15],
  },
  {
    value: 'unit2',
    label: 'Köklü Sayılar',
    learningOutcomes: ['M.9.1.3', 'M.9.1.4'],
    pageNumbers: [16, 20],
  },
  {
    value: 'unit3',
    label: 'Problemler',
    learningOutcomes: ['M.9.1.5', 'M.9.1.6'],
    pageNumbers: [21, 25],
  },
];

const MOCK_QUESTION = {
  "soru_tipi": "şıklı",
  "soru": "Hangi işitme kaybı türü, işitme siniri veya kohlea gibi iç yapılarla ilişkili bir problemin sonucu olarak ortaya çıkar?",
  "muhtemel_cevaplar": "a. İletim tipi sağırlık\nb. Sinirsel sağırlık\nc. Geçici sağırlık\nd. Duyusal uyum",
  "dogru_cevap": "b. Sinirsel sağırlık",
  "soru_zorlugu": 3
};

export default function ExpressDopingPage() {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
    const [matchmaking, setMatchmaking] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [timeLeft, setTimeLeft] = useState(30);
    const [currentQuestion, setCurrentQuestion] = useState(MOCK_QUESTION);
    const [scores, setScores] = useState({
      [MOCK_PLAYER.id]: 0,
      ['npc']: 0
    });
    const [answers, setAnswers] = useState<{[key: string]: {
      answer: string;
      timeSpent: number;
      isCorrect: boolean;
    }}>({});
    const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
    const [showNextQuestion, setShowNextQuestion] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [playerStats, setPlayerStats] = useState<PlayerStats>(DEFAULT_STATS);
  
    // Initial stats load
    useEffect(() => {
      const leaderboard = loadLeaderboard();
      const player = leaderboard.find(p => p.id === MOCK_PLAYER.id);
      if (player) {
        setPlayerStats({
          rank: player.rank,
          gamesPlayed: player.gamesPlayed,
          wins: player.wins,
          winStreak: player.winStreak
        });
      }
    }, []);

  const npcPlayer = { ...MOCK_PLAYER, id: 'npc', name: 'Rakip', isNPC: true };

  // Timer Effect
  useEffect(() => {
    if (!gameStarted || showNextQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        if (prev <= 6) {
          gameEffects.playTickSound();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, showNextQuestion]);

  // NPC Answer Effect
  useEffect(() => {
    if (!gameStarted || showNextQuestion || answers['npc']) return;

    const delay = answers[MOCK_PLAYER.id]
      ? Math.random() * 2000 + 500 // Player cevap verdiyse 0.5-2.5 sn içinde
      : Math.random() * 5000 + 3000; // Vermediyse 3-8 sn içinde

    const timer = setTimeout(() => {
      const isCorrect = Math.random() < 0.7; // %70 doğru cevap verme şansı
      const availableAnswers = currentQuestion.muhtemel_cevaplar
        .split('\n')
        .filter(a => !eliminatedOptions.includes(a));
      
      const npcAnswer = isCorrect 
        ? currentQuestion.dogru_cevap 
        : availableAnswers.find(a => a !== currentQuestion.dogru_cevap) || availableAnswers[0];

      handleAnswer('npc', npcAnswer);
    }, delay);

    return () => clearTimeout(timer);
  }, [gameStarted, showNextQuestion, answers, currentQuestion]);

  const handleTimeUp = () => {
    const unansweredPlayers = [MOCK_PLAYER.id, 'npc'].filter(id => !answers[id]);
    unansweredPlayers.forEach(id => {
      handleAnswer(id, '');
    });
  };

  const handleAnswer = (playerId: string, answer: string) => {
    if (answers[playerId]) return;

    const isCorrect = answer === currentQuestion.dogru_cevap;
    const timeSpent = 30 - timeLeft;

    // Update scores
    if (isCorrect) {
      const points = Math.round(
        (100 - (timeSpent / 30 * 50)) * // Time bonus
        (currentQuestion.soru_zorlugu * 0.5) // Difficulty multiplier
      );

      setScores(prev => ({
        ...prev,
        [playerId]: prev[playerId] + points
      }));

      if (playerId === MOCK_PLAYER.id) {
        gameEffects.playCorrectAnimation();
      }
    } else if (playerId === MOCK_PLAYER.id) {
      gameEffects.playWrongAnimation();
    }

    setAnswers(prev => ({
      ...prev,
      [playerId]: { answer, timeSpent, isCorrect }
    }));

    // If both players answered, prepare next question
    const newAnswers = { ...answers, [playerId]: { answer, timeSpent, isCorrect } };
    if (Object.keys(newAnswers).length === 2) {
      handleBothPlayersAnswered();
    }
  };

  const handleBothPlayersAnswered = () => {
    setShowNextQuestion(true);
    setTimeout(() => {
      if (questionNumber === 10) {
        setGameFinished(true);
        return;
      }

      setQuestionNumber(prev => prev + 1);
      setTimeLeft(30);
      setAnswers({});
      setEliminatedOptions([]);
      setShowNextQuestion(false);
      // In real app, fetch new question here
      setCurrentQuestion(MOCK_QUESTION);
    }, 2000);
  };

  const handleEliminateOptions = () => {
    const wrongAnswers = currentQuestion.muhtemel_cevaplar
      .split('\n')
      .filter(answer => answer !== currentQuestion.dogru_cevap);
    
    // Randomly select 2 wrong answers to eliminate
    const shuffled = wrongAnswers.sort(() => Math.random() - 0.5);
    setEliminatedOptions(shuffled.slice(0, 2));
  };

  const handleStartMatchmaking = () => {
    setMatchmaking(true);
    setTimeout(() => {
      setMatchmaking(false);
      setGameStarted(true);
    }, 3000);
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    setGameFinished(false);
    setQuestionNumber(1);
    setTimeLeft(30);
    setScores({ [MOCK_PLAYER.id]: 0, ['npc']: 0 });
    setAnswers({});
    setEliminatedOptions([]);
    setSelectedCourse('');
    setSelectedUnits([]);
  };

// ExpressPage.tsx
if (gameFinished) {
    const isWinner = scores[MOCK_PLAYER.id] > scores['npc'];
    
    // Update player stats before showing result
    const updatedPlayerStats = {
      ...playerStats,
      gamesPlayed: playerStats.gamesPlayed + 1,
      wins: isWinner ? playerStats.wins + 1 : playerStats.wins,
      winStreak: isWinner ? playerStats.winStreak + 1 : 0
    };
  
    return (
      <MatchResult
        player1={{ ...MOCK_PLAYER, score: scores[MOCK_PLAYER.id] }}
        player2={{ ...npcPlayer, score: scores['npc'] }}
        playerStats={updatedPlayerStats}
        onPlayAgain={handlePlayAgain}
      />
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <AnimatePresence mode="wait">
        {!gameStarted ? (
<div>
{/* Stats and Leaderboard */}
<div className="grid md:grid-cols-1 gap-6">
{/* Stats Card */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
>
  <Card>
    <CardContent className="p-6">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{playerStats.rank}</div>
          <div className="text-sm text-gray-500">Sıralama</div>
        </div>
        <div>
          <Swords className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{playerStats.gamesPlayed}</div>
          <div className="text-sm text-gray-500">Toplam Maç</div>
        </div>
        <div>
          <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{playerStats.wins}</div>
          <div className="text-sm text-gray-500">Galibiyet</div>
        </div>
      </div>
    </CardContent>
  </Card>
</motion.div>

{/* Leaderboard */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.7 }}
>
  <PlayerScoreboard 
    currentPlayerId={MOCK_PLAYER.id}
    onRankUpdate={(oldRank, newRank) => {
      setPlayerStats(prev => ({
        ...prev,
        rank: newRank
      }));
    }}
  />
</motion.div>
</div>

          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >



            <div className="flex items-center justify-between">

                
            


              <div>
                <h1 className="text-3xl font-bold text-blue-900">Express Doping</h1>
                <p className="text-gray-600 mt-2">
                  Arkadaşlarınla yarışarak çöz, puanını yükselt!
                </p>
              </div>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Swords className="w-12 h-12 text-blue-500" />
              </motion.div>
            </div>


            <CourseSelection
              courses={[
                { 
                  value: 'math', 
                  label: 'Matematik',
                  description: 'TYT & AYT Matematik',
                  icon: <Book className="h-5 w-5 text-blue-500" />
                },
                { 
                  value: 'physics', 
                  label: 'Fizik',
                  description: 'TYT & AYT Fizik',
                  icon: <Book className="h-5 w-5 text-green-500" />
                },
                { 
                  value: 'chemistry', 
                  label: 'Kimya',
                  description: 'TYT & AYT Kimya',
                  icon: <Book className="h-5 w-5 text-purple-500" />
                },
              ]}
              selectedCourse={selectedCourse}
              onSelect={setSelectedCourse}
              disabled={matchmaking}
            />

            {selectedCourse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <UnitSelection
                  units={SAMPLE_UNITS}
                  selectedUnits={selectedUnits}
                  onSelectUnits={setSelectedUnits}
                  disabled={matchmaking}
                />
              </motion.div>
            )}

            {selectedCourse && selectedUnits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center pt-4"
              >
                <Button
                  size="lg"
                  onClick={handleStartMatchmaking}
                  disabled={matchmaking}
                  className="w-full max-w-md"
                >
                  {matchmaking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rakip Aranıyor...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Rakip Bul ve Başla
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
          </div>
        ) : (
            <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <GameArena
              player1={{ ...MOCK_PLAYER, score: scores[MOCK_PLAYER.id] }}
              player2={{ ...npcPlayer, score: scores['npc'] }}
              onGameEnd={() => setGameFinished(true)}
              timeLeft={timeLeft}
              questionNumber={questionNumber}
              answers={answers}
              onEliminateOptions={handleEliminateOptions}
            >
              <QuestionDisplay
                question={currentQuestion}
                onAnswer={(answer) => handleAnswer(MOCK_PLAYER.id, answer)}
                eliminatedOptions={eliminatedOptions}
                answered={Boolean(answers[MOCK_PLAYER.id])}
                disabled={showNextQuestion}
              />
            </GameArena>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}