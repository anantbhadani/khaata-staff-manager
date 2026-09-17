import type { Metadata } from "next";
import { Manrope, Fraunces } from "next/font/google";
import { ThemeHandler } from "@/components/ThemeHandler";
import { SplashScreen } from "@/components/ui/SplashScreen";
import "./globals.css";

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme') || 'system';
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Khaata",
  description: "Staff Attendance & Salary Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${manrope.variable} ${fraunces.variable} antialiased font-sans`}
      >
        <div className="w-full max-w-[500px] mx-auto h-[100dvh] relative flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.05)] bg-paper overflow-hidden">
          <ThemeHandler />
          <SplashScreen />
          {children}
        </div>
      </body>
    </html>
  );
}
