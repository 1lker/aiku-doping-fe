// src/app/dashboard/study/page.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RotateCcw } from "lucide-react";
import { CourseSelector } from '@/components/flashcards/course-selector';
import { UnitSelector } from '@/components/flashcards/unit-selector';
import { FlashcardDisplay } from '@/components/flashcards/flashcard-display';
import { StudyTimer } from '@/components/flashcards/study-timer';
import { AnalyticsDisplay } from '@/components/flashcards/analytics-display';
import { useFlashcardSystem } from '@/hooks/use-flashcard-system';
import { calculateStudyAnalytics } from '@/utils/studyUtils';
import { StudyStatus } from '@/data/courseData';

export default function StudyPage() {
  const [selectedCourse, setSelectedCourse] = React.useState<string>("");
  const [selectedUnits, setSelectedUnits] = React.useState<string[]>([]);

  const {
    flashcards,
    currentIndex,
    isFlipped,
    setIsFlipped,
    sessions,
    status,
    error,
    loading,
    handleGenerateFlashcards,
    handleDifficultySelect,
    reset
  } = useFlashcardSystem({
    onComplete: (sessions) => {
      console.log('Study completed!', sessions);
    },
  });

  const handleStartStudy = async () => {
    await handleGenerateFlashcards(selectedCourse, selectedUnits);
  };

  return (
    
    <div className="min-h-screen bg-gray-50 py-8">
      <p className="text-center text-gray-600 text-sm">

        </p>  
      <div className="max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {status === StudyStatus.NOT_STARTED ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Flashcard Çalışma Sistemi
                </h1>
                <p className="text-gray-600">
                  Ders ve üniteleri seçerek çalışmaya başlayın
                </p>
              </div>

              <CourseSelector
                selectedCourse={selectedCourse}
                onSelectCourse={setSelectedCourse}
                disabled={loading}
              />

              <UnitSelector
                selectedCourse={selectedCourse}
                selectedUnits={selectedUnits}
                onSelectUnits={setSelectedUnits}
                disabled={loading || !selectedCourse}
              />

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleStartStudy}
                disabled={!selectedCourse || selectedUnits.length === 0 || loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Kartlar Hazırlanıyor...
                  </div>
                ) : (
                  "Çalışmaya Başla"
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={reset}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Başa Dön
                    </Button>
                    <StudyTimer 
                      isRunning={status === StudyStatus.IN_PROGRESS} 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      İlerleme:
                    </span>
                    <Progress 
                      value={(currentIndex / flashcards.length) * 100} 
                      className="w-32"
                    />
                    <span className="text-sm font-medium">
                      {currentIndex + 1}/{flashcards.length}
                    </span>
                  </div>
                </div>

                {flashcards[currentIndex] && (
                  <FlashcardDisplay
                    flashcard={flashcards[currentIndex]}
                    isFlipped={isFlipped}
                    onFlip={() => setIsFlipped(!isFlipped)}
                    onDifficultySelect={handleDifficultySelect}
                    disabled={status === StudyStatus.COMPLETED}
                  />
                )}
              </div>

              {sessions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AnalyticsDisplay 
                    analytics={calculateStudyAnalytics(sessions, flashcards)} 
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {status === StudyStatus.COMPLETED && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
              <h2 className="text-xl font-bold text-center">
                Çalışma Tamamlandı!
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Toplam Kart</p>
                  <p className="text-2xl font-bold">{flashcards.length}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Doğru Sayısı</p>
                  <p className="text-2xl font-bold text-green-600">
                    {sessions.filter(s => s.isCorrect).length}
                  </p>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={reset}
              >
                Yeniden Başla
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}