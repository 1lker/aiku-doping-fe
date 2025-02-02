import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log(searchParams.get('num_of_contents'));
  const numOfContents = searchParams.get('num_of_contents') || '3';

  const response = await fetch(
    `https://2xarr9spz1.execute-api.eu-central-1.amazonaws.com/default/flashcards?num_of_contents=${numOfContents}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  const data = await response.json();

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    course_urls: [
      'https://mufredat.meb.gov.tr/Dosyalar/TTKB/Lise/11/Biyoloji/biyoloji_11.pdf',
      'https://ogmmateryal.eba.gov.tr/panel/upload/pdf/rcyiodzbvw3.pdf'
    ],
    flashcards: data.flashcards // 'questions' yerine 'flashcards' kullanıyoruz
  });
}
