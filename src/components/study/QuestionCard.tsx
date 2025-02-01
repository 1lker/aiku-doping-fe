// src/components/study/QuestionCard.tsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Book, CheckCircle, XCircle, FileText, Bookmark } from "lucide-react";
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

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
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onNext,
  isLast,
  disabled,
  questionIndex
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setHasAnswered(false);
  }, [questionIndex]);

  const handleAnswerSelect = useCallback((answer: string) => {
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
  }, [hasAnswered, question.correct_answer, onAnswer]);

  const handleNext = useCallback(() => {
    onNext?.();
  }, [onNext]);


  const answerVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    hover: { scale: 1.02 }
  };

  const resultVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring" } }
  };

  // Cevap seçeneklerini ayır
  const answers = question.possible_answers[0].split(', ');

  return (
    <div className="perspective-1000">
      <motion.div
        initial={{ rotateX: 90 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full"
      >
        <Card className="w-full overflow-hidden bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {question.learning_outcomes.map((outcome, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                  <Book className="w-3 h-3 mr-1" />
                  {outcome}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-xl font-medium leading-7 flex items-start gap-3">
              <Brain className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              {question.question_text}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Cevap Seçenekleri */}
            <div className="grid gap-3">
              <AnimatePresence mode="wait">
                {answers.map((answer, index) => (
                  <motion.div
                    key={answer}
                    variants={answerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full p-4 justify-start text-left ${
                        hasAnswered && answer === question.correct_answer
                          ? 'border-green-500 bg-green-50'
                          : hasAnswered && answer === selectedAnswer
                          ? 'border-red-500 bg-red-50'
                          : ''
                      }`}
                      onClick={() => handleAnswerSelect(answer)}
                      disabled={hasAnswered || disabled}
                    >
                      <span className="mr-2">{answer.split('.')[0]}.</span>
                      <span>{answer.split('.')[1]}</span>
                      {hasAnswered && answer === question.correct_answer && (
                        <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                      )}
                      {hasAnswered && answer === selectedAnswer && answer !== question.correct_answer && (
                        <XCircle className="ml-auto h-5 w-5 text-red-500" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Sonuç ve Detaylar */}
            {showResult && (
              <motion.div
                variants={resultVariants}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                {/* Doğru/Yanlış Bildirimi */}
                <div className={`p-4 rounded-lg ${
                  selectedAnswer === question.correct_answer
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {selectedAnswer === question.correct_answer ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Doğru cevap!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        <span>
                          Yanlış cevap. Doğru cevap: {question.correct_answer}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* İlgili Bölümler */}
                <div className="space-y-3 pt-3 border-t">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    İlgili Bölümler
                  </h4>
                  <div className="space-y-2">
                    {question.relevant_sections.map((section, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{section.section_title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Sayfa: {section.page_numbers.join(', ')}
                          </Badge>
                          <Badge 
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            %{Math.round(section.relevance_score * 100)} Uygunluk
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* İlerle Butonu */}
                {onNext && (
                  <Button 
                    className="w-full mt-4"
                    onClick={onNext}
                  >
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

