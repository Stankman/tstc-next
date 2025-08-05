import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/global/header";
import { Footer } from "../components/global/footer";
import { LoadingProvider } from "../components/global/loading-overlay";
import { LocaleInitializer } from "../components/global/locale-initializer";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('common');
 
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LocaleInitializer />
        <NextIntlClientProvider messages={messages}>
          <LoadingProvider>
            <div id="page" className="flex flex-col h-full">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </LoadingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
