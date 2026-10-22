import { CodeBlock } from '@/components/code/CodeBlock';
import { Card } from '@/components/ui/Card';
import { RichText } from '@/components/ui/RichText';
import { SENSORS, type Block } from '@/content/review';
import { IfSlider } from './IfSlider';
import { PotentiometerSim } from './PotentiometerSim';
import { PwmSlider } from './PwmSlider';
import { ResistorCalculator } from './ResistorCalculator';

/** Renders **bold** inside RichText-style text. */
function Text({ text }: { text: string }) {
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

const INTERACTIVES = {
  'resistor-calculator': ResistorCalculator,
  potentiometer: PotentiometerSim,
  'if-slider': IfSlider,
  'pwm-slider': PwmSlider,
};

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return (
              <p key={i} className="text-lg leading-relaxed">
                <Text text={block.text} />
              </p>
            );
          case 'heading':
            return (
              <h2 key={i} className="mt-2 text-xl">
                {block.text}
              </h2>
            );
          case 'list':
            return (
              <ul key={i} className="ml-5 flex list-disc flex-col gap-1 text-lg">
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Text text={item} />
                  </li>
                ))}
              </ul>
            );
          case 'table':
            return (
              <div key={i} className="border-accent overflow-x-auto rounded-2xl border-2">
                <table className="w-full text-left">
                  <thead className="bg-card">
                    <tr>
                      {block.head.map((h, j) => (
                        <th key={j} scope="col" className="text-ink px-3 py-2">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className="border-t border-slate-200">
                        {row.map((c, k) =>
                          k === 0 ? (
                            <th key={k} scope="row" className="px-3 py-2 font-semibold">
                              <Text text={c} />
                            </th>
                          ) : (
                            <td key={k} className="px-3 py-2">
                              <Text text={c} />
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'code':
            return <CodeBlock key={i} code={block.code} />;
          case 'callout':
            return (
              <Card key={i} tone={block.tone}>
                <p className="flex gap-2">
                  <span aria-hidden>{block.tone === 'warn' ? '⚠️' : '💡'}</span>
                  <span>
                    <Text text={block.text} />
                  </span>
                </p>
              </Card>
            );
          case 'interactive': {
            const Interactive = INTERACTIVES[block.id];
            return <Interactive key={i} />;
          }
          case 'sensors':
            return (
              <div key={i} className="grid gap-3 sm:grid-cols-2">
                {SENSORS.map((s) => (
                  <Card key={s.name} tone="accent" className="flex flex-col gap-1">
                    <h3 className="text-base">{s.name}</h3>
                    <p>
                      <span className="font-semibold">Qué mide: </span>
                      {s.measures}
                    </p>
                    <p>
                      <span className="font-semibold">Salida: </span>
                      {s.output}
                    </p>
                    <p>
                      <span className="font-semibold">Conexión: </span>
                      <Text text={s.pin} />
                    </p>
                    <p>
                      <span className="font-semibold">Números: </span>
                      <Text text={s.values} />
                    </p>
                  </Card>
                ))}
              </div>
            );
        }
      })}
    </div>
  );
}
