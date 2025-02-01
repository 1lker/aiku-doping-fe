// src/components/study/ProgressMetrics.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Book, Target, Bookmark } from "lucide-react";

interface ProgressMetricsProps {
  metrics: {
    totalQuestions: number;
    correctAnswers: number;
    learningOutcomeProgress: {
      outcomeCode: string;
      correctCount: number;
      totalCount: number;
      score: number;
    }[];
    sectionProgress: {
      sectionTitle: string;
      correctCount: number;
      totalCount: number;
      averageScore: number;
    }[];
  };
}

export const ProgressMetrics: React.FC<ProgressMetricsProps> = ({ metrics }) => {
  const overallProgress = (metrics.correctAnswers / metrics.totalQuestions) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-500" />
          Çalışma İlerlemesi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="outcomes">Kazanımlar</TabsTrigger>
            <TabsTrigger value="sections">Bölümler</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Genel İlerleme</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 text-sm">Toplam Soru</div>
                <div className="text-2xl font-bold">{metrics.totalQuestions}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-green-600 text-sm">Doğru Cevap</div>
                <div className="text-2xl font-bold">{metrics.correctAnswers}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="outcomes" className="space-y-4">
            {metrics.learningOutcomeProgress.map((outcome, index) => (
              <motion.div
                key={outcome.outcomeCode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      Kazanım: {outcome.outcomeCode}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {outcome.correctCount}/{outcome.totalCount}
                  </span>
                </div>
                <Progress 
                  value={(outcome.correctCount / outcome.totalCount) * 100}
                  className="h-2"
                />
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            {metrics.sectionProgress.map((section, index) => (
              <motion.div
                key={section.sectionTitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {section.sectionTitle}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {section.correctCount}/{section.totalCount}
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress 
                    value={(section.correctCount / section.totalCount) * 100}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Ortalama Skor: %{Math.round(section.averageScore * 100)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};