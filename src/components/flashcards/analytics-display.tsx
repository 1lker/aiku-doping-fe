// src/components/flashcards/analytics-display.tsx

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudyAnalytics } from '@/types/flashcard';
import { formatTime } from '@/utils/studyUtils';

interface AnalyticsDisplayProps {
  analytics: StudyAnalytics;
}

export const AnalyticsDisplay: React.FC<AnalyticsDisplayProps> = ({
  analytics
}) => {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h3 className="font-medium text-lg text-gray-900">Çalışma Analizi</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Toplam Kart</p>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.totalCards}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Doğru Oranı</p>
            <p className="text-2xl font-bold text-green-600">
              %{analytics.correctPercentage}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Ortalama Süre</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatTime(analytics.averageTime)}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Zorluk Dağılımı</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Kolay</span>
                <span className="text-green-600">
                  %{analytics.difficultyBreakdown.easy}
                </span>
              </div>
              <Progress 
                value={analytics.difficultyBreakdown.easy}
                className="bg-green-100"
              />
              
              <div className="flex justify-between text-xs">
                <span>Orta</span>
                <span className="text-yellow-600">
                  %{analytics.difficultyBreakdown.medium}
                </span>
              </div>
              <Progress 
                value={analytics.difficultyBreakdown.medium}
                className="bg-yellow-100"
              />
              
              <div className="flex justify-between text-xs">
                <span>Zor</span>
                <span className="text-red-600">
                  %{analytics.difficultyBreakdown.hard}
                </span>
              </div>
              <Progress 
                value={analytics.difficultyBreakdown.hard}
                className="bg-red-100"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};