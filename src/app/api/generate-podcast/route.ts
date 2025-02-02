import { type NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_URL =
  process.env.EXTERNAL_API_URL || 'https://your-external-api.com';

export async function POST(request: NextRequest) {
  const { courseId, unitId, questionId } = await request.json();

  if (!courseId || !unitId || !questionId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${EXTERNAL_API_URL}/generate-podcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ courseId, unitId, questionId })
    });

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating podcast:', error);
    return NextResponse.json(
      { error: 'Failed to generate podcast' },
      { status: 500 }
    );
  }
}
