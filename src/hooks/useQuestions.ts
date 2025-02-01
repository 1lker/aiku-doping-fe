// src/features/express-doping/hooks/useQuestions.ts
import { useState, useEffect } from 'react';

interface Question {
  soru_tipi: string;
  soru: string;
  muhtemel_cevaplar: string;
  dogru_cevap: string;
  soru_zorlugu: number;
}

interface UseQuestionsProps {
  courseId: string;
  unitIds: string[];
}

export const useQuestions = ({ courseId, unitIds }: UseQuestionsProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNextQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/express-doping/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          unitIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Soru yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      setCurrentQuestion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return {
    currentQuestion,
    loading,
    error,
    fetchNextQuestion,
  };
};