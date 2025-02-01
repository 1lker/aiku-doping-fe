// src/data/course-data.ts

export interface CourseType {
  value: string;
  label: string;
  units?: UnitType[];
}

export interface UnitType {
  value: string;
  label: string;
  topics?: string[];
}

export const courses: CourseType[] = [
  { 
    value: "biology", 
    label: "Biyoloji",
    units: [
      { value: "unit1", label: "Ünite 1 - Hücre Bilimi" },
      { value: "unit2", label: "Ünite 2 - Sistemler" },
      { value: "unit3", label: "Ünite 3 - Metabolizma" },
      { value: "unit4", label: "Ünite 4 - Genetik" }
    ]
  },
  { 
    value: "physics", 
    label: "Fizik",
    units: [
      { value: "unit1", label: "Ünite 1 - Kuvvet ve Hareket" },
      { value: "unit2", label: "Ünite 2 - Elektrik" },
      { value: "unit3", label: "Ünite 3 - Optik" },
      { value: "unit4", label: "Ünite 4 - Dalgalar" }
    ]
  },
  // Diğer dersler...
] as const;

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum StudyStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PAUSED = 'paused'
}