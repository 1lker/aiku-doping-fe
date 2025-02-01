// src/app/api/study-questions/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Request validation schema
const requestSchema = z.object({
  courseId: z.string(),
  unitIds: z.array(z.string())
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, unitIds } = requestSchema.parse(body);

    // Mock data - gerçek uygulamada bu veri API'den gelecek
    const mockQuestions = {
      "biology": {
        "unit1": [
          {
            "question_text": "Vücudun doğal savunma mekanizmaları arasında yer almayan nedir?",
            "learning_outcomes": [
                "11.1.4.5 kazanım"
            ],
            "relevant_sections": [
                {
                    "section_title": "İnsan Fizyolojisi - Dolaşım Sistemleri",
                    "page_numbers": [2],
                    "relevance_score": 0.95
                }
            ],
            "possible_answers": [
                "A. Tükürük, B. Mide öz suyu, C. İmmünoglobulinler, D. Mukus"
            ],
            "correct_answer": "C. İmmünoglobulinler"
          },
          {
            "question_text": "Komünite ekolojisinde, biyolojik çeşitliliğin sucul ekosistemlerde hangi faktöre bağlı olarak değişiklik gösterdiği belirtilmiştir?",
            "learning_outcomes": [
                "11.2.1.1 kazanım"
            ],
            "relevant_sections": [
                {
                    "section_title": "Komünite ve Popülasyon Ekolojisi - Komünite Ekolojisi",
                    "page_numbers": [3],
                    "relevance_score": 0.95
                }
            ],
            "possible_answers": [
                "A. Enlem, B. Suyun derinliği, C. Suyun kirliliği, D. Suyun tuzluluğu"
            ],
            "correct_answer": "B. Suyun derinliği"
          }
        ],
        "unit2": [
          {
            "question_text": "Üriner sistemin alyuvar üretimine etkisi nedir?",
            "learning_outcomes": [
                "11.1.6.1 kazanım"
            ],
            "relevant_sections": [
                {
                    "section_title": "İnsan Fizyolojisi - Üriner Sistem",
                    "page_numbers": [2],
                    "relevance_score": 0.95
                }
            ],
            "possible_answers": [
                "A. Artırır, B. Azaltır, C. Etkilemez, D. Böbreklerin rolü yoktur"
            ],
            "correct_answer": "A. Artırır"
          }
        ]
      }
    };

    // Seçilen ders ve üniteler için soruları getir
    let questions: any[] = [];
    if (mockQuestions[courseId as keyof typeof mockQuestions]) {
      unitIds.forEach(unitId => {
        const unitQuestions = mockQuestions[courseId as keyof typeof mockQuestions][unitId as 'unit1' | 'unit2'];
        if (unitQuestions) {
          questions = [...questions, ...unitQuestions];
        }
      });
    }

    // Soruları karıştır
    questions = questions.sort(() => Math.random() - 0.5);

    const response = {
      timestamp: new Date().toISOString(),
      course_urls: [
        "https://ogmmateryal.eba.gov.tr/panel/upload/pdf/rcyiodzbvw3.pdf",
        "https://mufredat.meb.gov.tr/Dosyalar/TTKB/Lise/11/Biyoloji/biyoloji_11.pdf"
      ],
      questions: questions
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in study questions API:', error);
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