import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';

export const metadata: Metadata = {
  title: 'AI Job Maker | Build Resumes That Beat The ATS',
  description:
    'Create your base resume once, then tailor it to any job description in seconds with a real ATS match score.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans bg-[#faf9fc]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
