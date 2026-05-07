import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { ProductProvider } from "@/context/ProductProvider";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowAI Nepal - Premium AI Tools, Pay in NPR",
  description:
    "Access ChatGPT and premium AI tools using eSewa, Khalti or IME Pay. No international card needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ProductProvider>
            {children}
            <MobileBottomNav />
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
