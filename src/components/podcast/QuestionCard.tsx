import type React from 'react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Book,
  CheckCircle,
  XCircle,
  FileText,
  Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PodcastModule } from './PodcastModule';

interface QuestionCardProps {
  question: {
    question_text: string;
    learning_outcomes: string[];
    relevant_sections: {
      section_title: string;
      page_numbers: number[];
      relevance_score: number;
    }[];
    possible_answers: string[];
    correct_answer: string;
  };
  onAnswer: (answer: string) => void;
  onNext?: () => void;
  isLast?: boolean;
  disabled?: boolean;
  questionIndex: number;
  courseId: string;
  unitId: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onNext,
  isLast,
  disabled,
  questionIndex,
  courseId,
  unitId
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showPodcast, setShowPodcast] = useState(false);

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      if (hasAnswered) return;

      setSelectedAnswer(answer);
      setShowResult(true);
      setHasAnswered(true);

      const isCorrect = answer === question.correct_answer;

      if (isCorrect) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      onAnswer(answer);
    },
    [hasAnswered, question.correct_answer, onAnswer]
  );

  const handleNext = useCallback(() => {
    onNext?.();
    setShowPodcast(false);
  }, [onNext]);

  const togglePodcast = () => {
    setShowPodcast(!showPodcast);
  };

  const answerVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    hover: { scale: 1.02 }
  };

  const resultVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: 'spring' } }
  };

  const answers = question.possible_answers[0].split(', ');

  return (
    <div className='perspective-1000'>
      <motion.div
        initial={{ rotateX: 90 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className='w-full'
      >
        <Card className='w-full overflow-hidden bg-gradient-to-br from-blue-50 to-white'>
          <CardHeader className='pb-3'>
            <div className='mb-3 flex flex-wrap gap-2'>
              {question.learning_outcomes.map((outcome, index) => (
                <Badge
                  key={index}
                  variant='secondary'
                  className='bg-blue-100 text-blue-800'
                >
                  <Book className='mr-1 h-3 w-3' />
                  {outcome}
                </Badge>
              ))}
            </div>
            <CardTitle className='flex items-start gap-3 text-xl font-medium leading-7'>
              <Brain className='mt-1 h-6 w-6 flex-shrink-0 text-blue-500' />
              {question.question_text}
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div className='grid gap-3'>
              <AnimatePresence mode='wait'>
                {answers.map((answer, index) => (
                  <motion.div
                    key={answer}
                    variants={answerVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    whileHover='hover'
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant='outline'
                      className={`w-full justify-start p-4 text-left ${
                        hasAnswered && answer === question.correct_answer
                          ? 'border-green-500 bg-green-50'
                          : hasAnswered && answer === selectedAnswer
                            ? 'border-red-500 bg-red-50'
                            : ''
                      }`}
                      onClick={() => handleAnswerSelect(answer)}
                      disabled={hasAnswered || disabled}
                    >
                      <span className='mr-2'>{answer.split('.')[0]}.</span>
                      <span>{answer.split('.')[1]}</span>
                      {hasAnswered && answer === question.correct_answer && (
                        <CheckCircle className='ml-auto h-5 w-5 text-green-500' />
                      )}
                      {hasAnswered &&
                        answer === selectedAnswer &&
                        answer !== question.correct_answer && (
                          <XCircle className='ml-auto h-5 w-5 text-red-500' />
                        )}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {showResult && (
              <motion.div
                variants={resultVariants}
                initial='initial'
                animate='animate'
                className='space-y-4'
              >
                <div
                  className={`rounded-lg p-4 ${
                    selectedAnswer === question.correct_answer
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <div className='flex items-center gap-2'>
                    {selectedAnswer === question.correct_answer ? (
                      <>
                        <CheckCircle className='h-5 w-5' />
                        <span>Doğru cevap!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className='h-5 w-5' />
                        <span>
                          Yanlış cevap. Doğru cevap: {question.correct_answer}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className='space-y-3 border-t pt-3'>
                  <h4 className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                    <Bookmark className='h-4 w-4' />
                    İlgili Bölümler
                  </h4>
                  <div className='space-y-2'>
                    {question.relevant_sections.map((section, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                      >
                        <div className='flex items-center gap-2'>
                          <FileText className='h-4 w-4 text-gray-500' />
                          <span className='text-sm'>
                            {section.section_title}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline'>
                            Sayfa: {section.page_numbers.join(', ')}
                          </Badge>
                          <Badge
                            variant='secondary'
                            className='bg-green-100 text-green-800'
                          >
                            %{Math.round(section.relevance_score * 100)}{' '}
                            Uygunluk
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className='w-full' onClick={togglePodcast}>
                  {showPodcast ? "Podcast'i Gizle" : 'Podcast Oluştur'}
                </Button>

                <AnimatePresence>
                  {showPodcast && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <PodcastModule
                        courseId={courseId}
                        unitId={unitId}
                        questionId={question.question_text}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {onNext && (
                  <Button className='mt-4 w-full' onClick={handleNext}>
                    {isLast ? 'Çalışmayı Tamamla' : 'Sonraki Soru'}
                  </Button>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
