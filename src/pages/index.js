// import { Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
import Header from "@/components/header";


export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen bg-background dark:bg-background">
      <Header />
      <main className="flex h-full w-full p-5">
        
      </main>
    </div>
  );
}
