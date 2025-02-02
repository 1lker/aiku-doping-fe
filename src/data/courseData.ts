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
    value: 'biology',
    label: 'Biyoloji',
    units: [
      { value: 'unit1', label: 'Ünite 1 - Hücre Bilimi' },
      { value: 'unit2', label: 'Ünite 2 - Sistemler' },
      { value: 'unit3', label: 'Ünite 3 - Metabolizma' },
      { value: 'unit4', label: 'Ünite 4 - Genetik' }
    ]
  },
  {
    value: 'physics',
    label: 'Fizik',
    units: [
      { value: 'unit1', label: 'Ünite 1 - Kuvvet ve Hareket' },
      { value: 'unit2', label: 'Ünite 2 - Elektrik' },
      { value: 'unit3', label: 'Ünite 3 - Optik' },
      { value: 'unit4', label: 'Ünite 4 - Dalgalar' }
    ]
  },
  {
    value: 'chemistry',
    label: 'Kimya',
    units: [
      { value: 'unit1', label: 'Ünite 1 - Temel Kavramlar' },
      { value: 'unit2', label: 'Ünite 2 - Kimyasal Tepkimeler' },
      { value: 'unit3', label: 'Ünite 3 - Organik Kimya' },
      { value: 'unit4', label: 'Ünite 4 - Analitik Kimya' }
    ]
  },
  {
    value: 'math',
    label: 'Matematik',
    units: [
      { value: 'unit1', label: 'Ünite 1 - Fonksiyonlar' },
      { value: 'unit2', label: 'Ünite 2 - Türev ve İntegral' },
      { value: 'unit3', label: 'Ünite 3 - Geometri' },
      { value: 'unit4', label: 'Ünite 4 - İstatistik ve Olasılık' }
    ]
  },
  {
    value: 'history',
    label: 'Tarih',
    units: [
      { value: 'unit1', label: 'Ünite 1 - Osmanlı Tarihi' },
      { value: 'unit2', label: 'Ünite 2 - Modern Tarih' },
      { value: 'unit3', label: 'Ünite 3 - Dünya Tarihi' },
      { value: 'unit4', label: 'Ünite 4 - Atatürk ve Cumhuriyet' }
    ]
  },
  {
    value: 'geography',
    label: 'Coğrafya',
    units: [
      { value: 'unit1', label: 'Ünite 1 - Fiziki Coğrafya' },
      { value: 'unit2', label: 'Ünite 2 - Beşeri Coğrafya' },
      { value: 'unit3', label: 'Ünite 3 - Harita Bilgisi' },
      { value: 'unit4', label: 'Ünite 4 - Bölgesel Coğrafya' }
    ]
  },
  {
    value: 'literature',
    label: 'Edebiyat',
    units: [
      { value: 'unit1', label: 'Ünite 1 - Klasik Edebiyat' },
      { value: 'unit2', label: 'Ünite 2 - Divan Edebiyatı' },
      { value: 'unit3', label: 'Ünite 3 - Modern Edebiyat' },
      { value: 'unit4', label: 'Ünite 4 - Çağdaş Edebiyat' }
    ]
  },
  {
    value: 'turkish',
    label: 'Türkçe',
    units: [
      { value: 'unit1', label: 'Ünite 1 - Dil Bilgisi' },
      { value: 'unit2', label: 'Ünite 2 - Sözcükte Anlam' },
      { value: 'unit3', label: 'Ünite 3 - Paragraf Anlamı' },
      { value: 'unit4', label: 'Ünite 4 - Yazım Kuralları' }
    ]
  }
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
