/** Renders text where `backticks` mark inline code. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i} className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[0.9em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Renders **bold** and `inline code`. */
export function FormattedText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith('**') ? (
          <strong key={i} className="text-ink">
            <RichText text={part.slice(2, -2)} />
          </strong>
        ) : (
          <RichText key={i} text={part} />
        ),
      )}
    </>
  );
}
