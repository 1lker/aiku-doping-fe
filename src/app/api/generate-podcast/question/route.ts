import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_URL =
  process.env.EXTERNAL_API_URL ||
  'https://hdy30n5a33.execute-api.eu-central-1.amazonaws.com/default/question-list?';

export async function GET(request: NextRequest) {
  console.log('GET request');
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  const unitId = searchParams.get('unitId');

  if (!courseId || !unitId) {
    return NextResponse.json(
      { error: 'Missing courseId or unitId' },
      { status: 400 }
    );
  }

  try {
    console.log(`${EXTERNAL_API_URL}courseId=${courseId}&unitId=${unitId}`);

    const response = await fetch(
      `${EXTERNAL_API_URL}courseId=${courseId}&unitId=${unitId}`
    );

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
