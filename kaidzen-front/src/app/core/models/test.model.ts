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
  order: number;
  nextQuestionId?: string | null;
  feedbackText?: string | null;
  isTerminal?: boolean;
  nextQuestion?: { id: string; text: string };
}

export interface Question {
  id: string;
  testId: string;
  text: string;
  order: number;
  isStartQuestion?: boolean;
  options: Option[];
}


export interface Test {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
  startQuestionId?: string | null;
  questions: Question[];
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
  result: string;
  answers: any;
  createdAt: Date;
  test?: Test;
}
