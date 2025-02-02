'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseSelector } from '@/components/flashcards/course-selector';
import { UnitSelector } from '@/components/flashcards/unit-selector';
import { PodcastModule } from '@/components/podcast/PodcastModule';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BookOpen, BarChart, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PageContainer from '@/components/layout/page-container';

interface Question {
  id: number;
  courseId: string;
  unitId: string;
  item_body: string;
  taxonomy: string;
  difficulty: string;
  discrimination_index: number;
  item_body_type: string;
  wasWrong: boolean;
  answers: Array<{
    item_answer_id: number;
    answer_body: string;
    sort_order: number;
    is_true: boolean;
    body_type: string;
  }>;
}

export default function PodcastPage() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedCourse && selectedUnits.length > 0) {
      fetchQuestions();
    }
  }, [selectedCourse, selectedUnits]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/generate-podcast/question?courseId=${selectedCourse}&unitId=${selectedUnits[0]}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'kolay':
        return 'bg-green-100 text-green-800';
      case 'orta':
        return 'bg-yellow-100 text-yellow-800';
      case 'zor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageContainer scrollable={true}>
      <div className='min-h-screen bg-gradient-to-br py-8'>
        <div className='mx-auto max-w-7xl space-y-6 px-4'>
          <Card className='shadow-xl backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold text-indigo-700'>
                Podcast Oluşturucu
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-6'>
                  <CourseSelector
                    selectedCourse={selectedCourse}
                    onSelectCourse={setSelectedCourse}
                  />
                  <UnitSelector
                    selectedCourse={selectedCourse}
                    selectedUnits={selectedUnits}
                    onSelectUnits={setSelectedUnits}
                  />
                  <AnimatePresence mode='wait'>
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='flex h-64 items-center justify-center'
                      >
                        <Loader2 className='h-12 w-12 animate-spin text-indigo-600' />
                      </motion.div>
                    ) : questions && questions.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className='space-y-4'
                      >
                        <h3 className='text-lg font-semibold text-indigo-700'>
                          Soru Seçin
                        </h3>
                        <div className='max-h-96 space-y-2 overflow-y-auto pr-2'>
                          {questions.map((question) => (
                            <motion.div
                              key={question.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                variant={
                                  selectedQuestion?.id === question.id
                                    ? 'default'
                                    : 'outline'
                                }
                                className='h-auto w-full justify-start px-4 py-3 text-left'
                                onClick={() => setSelectedQuestion(question)}
                              >
                                <div className='flex flex-col items-start gap-2'>
                                  <span className='font-medium'>
                                    {question.item_body}
                                  </span>
                                  <div className='flex gap-2'>
                                    <Badge
                                      variant='secondary'
                                      className={getDifficultyColor(
                                        question.difficulty
                                      )}
                                    >
                                      {question.difficulty}
                                    </Badge>
                                    {question.wasWrong && (
                                      <Badge variant='destructive'>
                                        <AlertTriangle className='mr-1 h-3 w-3' />
                                        Yanlış Cevaplandı
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
                <div>
                  <AnimatePresence mode='wait'>
                    {selectedQuestion && (
                      <motion.div
                        key={selectedQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className='space-y-6'
                      >
                        <Card className='bg-white/90 shadow-lg backdrop-blur-sm'>
                          <CardHeader>
                            <CardTitle className='text-xl font-semibold text-indigo-700'>
                              Soru Detayları
                            </CardTitle>
                          </CardHeader>
                          <CardContent className='space-y-4'>
                            <div>
                              <h4 className='font-medium text-gray-700'>
                                Soru Metni
                              </h4>
                              <p className='mt-1 text-gray-600'>
                                {selectedQuestion.item_body}
                              </p>
                            </div>
                            <Separator />
                            <div className='grid grid-cols-2 gap-4'>
                              <div>
                                <h4 className='font-medium text-gray-700'>
                                  Zorluk
                                </h4>
                                <Badge
                                  className={`mt-1 ${getDifficultyColor(selectedQuestion.difficulty)}`}
                                >
                                  {selectedQuestion.difficulty}
                                </Badge>
                              </div>
                              <div>
                                <h4 className='font-medium text-gray-700'>
                                  Taksonomi
                                </h4>
                                <Badge variant='outline' className='mt-1'>
                                  <BookOpen className='mr-1 h-3 w-3' />
                                  {selectedQuestion.taxonomy}
                                </Badge>
                              </div>
                              <div>
                                <h4 className='font-medium text-gray-700'>
                                  Ayırt Edicilik İndeksi
                                </h4>
                                <Badge variant='outline' className='mt-1'>
                                  <BarChart className='mr-1 h-3 w-3' />
                                  {selectedQuestion.discrimination_index}
                                </Badge>
                              </div>
                            </div>
                            <Separator />
                            <div>
                              <h4 className='font-medium text-gray-700'>
                                Cevaplar
                              </h4>
                              <ul className='mt-2 space-y-2'>
                                {selectedQuestion.answers.map((answer) => (
                                  <li
                                    key={answer.item_answer_id}
                                    className='flex items-center gap-2'
                                  >
                                    <Badge
                                      variant={
                                        answer.is_true ? 'success' : 'outline'
                                      }
                                      className='flex h-6 w-6 items-center justify-center rounded-full'
                                    >
                                      {String.fromCharCode(
                                        65 + answer.sort_order - 1
                                      )}
                                    </Badge>
                                    <span
                                      className={
                                        answer.is_true
                                          ? 'font-medium text-green-700'
                                          : 'text-gray-600'
                                      }
                                    >
                                      {answer.answer_body}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                        <PodcastModule
                          courseId={selectedQuestion.courseId}
                          unitId={selectedQuestion.unitId}
                          questionId={selectedQuestion.id.toString()}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
