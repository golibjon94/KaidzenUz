export interface SubmitTestDto {
  testId: string;
  answers: Array<{
    questionId: string;
    optionId: string;
  }>;
}

export interface Option {
  id: string;
  questionId: string;
  text: string;
  score: number;
  order: number;
}

export interface Question {
  id: string;
  testId: string;
  text: string;
  order: number;
  options: Option[];
}

export interface ResultLogic {
  id: string;
  testId: string;
  minScore: number;
  maxScore: number;
  resultText: string;
  recommendation: string;
}

export interface Test {
  id: string;
  title: string;
  slug: string;
  description?: string;
  isActive: boolean;
  questions: Question[];
  resultLogic: ResultLogic[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    questions: number;
  };
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  score: number;
  resultText: string;
  recommendation: string;
  answers: any;
  createdAt: Date;
  test?: Test;
}
