import "@/styles/globals.css";
import { Bebas_Neue } from 'next/font/google';
import { FlagProvider } from "@/hooks/flagContext";
import NProgress from 'nprogress'
import Router from 'next/router'
import 'nprogress/nprogress.css'
import Header from "@/components/header.js";

NProgress.configure({ showSpinner: true }) // optional

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
});

export default function App({ Component, pageProps }) {
  return (
    <FlagProvider>
      <main className={`${bebas.variable} font-sans`}>
        <Header />
        <Component {...pageProps} />
      </main>
    </FlagProvider>
);
}
