"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function SupabaseListener() {
  const router = useRouter()

  useEffect(() => {
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
          router.refresh()
        } else if (event === "SIGNED_OUT") {
          router.push("/")
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error("Error in auth state change listener:", error)
    }
  }, [router])

  return null
}

