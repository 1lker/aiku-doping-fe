// src/app/api/flashcards/route.ts

import { NextResponse } from 'next/server';
import { Flashcard } from '@/types/flashcard';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { course, units } = await req.json();

    // Validate request
    if (!course || !units || !Array.isArray(units) || units.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Burada kendi API'nize istek atabilirsiniz
    // Örnek olarak mock data döndürüyorum:
    const mockFlashcards: Flashcard[] = [
      {
        id: uuidv4(),
        question: "Sindirim sistemi içerisinde besinlerin kimyasal sindirimi hangi organlarda başlar?",
        answer: "Besinlerin kimyasal sindirimi ağızda başlar ve mide ile ince bağırsakta devam eder."
      },
      {
        id: uuidv4(),
        question: "Kan dolaşımı sisteminin ana bileşeni nedir ve bu bileşenin temel işlevi nedir?",
        answer: "Kan dolaşımı sisteminin ana bileşeni kalptir. Kalbin temel işlevi, kanı vücudun her yerine pompalamak ve böylece oksijen ve besinlerin hücrelere taşınmasını sağlamaktır."
      },
      {
        id: uuidv4(),
        question: "Lenf ve kan dolaşımı arasındaki ilişki nedir?",
        answer: "Lenf dolaşımı, kan dolaşımı sistemine paralel çalışır ve vücuttan toksinlerin, atık maddelerin temizlenmesine yardımcı olur. Aynı zamanda lenf-kan dolaşımı ilişkisi, bağışıklık sisteminin bir parçası olarak patojenlere karşı koruma sağlar."
      }
    ];

    // Response
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      url: "https://ogmmateryal.eba.gov.tr/panel/upload/pdf/rcyiodzbvw3.pdf",
      flashcards: mockFlashcards
    });

  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}