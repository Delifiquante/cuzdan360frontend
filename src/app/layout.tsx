
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';
import { MainNavbar } from '@/components/layout/main-navbar';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // metadata can not be used in client components
  // but we can set the document title
  if (typeof document !== 'undefined') {
    document.title = 'Cüzdan360';
  }

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background">
        <GoogleOAuthProvider clientId={googleClientId}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

