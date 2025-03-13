import type React from "react"
import { Nunito } from "next/font/google"
import "./globals.css"
import SupabaseListener from "@/components/supabase-listener"
import { Toaster } from "@/components/ui/toaster"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
})

export const metadata = {
  title: "ParentSphere - Smart Baby Tracking & Planning",
  description: "Track your baby's daily routine while creating precious memories with AI-powered insights",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans`}>
        <SupabaseListener />
        {children}
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'