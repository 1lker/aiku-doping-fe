import { NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const requestSchema = z.object({
  course_content_urls: z.array(z.string()).default([]),
  num_questions: z.number().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { course_content_urls, num_questions } = requestSchema.parse(body);

    // Gerçek API'ye istek at
    const response = await fetch(
      'https://3549-188-119-16-233.ngrok-free.app/generate-flashcards',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_content_urls: [
            'https://11-biyo.s3.eu-central-1.amazonaws.com/fenbiyo11_124-167.pdf'
          ],
          num_questions: num_questions || 3
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch flashcards');
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
      url: course_content_urls[0], // İlk URL'i döndür
      flashcards: formattedFlashcards
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
