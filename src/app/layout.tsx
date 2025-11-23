import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NBA Draft Randomizer',
  description: 'Spin for random teams & eras, then draft your ultimate NBA lineup in this 1v1 multiplayer game',
  keywords: ['NBA', 'Basketball', 'Draft', 'Game', 'Randomizer', 'Multiplayer'],
  authors: [{ name: 'NBA Draft Randomizer' }],
  openGraph: {
    title: 'NBA Draft Randomizer',
    description: 'Build your ultimate NBA roster with random team and era constraints',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
