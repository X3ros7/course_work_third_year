import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SoundSphere - Authentication',
  description: 'Sign in or create your SoundSphere account.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen flex flex-col ${inter.className}`}>
      <main className="flex-grow">{children}</main>
    </div>
  );
}
