// src/server/websocket.ts
import { Server } from 'socket.io';
import { createServer } from 'http';
import type { Server as HTTPServer } from 'http';

interface QueuedPlayer {
  userId: string;
  courseId: string;
  unitIds: string[];
  socket: any;
}

export class GameServer {
  private io: Server;
  private matchmakingQueue: QueuedPlayer[] = [];

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('START_MATCHMAKING', (data) => {
        this.handleMatchmaking({
          userId: data.userId,
          courseId: data.courseId,
          unitIds: data.unitIds,
          socket,
        });
      });

      socket.on('GAME_ACTION', (data) => {
        this.handleGameAction(socket, data);
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private handleMatchmaking(player: QueuedPlayer) {
    // Mevcut eşleşmeleri kontrol et
    const match = this.matchmakingQueue.find(p => 
      p.courseId === player.courseId &&
      p.unitIds.some(id => player.unitIds.includes(id))
    );

    if (match) {
      // Eşleşme bulundu
      this.startGame(match, player);
      this.matchmakingQueue = this.matchmakingQueue.filter(p => p !== match);
    } else {
      // Eşleşme bulunamadı, kuyruğa ekle
      this.matchmakingQueue.push(player);
    }
  }

  private startGame(player1: QueuedPlayer, player2: QueuedPlayer) {
    const gameRoom = `game_${Date.now()}`;
    
    player1.socket.join(gameRoom);
    player2.socket.join(gameRoom);

    this.io.to(gameRoom).emit('GAME_START', {
      roomId: gameRoom,
      players: [
        { userId: player1.userId },
        { userId: player2.userId },
      ],
    });
  }

  private handleGameAction(socket: any, data: any) {
    const { roomId, action, payload } = data;
    socket.to(roomId).emit('GAME_ACTION', { action, payload });
  }

  private handleDisconnect(socket: any) {
    // Kuyruktaki oyuncuyu kaldır
    this.matchmakingQueue = this.matchmakingQueue.filter(p => p.socket !== socket);
    
    // Aktif oyunları kontrol et ve gerekirse sonlandır
    // ...
  }
}