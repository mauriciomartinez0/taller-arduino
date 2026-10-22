import type { Scene } from '@/components/circuit/CircuitDiagram';
import type { CaseProgress, CaseStep } from './case-progress';

/** What the server reveals once a case is solved, given up, or solutions are visible. */
export type SolutionPayload = {
  explanation: string;
  solvedNote?: string;
  fixedCode?: string;
  fixedScene?: Scene;
};

export type CheckRequest = {
  step: CaseStep;
  /** Target id in step 1 (`line:N` or a circuit element); line text or option id in step 2. */
  answer: string;
};

export type CheckResponse = {
  correct: boolean;
  feedback: string;
  note?: string;
  nextStep: CaseStep | 'done';
  solution?: SolutionPayload;
  /** Present once progress lives on the server (phase 5). */
  progress?: CaseProgress;
};

export type ApiError = { error: string };

export type QuizResponse = { correct: boolean; progress: CaseProgress };
