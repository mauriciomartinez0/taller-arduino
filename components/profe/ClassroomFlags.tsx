'use client';

import { setClassroomFlag } from '@/server/actions/teacher';
import { Toggle } from './Toggle';

export function ClassroomFlags({
  classroomId,
  isActive,
  solutionsVisible,
}: {
  classroomId: string;
  isActive: boolean;
  solutionsVisible: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1">
      <Toggle
        label="Clase activa"
        checked={isActive}
        onChange={(v) => setClassroomFlag(classroomId, 'isActive', v)}
      />
      <Toggle
        label="Mostrar soluciones a los estudiantes"
        checked={solutionsVisible}
        onChange={(v) => setClassroomFlag(classroomId, 'solutionsVisible', v)}
      />
    </div>
  );
}
