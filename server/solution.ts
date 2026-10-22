import 'server-only';

import type { CaseId } from '@/content/cases';
import type { SolutionPayload } from '@/lib/api-types';
import { answers } from './answers';
import { getScene } from './circuits';

export function getSolution(caseId: CaseId): SolutionPayload {
  const { explanation, solvedNote, fixedCode, fixedCircuit } = answers[caseId];
  return {
    explanation,
    solvedNote,
    fixedCode,
    fixedScene: fixedCircuit ? getScene(fixedCircuit) : undefined,
  };
}
