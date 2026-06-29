import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopAnnouncement from "@/components/reuseble-components/TopAnnouncement";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Attendance ",
  description: "A simple attendance management system ",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}
      >
        <TopAnnouncement
          message="From Now employees who need an advance payment, he/she should enter the required amount in the Advance tab. Thank You."
        />
        {children}
      </body>
    </html>
  );
}
