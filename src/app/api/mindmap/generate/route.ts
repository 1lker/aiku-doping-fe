// src/app/api/mindmap/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock veri - gerçek API gelene kadar
const MOCK_MINDMAP = [
  'mindmap  root((Solunum Sistemi))\n    Fiziksel Yapı\n      Burun\n        Kıkırdak\n        Mukozal Tabaka\n        Kılcal Damarlar\n      Boğaz\n        Farinks\n        Larenks\n        Epiglottis\n      Akciğerler\n        Sol Akciğer\n        Sağ Akciğer\n        Alveoller\n    Solunum Süreci\n      Inspirasyon\n        Diyafram Kasılması\n        Genişleme\n        Hava Akışı\n      Ekspirasyon\n        Diyafram Gevşemesi\n        Sıkışma\n        Hava Çıkışı\n    Gaz Değişimi\n      Oksijen Alımı\n        Alveol\n        Kılcal Damarlar\n        Hemoglobin\n      Karbondioksit Atımı\n        Oksijen Taşıma\n        Difüzyon\n        Kan Dolaşımı\n    Solunum Bozuklukları\n      Astım\n        Nedenler\n        Belirtiler\n        Tedavi\n      Kronik Obstrüktif Akciğer Hastalığı\n        Risk Faktörleri\n        Semptomlar\n        Yönetim\n      Pneumoni\n        Türleri\n        Belirtiler\n        Tedavi Yöntemleri'
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, unitId } = body;

    // Burada gerçek API çağrısı yapılacak
    // const response = await fetch(process.env.AI_API_URL!, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.AI_API_KEY}`,
    //   },
    //   body: JSON.stringify({ courseId, unitId }),
    // });

    // if (!response.ok) {
    //   throw new Error('API error');
    // }

    // const data = await response.json();

    // Mock veriyi döndür
    return NextResponse.json(MOCK_MINDMAP);
  } catch (error) {
    console.error('Error generating mindmap:', error);
    return NextResponse.json(
      { error: 'Harita oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
