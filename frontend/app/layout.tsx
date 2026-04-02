
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Derash AI (ደራሽ) - Luxury Concierge',
  description: 'Hospitality that responds instantly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-body text-on-surface selection:bg-secondary-container selection:text-on-secondary-container overflow-hidden h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}