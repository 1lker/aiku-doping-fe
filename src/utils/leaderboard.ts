// src/features/express-doping/utils/leaderboard.ts

interface LeaderboardPlayer {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  gamesPlayed: number;
  wins: number;
  winStreak: number;
  lastActive: Date;
}

const DUMMY_NAMES = [
  'Ahmet Yılmaz',
  'Mehmet Demir',
  'Ayşe Kaya',
  'Fatma Çelik',
  'Ali Öztürk',
  'Zeynep Yıldız',
  'Mustafa Şahin',
  'Emine Arslan',
  'Hüseyin Aydın',
  'Hatice Yavuz',
  'İbrahim Erdoğan',
  'Elif Güneş',
  'Murat Koç',
  'Esra Bulut',
  'Ömer Doğan',
  'Merve Özdemir',
  'Emre Şen',
  'Sibel Aktaş',
  'Burak Yalçın',
  'Derya Çetin'
];

// Generate random scores between 1000-2000
const generateInitialLeaderboard = (): LeaderboardPlayer[] => {
  return DUMMY_NAMES.map((name, index) => ({
    id: `bot-${index}`,
    name,
    avatar: `https://eu.ui-avatars.com/api/?name=${name}&size=250`,
    score: 1000 + Math.floor(Math.random() * 1000),
    rank: 0, // Will be calculated
    gamesPlayed: 10 + Math.floor(Math.random() * 40),
    wins: 5 + Math.floor(Math.random() * 20),
    winStreak: Math.floor(Math.random() * 5),
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
  }));
};

// Update ranks based on scores
const updateRanks = (players: LeaderboardPlayer[]): LeaderboardPlayer[] => {
  return players
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      ...player,
      rank: index + 1
    }));
};

// Simulate random activity for bot players
const simulateBotActivity = (
  players: LeaderboardPlayer[]
): LeaderboardPlayer[] => {
  return players.map((player) => {
    if (player.id.startsWith('bot-') && Math.random() < 0.3) {
      // 30% chance of activity
      const scoreChange = Math.floor(Math.random() * 100) - 30; // -30 to +70 points
      return {
        ...player,
        score: Math.max(100, player.score + scoreChange),
        gamesPlayed: player.gamesPlayed + 1,
        wins: scoreChange > 0 ? player.wins + 1 : player.wins,
        winStreak: scoreChange > 0 ? player.winStreak + 1 : 0,
        lastActive: new Date()
      };
    }
    return player;
  });
};

// Save to localStorage
const saveLeaderboard = (leaderboard: LeaderboardPlayer[]) => {
  localStorage.setItem('expressDopingLeaderboard', JSON.stringify(leaderboard));
};

// Load from localStorage or generate new
const loadLeaderboard = (): LeaderboardPlayer[] => {
  const saved = localStorage.getItem('expressDopingLeaderboard');
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed.map((player: LeaderboardPlayer) => ({
      ...player,
      lastActive: new Date(player.lastActive)
    }));
  }
  return updateRanks(generateInitialLeaderboard());
};

// Update player score and recalculate ranks
const updatePlayerScore = (
  leaderboard: LeaderboardPlayer[],
  playerId: string,
  newScore: number,
  won: boolean
): LeaderboardPlayer[] => {
  const updatedLeaderboard = leaderboard.map((player) => {
    if (player.id === playerId) {
      return {
        ...player,
        score: newScore,
        gamesPlayed: player.gamesPlayed + 1,
        wins: won ? player.wins + 1 : player.wins,
        winStreak: won ? player.winStreak + 1 : 0,
        lastActive: new Date()
      };
    }
    return player;
  });

  return updateRanks(updatedLeaderboard);
};

// Get player rank change
const getPlayerRankChange = (
  oldLeaderboard: LeaderboardPlayer[],
  newLeaderboard: LeaderboardPlayer[],
  playerId: string
): number => {
  const oldRank = oldLeaderboard.find((p) => p.id === playerId)?.rank || 0;
  const newRank = newLeaderboard.find((p) => p.id === playerId)?.rank || 0;
  return oldRank - newRank; // Positive means improved rank
};

export {
  type LeaderboardPlayer,
  generateInitialLeaderboard,
  updateRanks,
  simulateBotActivity,
  saveLeaderboard,
  loadLeaderboard,
  updatePlayerScore,
  getPlayerRankChange
};
