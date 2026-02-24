import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ResumAI - AI-Powered Resume Builder",
  description: "Craft professional, ATS-optimized resumes with AI-powered suggestions and cinematic design. Build your job-winning resume today.",
  keywords: ["resume builder", "AI resume", "ATS resume", "professional resume", "CV builder"],
  openGraph: {
    title: "ResumAI - AI-Powered Resume Builder",
    description: "Craft professional, ATS-optimized resumes with AI-powered suggestions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
