// src/components/flashcards/flashcard-display.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Flashcard } from '@/types/flashcard';
import { Difficulty } from '@/data/courseData';

interface FlashcardDisplayProps {
  flashcard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onDifficultySelect: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

export const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({
  flashcard,
  isFlipped,
  onFlip,
  onDifficultySelect,
  disabled = false
}) => {
  return (
    <motion.div
      className="relative h-96 w-full"
      style={{ perspective: "2000px" }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 70 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Question Side */}
        <Card 
          className={cn(
            "absolute w-full h-full cursor-pointer bg-gradient-to-br from-blue-50 to-white",
            "shadow-lg hover:shadow-xl transition-shadow duration-300",
            "backface-hidden",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && onFlip()}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-8">
            <Book className="h-8 w-8 mb-4 text-blue-500" />
            <p className="text-xl text-center font-medium text-gray-800">
              {flashcard.question}
            </p>
            <div className="absolute bottom-4 right-4">
              <Brain className="h-5 w-5 text-blue-300" />
            </div>
          </CardContent>
        </Card>

        {/* Answer Side */}
        <Card 
          className={cn(
            "absolute w-full h-full cursor-pointer bg-gradient-to-br from-green-50 to-white",
            "shadow-lg hover:shadow-xl transition-shadow duration-300",
            "backface-hidden rotate-y-180",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && onFlip()}
          style={{ transform: "rotateY(180deg)" }}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-8">
            <p className="text-xl text-center text-gray-800 mb-8">
              {flashcard.answer}
            </p>
            
            {!disabled && (
              <div className="absolute bottom-4 w-full px-8">
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDifficultySelect(Difficulty.EASY);
                    }}
                  >
                    Kolay
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDifficultySelect(Difficulty.MEDIUM);
                    }}
                  >
                    Orta
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDifficultySelect(Difficulty.HARD);
                    }}
                  >
                    Zor
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};