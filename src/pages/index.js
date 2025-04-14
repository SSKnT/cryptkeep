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
import CaptureTheFlag from "@/components/welcomeSection";


export default function Home() {
  return (
    <div className={`${bebas.variable} flex flex-col h-screen w-screen bg-background dark:bg-background overflow-hidden`}>
      <Header />
      <main className="flex h-full w-full py-5">
        <CaptureTheFlag />
      </main>
    </div>
  );
}
