import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from './components/theme-provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Token Counter - Lightweight AI Message Token Calculator",
  description: "A simple tool for counting tokens in AI messages and conversations. Supports Claude, Gemini, and other AI models.",
  keywords: "AI tokens, token counter, Claude tokens, Gemini tokens, AI message calculator, token calculator",
  authors: [{ name: "Uladzislau Radkevich", url: "https://ulad.dev" }],
  creator: "Uladzislau Radkevich",
  publisher: "Uladzislau Radkevich",
  metadataBase: new URL('https://tokens.ulad.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tokens.ulad.dev',
    siteName: 'Token Counter',
    title: 'Token Counter - Lightweight AI Message Token Calculator',
    description: 'A simple tool for counting tokens in AI messages and conversations. Supports Claude, Gemini, and other AI models.',
  },
  twitter: {
    card: 'summary',
    title: 'Token Counter - Lightweight AI Message Token Calculator',
    description: 'A simple tool for counting tokens in AI messages and conversations. Supports Claude, Gemini, and other AI models.',
    creator: '@ulad_dev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Token Counter",
            "description": "A professional tool for counting tokens in AI messages and conversations. Supports Claude, Gemini, and other AI models.",
            "url": "https://tokens.ulad.dev",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Person",
              "name": "Uladzislau Radkevich",
              "url": "https://ulad.dev"
            },
            "featureList": [
              "Count tokens for AI messages",
              "Support for Claude AI models",
              "Support for Gemini AI models",
              "Real-time token calculation",
              "Multiple message formats",
              "Dark and light theme support"
            ]
          })
        }}
      />
    </head>
    <body
      className={`${geistSans.variable} font-sans antialiased`}
    >
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
    </body>
    </html>
  );
}
