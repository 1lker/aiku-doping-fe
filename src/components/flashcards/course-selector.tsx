// src/components/flashcards/course-selector.tsx

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courses } from '@/data/courseData';

interface CourseSelectorProps {
  selectedCourse: string;
  onSelectCourse: (course: string) => void;
  disabled?: boolean;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  selectedCourse,
  onSelectCourse,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Ders Seçimi
      </label>
      <Select
        value={selectedCourse}
        onValueChange={onSelectCourse}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Ders seçiniz" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem 
              key={course.value} 
              value={course.value}
              className="cursor-pointer"
            >
              {course.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};