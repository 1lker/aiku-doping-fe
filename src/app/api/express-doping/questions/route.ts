// src/app/api/express-doping/questions/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Örnek soru - gerçek API gelene kadar kullanılacak
const mockQuestion = {
  "soru_tipi": "şıklı",
  "soru": "Hangi işitme kaybı türü, işitme siniri veya kohlea gibi iç yapılarla ilişkili bir problemin sonucu olarak ortaya çıkar?",
  "muhtemel_cevaplar": "a. İletim tipi sağırlık\nb. Sinirsel sağırlık\nc. Geçici sağırlık\nd. Duyusal uyum",
  "dogru_cevap": "b. Sinirsel sağırlık",
  "soru_zorlugu": 3
};

export async function POST(request: NextRequest) {
  try {
    // API gelene kadar mockQuestion'ı döndür
    return NextResponse.json(mockQuestion);

    /* API geldiğinde kullanılacak kod:
    const body = await request.json();
    const { courseId, unitIds } = body;

    const response = await fetch(process.env.LLM_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify({
        course_id: courseId,
        unit_ids: unitIds,
        question_type: 'multiple_choice',
      }),
    });

    if (!response.ok) {
      throw new Error('LLM API error');
    }

    const question = await response.json();
    return NextResponse.json(question);
    */
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: 'Soru oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}