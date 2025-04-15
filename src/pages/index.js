import { Geist, Geist_Mono } from "next/font/google";
import { Bebas_Neue } from 'next/font/google';

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Header from "@/components/header";
import CaptureTheFlag from "@/components/Sections/welcomeSection";
import HowToPlay from "@/components/Sections/howToPlay";
import PrivacyChallenge from "@/components/Sections/privacyPolicy";
import FlagCounter from "@/components/flagsCounter";

import { FlagProvider } from "@/hooks/flagContext";


export default function Home() {
  return (
    <FlagProvider>
      <div className={`${bebas.variable} flex flex-col min-h-screen w-full bg-background dark:bg-background overflow-x-hidden`}>
        <Header />
        <main className="flex flex-col h-full w-full pt-5">
          <FlagCounter count={1} />
          <CaptureTheFlag />
          <HowToPlay />
          <PrivacyChallenge />
        </main>
      </div>
    </FlagProvider>
  );
}
