import { Geist, Geist_Mono } from "next/font/google";
import { Bebas_Neue } from 'next/font/google';
import { FlagProvider } from "@/hooks/flagContext";
import dynamic from 'next/dynamic'
import Skeleton from "react-loading-skeleton";

import CaptureTheFlag from "@/components/Sections/welcomeSection";
import HowToPlay from "@/components/Sections/howToPlay";
import FlagCounter from "@/components/flagsCounter";

const LazyPrivacyChallenge = dynamic(() => import('@/components/Sections/privacyPolicy'), {
  loading: () => <Skeleton count={1} width={100} height={60} />,
  ssr: false,
});

const LazyCryptoChallenge = dynamic(() => import('@/components/Sections/cryptoChallenge'), {
  loading: () => <Skeleton count={1} width={100} height={60} />,
  ssr: false,
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
});


export default function Home() {
  return (
    <FlagProvider>
      <div className={`${bebas.variable} flex flex-col min-h-screen w-full bg-background dark:bg-background overflow-x-hidden`}>
        <main className="flex flex-col h-full w-full pt-5">
          <FlagCounter count={1} />
          <CaptureTheFlag />
          <HowToPlay />
          <LazyPrivacyChallenge />
          <LazyCryptoChallenge />
        </main>
      </div>
    </FlagProvider>
  );
}
