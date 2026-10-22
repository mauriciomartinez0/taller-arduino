import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HINT_COST, HINTS_PER_CASE } from '@/lib/points';

type SituationCardsProps = {
  expected: string;
  actual: string;
  hints: readonly string[];
  hintsUsed: number;
  /** Hints can't be requested once the case is finished. */
  canAskHint: boolean;
  onHint: () => void;
};

export function SituationCards({
  expected,
  actual,
  hints,
  hintsUsed,
  canAskHint,
  onHint,
}: SituationCardsProps) {
  const remaining = HINTS_PER_CASE - hintsUsed;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card tone="ok">
        <h2 className="text-ok-ink flex items-center gap-2 text-base">
          <span aria-hidden>✅</span> Lo que debería pasar
        </h2>
        <p className="mt-2">{expected}</p>
      </Card>
      <Card tone="bad">
        <h2 className="text-bad-ink flex items-center gap-2 text-base">
          <span aria-hidden>❌</span> Lo que pasa
        </h2>
        <p className="mt-2">{actual}</p>
      </Card>
      <Card tone="warn" aria-live="polite">
        <h2 className="text-warn-ink flex items-center gap-2 text-base">
          <span aria-hidden>💡</span> Pistas
        </h2>
        {hintsUsed > 0 && (
          <ol className="mt-2 flex flex-col gap-2">
            {hints.slice(0, hintsUsed).map((hint, i) => (
              <li key={i}>
                <span className="font-semibold">Pista {i + 1}:</span> {hint}
              </li>
            ))}
          </ol>
        )}
        {canAskHint && remaining > 0 ? (
          <Button variant="warn" className="mt-3 w-full flex-col gap-0" onClick={onHint}>
            Pedir pista {hintsUsed + 1} de {HINTS_PER_CASE}
            <span className="text-sm font-normal">cuesta {HINT_COST} puntos</span>
          </Button>
        ) : (
          hintsUsed === 0 && <p className="mt-2 text-sm">No usaste pistas.</p>
        )}
      </Card>
    </div>
  );
}
