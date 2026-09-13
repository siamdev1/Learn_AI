export const metadata = {
  title: 'LearnAI Backend API Engine',
  description: 'Next.js App Router Backend for LearnAI LMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
