import type { Metadata } from "next";
import { Outfit, Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CharGen AI — AI 3D Character Generator Platform",
  description: "Create stunning 2D/3D characters with AI. Export to GLB, FBX, OBJ for game development, animation, VTuber, Roblox, Unity, and Unreal Engine.",
  keywords: ["AI character generator", "3D character", "game assets", "VTuber", "Roblox", "Unity"],
  openGraph: {
    title: "CharGen AI — AI 3D Character Generator",
    description: "Create stunning AI-powered game characters in seconds",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", outfit.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <AuthModal />
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(13,0,16,0.95)',
              border: '1px solid rgba(134,4,148,0.4)',
              color: '#fff',
              backdropFilter: 'blur(20px)',
              zIndex: 99999,
            },
          }}
        />
      </body>
    </html>
  );
}
