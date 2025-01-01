import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/contexts/WalletContext"
import { Toaster } from 'react-hot-toast';
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TRON Wallet",
  description: "A decentralized wallet for the TRON blockchain",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-[#F6B17A]")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            {children}
            <Toaster position="bottom-right" />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

