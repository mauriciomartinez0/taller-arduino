import type { ReactNode } from 'react';
import { highlightLine, type TokenKind } from '@/lib/highlight';

const tokenClasses: Record<TokenKind, string> = {
  keyword: 'text-syn-keyword',
  function: 'text-syn-function',
  number: 'text-syn-number',
  comment: 'text-syn-comment italic',
  string: 'text-syn-string',
  text: 'text-syn-text',
};

export type LineState = 'selected' | 'correct' | 'wrong';

const lineStateClasses: Record<LineState, string> = {
  selected: 'bg-white/[0.07] ring-2 ring-inset ring-syn-keyword',
  correct: 'bg-ok/15 ring-2 ring-inset ring-ok',
  wrong: 'bg-bad/15 ring-2 ring-inset ring-bad',
};

const lineStateIcons: Partial<Record<LineState, string>> = { correct: '✅', wrong: '❌' };

type CodeBlockProps = {
  code: string;
  /** When set, every line is a button. */
  onLineClick?: (line: number) => void;
  lineStates?: Record<number, LineState>;
  /** Replaces the content of a line (e.g. with an input). */
  replaceLine?: { line: number; node: ReactNode };
  /** Inserts an extra row after a line. */
  insertAfter?: { line: number; node: ReactNode };
  label?: string;
};

export function CodeLine({ text }: { text: string }) {
  return (
    <>
      {highlightLine(text).map((token, i) => (
        <span key={i} className={tokenClasses[token.kind]}>
          {token.text}
        </span>
      ))}
    </>
  );
}

export function CodeBlock({
  code,
  onLineClick,
  lineStates = {},
  replaceLine,
  insertAfter,
  label = 'Código',
}: CodeBlockProps) {
  const lines = code.split('\n');

  return (
    <div
      role="group"
      aria-label={label}
      tabIndex={onLineClick || replaceLine || insertAfter ? undefined : 0}
      className="bg-code overflow-x-auto rounded-xl py-3 font-mono text-[13px] leading-6 sm:text-sm"
    >
      <ol className="min-w-max">
        {lines.map((text, i) => {
          const n = i + 1;
          const state = lineStates[n];
          const content =
            replaceLine?.line === n ? replaceLine.node : <CodeLine text={text || ' '} />;
          const row = (
            <div className="flex">
              {onLineClick && <span className="sr-only">Línea {n}: </span>}
              <span
                aria-hidden
                className="w-10 shrink-0 pr-3 text-right text-slate-400 select-none"
              >
                {n}
              </span>
              <span className="flex-1 pr-4 whitespace-pre">{content}</span>
              {state && lineStateIcons[state] && (
                <span className="pr-3" aria-hidden>
                  {lineStateIcons[state]}
                </span>
              )}
            </div>
          );

          return (
            <li key={n} className={state ? lineStateClasses[state] : undefined}>
              {onLineClick && replaceLine?.line !== n ? (
                <button
                  type="button"
                  onClick={() => onLineClick(n)}
                  aria-pressed={state === 'selected'}
                  className="block w-full cursor-pointer text-left hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
                >
                  {row}
                </button>
              ) : (
                row
              )}
              {insertAfter?.line === n && (
                <div className="bg-accent/25 flex">
                  <span aria-hidden className="text-syn-keyword w-10 shrink-0 pr-3 text-right">
                    +
                  </span>
                  <span className="flex-1 pr-4">{insertAfter.node}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function CompilerOutput({ output }: { output: string }) {
  return (
    <div className="bg-code rounded-xl p-3">
      <p className="mb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">
        Salida del compilador
      </p>
      <pre className="overflow-x-auto font-mono text-[13px] leading-5 text-orange-300 sm:text-sm">
        {output}
      </pre>
    </div>
  );
}
