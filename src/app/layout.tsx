import { Providers } from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/lib/font';
import { ThemeProvider } from '@/components/layout/ThemeToggle/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import './globals.css';
import './theme.css';

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
  title: 'Lean Tools - Manufacturing Efficiency Dashboard',
  description:
    'Real-time monitoring and analytics for production optimization across all manufacturing cells and operations. Track machine cycles, identify bottlenecks, and measure efficiency.',
  keywords: [
    'manufacturing',
    'efficiency',
    'dashboard',
    'lean tools',
    'production',
    'analytics',
    'operations'
  ],
  authors: [{ name: 'Lean Tools Team' }],
  creator: 'Lean Tools',
  publisher: 'Lean Tools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL('https://lean-tools.vercel.app/welcome'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lean-tools.vercel.app/welcome',
    title: 'Lean Tools - Manufacturing Efficiency Dashboard',
    description:
      'Real-time monitoring and analytics for production optimization across all manufacturing cells and operations.',
    siteName: 'Lean Tools',
    images: [
      {
        url: 'https://lean-tools.vercel.app/leantools.png',
        width: 1200,
        height: 630,
        alt: 'Lean Tools - Manufacturing Efficiency Dashboard',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lean Tools - Manufacturing Efficiency Dashboard',
    description:
      'Real-time monitoring and analytics for production optimization across all manufacturing cells and operations.',
    images: ['https://lean-tools.vercel.app/leantools.png'],
    creator: '@leantools',
    site: '@leantools'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code'
  }
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isScaled = activeThemeValue?.endsWith('-scaled');

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Additional meta tags for better cross-platform compatibility */}
        <meta
          name='image'
          content='https://lean-tools.vercel.app/leantools.png'
        />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta
          name='twitter:image:alt'
          content='Lean Tools - Manufacturing Efficiency Dashboard'
        />

        {/* LinkedIn Open Graph */}
        <meta
          property='og:image:secure_url'
          content='https://lean-tools.vercel.app/leantools.png'
        />
        <meta property='og:image:type' content='image/png' />

        {/* WhatsApp and other platforms */}
        <meta
          property='og:image'
          content='https://lean-tools.vercel.app/leantools.png'
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body
        className={cn(
          'bg-background overflow-hidden overscroll-none font-sans antialiased',
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : '',
          fontVariables
        )}
      >
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <Providers activeThemeValue={activeThemeValue as string}>
              <Toaster />
              {children}
            </Providers>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
