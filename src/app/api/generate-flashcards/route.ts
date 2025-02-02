import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request
    if (
      !body.course_content_urls ||
      !Array.isArray(body.course_content_urls) ||
      body.course_content_urls.length === 0
    ) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Gerçek API'ye istek at
    const response = await fetch(
      'https://ad47-188-119-16-233.ngrok-free.app/generate-flashcards',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_content_urls: body.course_content_urls,
          num_questions: body.num_questions || 3
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch flashcards');
    }

    const data = await response.json();

    // Gelen datayı istenen formata dönüştür
    const formattedFlashcards = data.flashcards.map((card: any) => ({
      id: uuidv4(),
      question: card.question,
      answer: card.answer
    }));

    // Response
    return NextResponse.json({
      timestamp: data.timestamp,
      url: body.course_content_urls[0], // İlk URL'i döndür
      flashcards: formattedFlashcards
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
