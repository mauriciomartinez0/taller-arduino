import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: {
    default: 'Taller de Arduino',
    template: '%s · Taller de Arduino',
  },
  description: 'Casos de errores, repaso y retos de las clases de Arduino.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es-CO" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
