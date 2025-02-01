// src/app/api/courses/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const courseSchema = z.object({
  value: z.string(),
  label: z.string(),
  units: z.array(z.object({
    value: z.string(),
    label: z.string(),
    learningOutcomes: z.array(z.string()).optional(),
    pageNumbers: z.array(z.number()).optional(),
  })).optional(),
});

// Mock veri - gerçek uygulamada bu veriler veritabanından gelecek
const coursesData = [
  {
    value: "biology",
    label: "Biyoloji",
    units: [
      {
        value: "unit1",
        label: "Ünite 1 - Hücre Bilimi",
        learningOutcomes: ["11.1.1", "11.1.2", "11.1.3"],
        pageNumbers: [1, 2, 3]
      },
      {
        value: "unit2",
        label: "Ünite 2 - Sistemler",
        learningOutcomes: ["11.2.1", "11.2.2"],
        pageNumbers: [4, 5, 6]
      }
    ]
  },
  {
    value: "physics",
    label: "Fizik",
    units: [
      {
        value: "unit1",
        label: "Ünite 1 - Kuvvet ve Hareket",
        learningOutcomes: ["11.1.1.F", "11.1.2.F"],
        pageNumbers: [1, 2]
      }
    ]
  }
];

export async function GET() {
  try {
    // Validate courses data
    const validatedCourses = coursesData.map(course => courseSchema.parse(course));
    
    return NextResponse.json(validatedCourses);
  } catch (error) {
    console.error('Error in courses API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Specific course endpoint
export async function POST(request: Request) {
  try {
    const { courseId } = await request.json();
    
    const course = coursesData.find(c => c.value === courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error in course API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}