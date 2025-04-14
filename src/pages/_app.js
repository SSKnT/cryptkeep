import "@/styles/globals.css";
import { Bebas_Neue } from 'next/font/google';

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${bebas.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
);
}
