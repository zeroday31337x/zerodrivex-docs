import './globals.css';

export const metadata = {
  title: 'ZerodriveX Documentation',
  description: 'Research papers, whitepapers, and specifications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
