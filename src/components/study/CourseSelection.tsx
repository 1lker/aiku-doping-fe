// src/components/layout/CourseSelection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Course {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface CourseSelectionProps {
  courses: Course[];
  selectedCourse: string;
  onSelect: (courseId: string) => void;
  disabled?: boolean;
}

export const CourseSelection: React.FC<CourseSelectionProps> = ({
  courses,
  selectedCourse,
  onSelect,
  disabled
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold">Ders Seçimi</h2>
          </div>

          <Select
            value={selectedCourse}
            onValueChange={onSelect}
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
                  className="py-3"
                >
                  <div className="flex items-center gap-3">
                    {course.icon || <Book className="h-5 w-5 text-blue-500" />}
                    <div>
                      <div className="font-medium">{course.label}</div>
                      {course.description && (
                        <div className="text-sm text-gray-500">
                          {course.description}
                        </div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCourse && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg"
            >
              <p>
                <span className="font-medium">İpucu:</span> Ders seçiminizi yaptıktan sonra,
                ilgili üniteler otomatik olarak yüklenecektir.
              </p>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};