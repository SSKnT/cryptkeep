import "@/styles/globals.css";
import { Bebas_Neue } from 'next/font/google';
import { FlagProvider } from "@/hooks/flagContext";


const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
});

export default function App({ Component, pageProps }) {
  return (
    <FlagProvider>
      <main className={`${bebas.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </FlagProvider>
);
}
