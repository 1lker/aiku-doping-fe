// src/hooks/useStudySession.ts
import { useState, useCallback, useEffect } from 'react';

interface Question {
  question_text: string;
  learning_outcomes: string[];
  relevant_sections: {
    section_title: string;
    page_numbers: number[];
    relevance_score: number;
  }[];
  possible_answers: string[];
  correct_answer: string;
}

interface StudyMetrics {
  totalQuestions: number;
  correctAnswers: number;
  learningOutcomeProgress: {
    outcomeCode: string;
    correctCount: number;
    totalCount: number;
  }[];
  sectionProgress: {
    sectionTitle: string;
    correctCount: number;
    totalCount: number;
    averageScore: number;
  }[];
}

export const useStudySession = (courseId: string, unitIds: string[]) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    if (!courseId || !unitIds.length) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/study-questions', {
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
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setAnswers([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId, unitIds]);

  const handleAnswer = useCallback((answer: string) => {
    setAnswers(prev => [...prev, answer]);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const calculateMetrics = useCallback((): StudyMetrics => {
    const metrics: StudyMetrics = {
      totalQuestions: questions.length,
      correctAnswers: answers.filter((answer, index) => 
        answer === questions[index].correct_answer
      ).length,
      learningOutcomeProgress: [],
      sectionProgress: []
    };

    // Kazanım ilerlemesini hesapla
    const outcomeMap = new Map<string, { correct: number; total: number }>();
    questions.forEach((q, idx) => {
      q.learning_outcomes.forEach(outcome => {
        if (!outcomeMap.has(outcome)) {
          outcomeMap.set(outcome, { correct: 0, total: 0 });
        }
        const curr = outcomeMap.get(outcome)!;
        curr.total++;
        if (answers[idx] === q.correct_answer) {
          curr.correct++;
        }
      });
    });

    metrics.learningOutcomeProgress = Array.from(outcomeMap.entries()).map(
      ([outcomeCode, stats]) => ({
        outcomeCode,
        correctCount: stats.correct,
        totalCount: stats.total,
      })
    );

    // Bölüm ilerlemesini hesapla
    const sectionMap = new Map<string, { 
      correct: number; 
      total: number;
      scoreSum: number;
    }>();
    
    questions.forEach((q, idx) => {
      q.relevant_sections.forEach(section => {
        if (!sectionMap.has(section.section_title)) {
          sectionMap.set(section.section_title, { 
            correct: 0, 
            total: 0,
            scoreSum: 0
          });
        }
        const curr = sectionMap.get(section.section_title)!;
        curr.total++;
        curr.scoreSum += section.relevance_score;
        if (answers[idx] === q.correct_answer) {
          curr.correct++;
        }
      });
    });

    metrics.sectionProgress = Array.from(sectionMap.entries()).map(
      ([sectionTitle, stats]) => ({
        sectionTitle,
        correctCount: stats.correct,
        totalCount: stats.total,
        averageScore: stats.scoreSum / stats.total,
      })
    );

    return metrics;
  }, [questions, answers]);

  const resetSession = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
  }, []);

  return {
    loading,
    error,
    questions,
    currentQuestion: questions[currentQuestionIndex],
    answers,
    currentQuestionIndex,
    isComplete: answers.length === questions.length,
    progress: {
      current: currentQuestionIndex + 1,
      total: questions.length,
      percentage: questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0
    },
    metrics: calculateMetrics(),
    handleAnswer,
    handleNextQuestion,
    resetSession,
    fetchQuestions
  };
};