// src/utils/progress.ts
export const calculateProgressPercentage = (current: number, total: number): number => {
    return (current / total) * 100;
  };
  
  export const calculateAccuracy = (correct: number, total: number): number => {
    return (correct / total) * 100;
  };
  
  export const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  export const getProgressEmoji = (percentage: number): string => {
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👍';
    if (percentage >= 40) return '💪';
    return '📚';
  };