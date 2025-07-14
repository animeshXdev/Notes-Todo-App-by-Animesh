import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import FloatingToggle from "@/components/FloatingToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.tsx or app/layout.ts
export const metadata : Metadata = {
  title: 'Notes / Todo App by Animesh',
  description: 'A beautifully crafted Notes & ToDo App with authentication, built using Next.js, MongoDB, and ShadCN UI.',
  icons: {
    icon: '/favicon.ico',
  },
  
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
             {children}
         <Toaster position="top-center" />
         <FloatingToggle />
          </ThemeProvider>
       
      </body>
    </html>
  );
}
