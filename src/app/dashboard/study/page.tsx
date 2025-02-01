// src/app/study/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseSelection } from '@/components/study/CourseSelection';
import { UnitSelection } from '@/components/study/UnitSelection';
import { QuestionCard } from '@/components/study/QuestionCard';
import { StudyAnalytics } from '@/components/study/StudyAnalytics';
import { useStudySession } from '@/hooks/useStudySession';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, BookOpen, Brain } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import { tr } from '@faker-js/faker/.';

interface Unit {
    value: string;
    label: string;
}

export default function StudyPage() {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
    const [isStudyStarted, setIsStudyStarted] = useState(false);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        loading: questionsLoading,
        error: questionsError,
        currentQuestion,
        answers,
        questions,
        currentQuestionIndex,
        progress,
        metrics,
        isComplete,
        handleAnswer,
        handleNextQuestion,
        resetSession,
        fetchQuestions
    } = useStudySession(selectedCourse, selectedUnits);

    // Ders seçildiğinde üniteleri getir
    useEffect(() => {
        if (selectedCourse) {
            const fetchUnits = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`/api/units?courseId=${selectedCourse}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch units');
                    }
                    const data = await response.json();
                    setUnits(data);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                } finally {
                    setLoading(false);
                }
            };

            fetchUnits();
        } else {
            setUnits([]);
            setSelectedUnits([]);
        }
    }, [selectedCourse]);

    const handleStartStudy = async () => {
        try {
            await fetchQuestions();
            setIsStudyStarted(true);
        } catch (err) {
            console.error('Error starting study:', err);
        }
    };

    const handleRestartStudy = () => {
        setIsStudyStarted(false);
        setSelectedUnits([]);
        resetSession();
    };

    const isLoading = loading || questionsLoading;
    const currentError = error || questionsError;

    return (
        
        <PageContainer scrollable={true}>
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 space-y-6">
                <AnimatePresence mode="wait">
                    {!isStudyStarted ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block p-3 rounded-full bg-blue-100 mb-4"
                                >
                                    <Brain className="w-8 h-8 text-blue-600" />
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-3xl font-bold text-gray-900"
                                >
                                    Çalışmaya Başla
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-gray-600 mt-2"
                                >
                                    Ders ve üniteleri seçerek kişiselleştirilmiş çalışmanıza başlayın
                                </motion.p>
                            </div>

                            <CourseSelection
                                courses={[
                                    { value: 'biology', label: 'Biyoloji' },
                                    { value: 'physics', label: 'Fizik' },
                                    { value: 'chemistry', label: 'Kimya' },
                                    { value: 'math', label: 'Matematik' },
                                    { value: 'history', label: 'Tarih' },
                                    { value: 'geography', label: 'Coğrafya' },
                                    { value: 'religion', label: 'Din Kültürü ve Ahlak Bilgisi' },
                                    { value: 'philosophy', label: 'Felsefe' },
                                    { value: 'literature', label: 'Edebiyat' },
                                    { value: 'english', label: 'İngilizce' },
                                    { value: 'german', label: 'Almanca' },
                                    { value: 'turkish', label: 'Türkçe' },

                                ]}
                                selectedCourse={selectedCourse}
                                onSelect={setSelectedCourse}
                                disabled={isLoading}
                            />

                            {selectedCourse && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <UnitSelection
                                        units={units}
                                        selectedUnits={selectedUnits}
                                        onSelectUnits={setSelectedUnits}
                                        disabled={isLoading}
                                    />
                                </motion.div>
                            )}

                            {currentError && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
                                >
                                    {currentError}
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleStartStudy}
                                    disabled={!selectedCourse || selectedUnits.length === 0 || isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Hazırlanıyor...
                                        </>
                                    ) : (
                                        <>
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Çalışmaya Başla
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <Button
                                    variant="ghost"
                                    onClick={handleRestartStudy}
                                    className="flex items-center"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Geri Dön
                                </Button>

                                <div className="flex items-center gap-4">
                                    <Progress
                                        value={progress.percentage}
                                        className="w-32"
                                    />
                                    <span className="text-sm font-medium">
                                        {progress.current} / {progress.total}
                                    </span>
                                </div>
                            </div>

                            {currentQuestion && (
                                <QuestionCard
                                    question={currentQuestion}
                                    onAnswer={handleAnswer}
                                    onNext={handleNextQuestion}
                                    isLast={currentQuestionIndex === questions.length - 1}
                                    disabled={isLoading}
                                    questionIndex={currentQuestionIndex}  // Yeni prop eklendi
                                />
                            )}

                            {questions.length > 0 && (
                                <StudyAnalytics
                                    questions={questions}
                                    answers={answers}
                                    currentIndex={currentQuestionIndex}
                                />
                            )}

                            {isComplete && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                                >
                                    <Card className="w-full max-w-md">
                                        <CardContent className="p-6 space-y-4">
                                            <div className="text-center">
                                                <div className="inline-block p-3 rounded-full bg-green-100 mb-4">
                                                    <BookOpen className="w-8 h-8 text-green-600" />
                                                </div>
                                                <h2 className="text-2xl font-bold">Tebrikler! 🎉</h2>
                                                <p className="text-gray-600 mt-2">
                                                    Çalışmanızı başarıyla tamamladınız.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                    <p className="text-sm text-gray-600">Toplam Soru</p>
                                                    <p className="text-2xl font-bold">{questions.length}</p>
                                                </div>
                                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                                    <p className="text-sm text-green-600">Doğru Cevap</p>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        {metrics.correctAnswers}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-4 space-y-2">
                                                <h3 className="text-sm font-medium text-gray-700">
                                                    Doğruluk Oranı
                                                </h3>
                                                <Progress
                                                    value={(metrics.correctAnswers / questions.length) * 100}
                                                    className="h-2"
                                                />
                                                <p className="text-sm text-right text-gray-600">
                                                    {Math.round((metrics.correctAnswers / questions.length) * 100)}%
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4">
                                                <Button variant="outline" onClick={handleRestartStudy}>
                                                    Yeni Çalışma
                                                </Button>
                                                <Button onClick={resetSession}>
                                                    Tekrar Çöz
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
        </PageContainer>
    );
}