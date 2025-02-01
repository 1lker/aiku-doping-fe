// src/components/study/StudyAnalytics.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Question } from '@/types/question';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Book, Target, FileText } from 'lucide-react';

interface StudyAnalyticsProps {
  questions: Question[];
  answers: string[];
  currentIndex: number;
}

export const StudyAnalytics = ({ questions, answers, currentIndex }: StudyAnalyticsProps) => {
  // Kazanımları grupla
  const learningOutcomes = new Map<string, { total: number; correct: number }>();
  const sections = new Map<string, { total: number; correct: number; pages: number[] }>();

  questions.forEach((q, idx) => {
    const isAnswered = idx < answers.length;
    const isCorrect = isAnswered && answers[idx] === q.correct_answer;

    // Kazanımları işle
    q.learning_outcomes.forEach(outcome => {
      if (!learningOutcomes.has(outcome)) {
        learningOutcomes.set(outcome, { total: 0, correct: 0 });
      }
      const curr = learningOutcomes.get(outcome)!;
      curr.total++;
      if (isCorrect) curr.correct++;
    });

    // Bölümleri işle
    q.relevant_sections.forEach(section => {
      if (!sections.has(section.section_title)) {
        sections.set(section.section_title, { 
          total: 0, 
          correct: 0,
          pages: section.page_numbers 
        });
      }
      const curr = sections.get(section.section_title)!;
      curr.total++;
      if (isCorrect) curr.correct++;
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Çalışma Analizi</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Genel İlerleme */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Genel İlerleme</span>
              <span>{currentIndex + 1} / {questions.length}</span>
            </div>
            <Progress value={((currentIndex + 1) / questions.length) * 100} />
          </div>

          {/* Kazanım ve Bölüm Analizleri */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="outcomes">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Kazanım Analizi
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {Array.from(learningOutcomes.entries()).map(([outcome, stats]) => (
                    <div key={outcome} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="font-mono">
                          {outcome}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {stats.correct}/{stats.total}
                        </span>
                      </div>
                      <Progress 
                        value={(stats.correct / stats.total) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sections">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Bölüm Analizi
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {Array.from(sections.entries()).map(([section, stats]) => (
                    <div key={section} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{section}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Sayfa: {stats.pages.join(', ')}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {stats.correct}/{stats.total}
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={(stats.correct / stats.total) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};