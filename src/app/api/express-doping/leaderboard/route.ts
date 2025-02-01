// src/app/api/express-doping/leaderboard/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Burada veritabanından sıralama bilgisi çekilecek
    const leaderboard = [
      { rank: 1, userId: '1', name: 'Ahmet', score: 1500, change: 2 },
      { rank: 2, userId: '2', name: 'Mehmet', score: 1450, change: -1 },
      // ...
    ];

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Sıralama bilgisi alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, score } = body;

    // Burada veritabanında skor güncelleme işlemi yapılacak
    // ...

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json(
      { error: 'Skor güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}