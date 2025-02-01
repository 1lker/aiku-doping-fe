import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, XCircle, Clock } from "lucide-react";
import { gameEffects } from '@/utils/effects';

interface QuestionDisplayProps {
    question: {
      soru_tipi: string;
      soru: string;
      muhtemel_cevaplar: string;
      dogru_cevap: string;
      soru_zorlugu: number;
    };
    onAnswer: (answer: string) => void;
    eliminatedOptions: string[];
    answered?: boolean;
    disabled?: boolean;
  }
  
  export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
    question,
    onAnswer,
    eliminatedOptions,
    answered,
    disabled
  }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
  
    const answers = question.muhtemel_cevaplar
      .split('\n')
      .filter(answer => !eliminatedOptions.includes(answer));
  
    const handleAnswerSelect = (answer: string) => {
      if (answered || disabled) return;
      
      setSelectedAnswer(answer);
      setShowFeedback(true);
      onAnswer(answer);
      
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    };
  
    return (
      <motion.div
        key={question.soru}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full perspective-1000"
      >
        <Card className="bg-white shadow-lg overflow-hidden relative">
          <CardContent className="p-6 space-y-6">
            {/* Zorluk Göstergesi */}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i < question.soru_zorlugu 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                />
              ))}
              <span className="text-sm text-gray-500 ml-2">
                Zorluk Seviyesi
              </span>
            </motion.div>
  
            {/* Soru Metni */}
            <motion.div 
              className="text-lg font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-blue-500 mt-1" />
                <span>{question.soru}</span>
              </div>
            </motion.div>
  
            {/* Cevap Seçenekleri */}
            <div className="grid gap-3">
              <AnimatePresence mode="wait">
                {answers.map((answer, index) => (
                  <motion.div
                    key={answer}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ 
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left p-4 relative group ${
                        answered && answer === question.dogru_cevap
                          ? 'border-green-500 bg-green-50'
                          : answered && answer === selectedAnswer
                          ? 'border-red-500 bg-red-50'
                          : eliminatedOptions.includes(answer)
                          ? 'opacity-50'
                          : ''
                      }`}
                      onClick={() => handleAnswerSelect(answer)}
                      disabled={answered || disabled || eliminatedOptions.includes(answer)}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-blue-50 group-hover:to-transparent"
                        layoutId={`highlight-${answer}`}
                        transition={{ duration: 0.3 }}
                      />
  
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <div>
                          <span className="mr-2 font-medium">{answer.split('.')[0]}.</span>
                          <span>{answer.split('.')[1]}</span>
                        </div>
  
                        <AnimatePresence>
                          {answered && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ type: "spring", bounce: 0.5 }}
                            >
                              {answer === question.dogru_cevap ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : answer === selectedAnswer && (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
  
          {/* Geri Bildirim Overlay */}
          <AnimatePresence>
            {showFeedback && selectedAnswer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={`p-6 rounded-full ${
                    selectedAnswer === question.dogru_cevap
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}
                >
                  {selectedAnswer === question.dogru_cevap ? (
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-500" />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    );
  };
  
  export default QuestionDisplay;