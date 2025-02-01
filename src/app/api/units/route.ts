// src/app/api/units/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const unitSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Mock veri - gerçek uygulamada DB'den gelecek
    const unitsData = {
      "biology": [
        { value: "unit1", label: "Ünite 1 - Hücre Bilimi" },
        { value: "unit2", label: "Ünite 2 - Sistemler" },
        { value: "unit3", label: "Ünite 3 - Metabolizma" },
        { value: "unit4", label: "Ünite 4 - Genetik" }
      ],
      "physics": [
        { value: "unit1", label: "Ünite 1 - Kuvvet ve Hareket" },
        { value: "unit2", label: "Ünite 2 - Elektrik" },
        { value: "unit3", label: "Ünite 3 - Optik" }
      ],
      "chemistry": [
        { value: "unit1", label: "Ünite 1 - Maddenin Yapısı" },
        { value: "unit2", label: "Ünite 2 - Karışımlar" },
        { value: "unit3", label: "Ünite 3 - Kimyasal Tepkimeler" }
      ]
    };

    const units = unitsData[courseId as keyof typeof unitsData] || [];
    return NextResponse.json(units);

  } catch (error) {
    console.error('Error in units API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}