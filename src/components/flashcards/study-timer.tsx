// src/components/flashcards/study-timer.tsx

import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { formatTime } from '@/utils/studyUtils';

interface StudyTimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: number) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  isRunning,
  onTimeUpdate
}) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  useEffect(() => {
    if (!isRunning) {
      setTime(0);
    }
  }, [isRunning]);

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Timer className="h-4 w-4" />
      <span>{formatTime(time)}</span>
    </div>
  );
};