// src/types/question.ts

export interface RelevantSection {
    section_title: string;
    page_numbers: number[];
    relevance_score: number;
  }
  
  export interface Question {
    question_text: string;
    learning_outcomes: string[];
    relevant_sections: RelevantSection[];
    possible_answers: string[];
    correct_answer: string;
  }
  
  export interface QuestionResponse {
    timestamp: string;
    course_urls: string[];
    questions: Question[];
  }