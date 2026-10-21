import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { getPortfolio, siteUrl } from '@/lib/data';
import AnalyticsTracker from '@/components/site/AnalyticsTracker';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();
  const title = profile.seoTitle || `${profile.name} | Portfolio`;
  const description = profile.seoDescription || profile.tagline;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s | ${profile.name}` },
    description,
    keywords: ['Abhishek Dass', 'Software Engineer', 'Motorsport', 'Formula 1', 'Data Science', 'AI', 'Telemetry', 'Portfolio'],
    authors: [{ name: profile.name }],
    alternates: { canonical: '/' },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: profile.name,
      images: [{ url: '/images/og.jpg', width: 1200, height: 630, alt: profile.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/og.jpg'] },
    icons: { icon: '/icon.svg' },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0d10' },
  ],
  colorScheme: 'light dark',
};

// Runs before first paint: restores the saved theme (defaults to dark mode) and marks JS as available.
const bootScript = `(function(){try{var t=localStorage.getItem('theme');if(!t||(t!=='light'&&t!=='dark')){t='dark';localStorage.setItem('theme','dark')}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}document.documentElement.classList.add('js')})();`;

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-HXDTTFVD9H';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
