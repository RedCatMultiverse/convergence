import { Geist, Geist_Mono } from "next/font/google";
import ThemeRegistry from '@/components/theme/ThemeRegistry';
import AuthProvider from '@/components/auth/Provider';
import { Copyright } from '@/components/ui/Copyright';
import "./globals.css";
import { Open_Sans, Montserrat } from 'next/font/google';
import NavbarContainer from '@/components/layout/NavbarContainer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata = {
  title: "Red Cat Multiverse",
  description: "Level up your soft skills with the Red Cat Multiverse",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} ${montserrat.variable}`}>
        <AuthProvider>
          <ThemeRegistry>
            <div style={{ 
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <NavbarContainer />
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Copyright sx={{ py: 4 }} />
            </div>
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
