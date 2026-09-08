import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/lib/authContext';

export const metadata: Metadata = {
  title: 'Rose & Rogue — Haute Coiffure Paris & Real-Time Queue Engine',
  description:
    'Commercial-grade, real-time salon management and queue engine with Parisian luxury editorial design, dynamic ETAs, and Smart Overlap chair optimization.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF6F0] dark:bg-[#141110] text-[#2C2725] dark:text-[#FAF6F0] antialiased selection:bg-[#C1785A] selection:text-white transition-colors duration-300">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
