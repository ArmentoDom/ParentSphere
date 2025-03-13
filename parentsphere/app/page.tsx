"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Baby, Moon, Utensils, BabyIcon as Diaper, BookOpen, DollarSign, Menu, Star, Wand2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { differenceInMonths } from "date-fns"
import { SleepTracker } from "@/components/sleep-tracker"
import { FeedingTracker } from "@/components/feeding-tracker"
import { DiaperTracker } from "@/components/diaper-tracker"
import { supabase } from "@/lib/supabase"
import { Scrapbook } from "@/components/scrapbook"
import { Link2Icon as Baby2 } from "lucide-react"
import { MilestoneTracker } from "@/components/milestone-tracker"
import { NurseryDesignTool } from "@/components/nursery-design-tool"
import { BudgetingPage } from "@/components/budgeting-page"
import { ProfileCustomization } from "@/components/profile-customization"
import { InfoCard } from "@/components/info-card"
import { AIInsightCard } from "@/components/ai-insight-card"
import type React from "react"
import { Pencil } from "lucide-react"
import { LayoutDashboard, PiggyBank, Book, User } from "lucide-react"
import { css, keyframes } from "@emotion/react"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface BabyData {
  name: string
  birthdate: string
  gender: string
  weight: string
  height: string
}

interface UserData {
  id: string
  email: string
}

export default function Home() {
  const { toast } = useToast()
  const [step, setStep] = useState<
    | "landing"
    | "signup"
    | "signin"
    | "form"
    | "dashboard"
    | "budgeting"
    | "scrapbook"
    | "sleep"
    | "feeding"
    | "diapers"
    | "milestones"
    | "nursery-design"
    | "profile-customization"
  >("landing")
  const [babyData, setBabyData] = useState<BabyData | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [sleepData, setSleepData] = useState({ totalHours: 0, lastSleep: null })
  const [feedingData, setFeedingData] = useState({ totalFeedings: 0, lastFeeding: null })
  const [diaperData, setDiaperData] = useState({ totalChanges: 0, lastChange: null })
  const [milestoneData, setMilestoneData] = useState({ totalAchieved: 0, latestMilestone: "" })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking session:", error)
          return
        }

        if (session) {
          setUser({ id: session.user.id, email: session.user.email! })

          const { data: babyData, error: babyError } = await supabase
            .from("babies")
            .select("*")
            .eq("user_id", session.user.id)
            .single()

          if (babyError) {
            console.error("Error fetching baby data:", babyError)
          } else if (babyData) {
            console.log("Baby data fetched:", babyData)
            setBabyData(babyData)
            setStep("dashboard")
          } else {
            setStep("form")
          }
        }
      } catch (error) {
        console.error("Session check error:", error)
        toast({
          title: "Authentication Error",
          description: "There was a problem with your authentication. Please try signing in again.",
          variant: "destructive",
        })
      }
    }

    checkSession()
  }, [toast])

  useEffect(() => {
    const fetchSleepData = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("sleep_entries")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false })
            .limit(7)

          if (error) throw error

          if (data && data.length > 0) {
            const totalHours = data.reduce((sum, entry) => sum + entry.duration, 0)
            setSleepData({ totalHours, lastSleep: new Date(data[0].date + "T" + data[0].wake_time) })
          }
        } catch (error) {
          console.error("Error fetching sleep data:", error)
        }
      }
    }

    const fetchFeedingData = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("feeding_entries")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false })
            .limit(20)

          if (error) throw error

          if (data && data.length > 0) {
            setFeedingData({ totalFeedings: data.length, lastFeeding: new Date(data[0].date + "T" + data[0].time) })
          }
        } catch (error) {
          console.error("Error fetching feeding data:", error)
        }
      }
    }

    const fetchDiaperData = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("diaper_entries")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false })
            .limit(20)

          if (error) throw error

          if (data && data.length > 0) {
            setDiaperData({ totalChanges: data.length, lastChange: new Date(data[0].date + "T" + data[0].time) })
          }
        } catch (error) {
          console.error("Error fetching diaper data:", error)
        }
      }
    }

    const fetchMilestoneData = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("milestones")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false })
            .limit(20)

          if (error) throw error

          if (data && data.length > 0) {
            setMilestoneData({ totalAchieved: data.length, latestMilestone: data[0].title })
          }
        } catch (error) {
          console.error("Error fetching milestone data:", error)
        }
      }
    }

    if (user) {
      fetchSleepData()
      fetchFeedingData()
      fetchDiaperData()
      fetchMilestoneData()
    }
  }, [user])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email! })
        setStep("form")
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        })
      } else {
        throw new Error("Failed to create user")
      }
    } catch (error: any) {
      console.error("Error signing up:", error)
      toast({
        title: "Sign up failed",
        description: error.message || "Error signing up. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign-in error:", error)
        throw error
      }

      if (data.user) {
        console.log("Sign-in successful:", data.user)
        setUser({ id: data.user.id, email: data.user.email! })

        const { data: babyData, error: babyError } = await supabase
          .from("babies")
          .select("*")
          .eq("user_id", data.user.id)
          .single()

        if (babyError) {
          console.error("Error fetching baby data:", babyError)
        } else if (babyData) {
          console.log("Baby data fetched:", babyData)
          setBabyData(babyData)
          setStep("dashboard")
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          })
        } else {
          setStep("form")
        }
      } else {
        throw new Error("Sign-in successful but no user data returned")
      }
    } catch (error: any) {
      console.error("Error signing in:", error)
      toast({
        title: "Sign in failed",
        description: error.message || "Error signing in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      birthdate: formData.get("birthdate") as string,
      gender: formData.get("gender") as string,
      weight: formData.get("weight") as string,
      height: formData.get("height") as string,
    }

    try {
      const weight = formData.get("weight") as string
      const height = formData.get("height") as string

      const babyDataToSet = {
        name: data.name,
        birthdate: data.birthdate,
        gender: data.gender,
        weight: Number.parseFloat(weight),
        height: Number.parseFloat(height),
      }
      setBabyData(babyDataToSet)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        throw new Error(`Authentication error: ${userError.message}`)
      }

      if (!user) {
        throw new Error("No authenticated user found")
      }

      const { data: babyData, error: insertError } = await supabase
        .from("babies")
        .insert([
          {
            name: data.name,
            birthdate: data.birthdate,
            gender: data.gender,
            weight: Number.parseFloat(weight),
            height: Number.parseFloat(height),
            user_id: user.id,
          },
        ])
        .select()

      if (insertError) {
        throw new Error(`Error inserting baby data: ${insertError.message}`)
      }

      if (!babyData || babyData.length === 0) {
        throw new Error("Baby data was not inserted successfully")
      }

      console.log("Baby data inserted successfully:", babyData)
      toast({
        title: "Profile created",
        description: `${data.name}'s profile has been created successfully!`,
      })
      setStep("dashboard")
    } catch (error: any) {
      console.error("Error saving baby information:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while saving baby information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAge = (birthdate: string) => {
    const months = differenceInMonths(new Date(), new Date(birthdate))
    return `${months} month${months !== 1 ? "s" : ""} old`
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 text-gray-800">
        <AnimatePresence mode="wait">
          {step === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-300 to-blue-200"
            >
              <div className="container mx-auto px-4 py-16 space-y-32">
                {/* Hero Section */}
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center space-y-8"
                >
                  <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    Parent<span className="text-pink-500">Sphere</span>
                  </h1>
                  <p className="text-3xl font-light text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    Embrace the journey of parenthood with our innovative companion app
                  </p>
                  <Button
                    size="lg"
                    className="text-xl px-10 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-105 rounded-full shadow-lg"
                    onClick={() => setStep("signup")}
                  >
                    Start Your Parenting Adventure
                  </Button>
                </motion.section>

                {/* Features Section */}
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-32"
                >
                  <h2 className="text-5xl font-bold text-center text-purple-700 mb-16">Discover ParentSphere</h2>

                  {/* Tracking Feature */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12"
                  >
                    <div className="w-full md:w-1/2">
                      <h3 className="text-4xl font-bold text-purple-600 mb-6">Smart Tracking</h3>
                      <p className="text-2xl text-gray-700 mb-6 leading-relaxed">
                        Effortlessly monitor your baby's daily routines and milestones with our intuitive tracking
                        system.
                      </p>
                      <ul className="text-xl text-gray-600 space-y-4">
                        <li className="flex items-center">
                          <Moon className="w-6 h-6 mr-2 text-purple-500" />
                          Sleep patterns visualization
                        </li>
                        <li className="flex items-center">
                          <Utensils className="w-6 h-6 mr-2 text-purple-500" />
                          Feeding schedule management
                        </li>
                        <li className="flex items-center">
                          <Diaper className="w-6 h-6 mr-2 text-purple-500" />
                          Diaper change logging
                        </li>
                      </ul>
                    </div>
                    <div className="w-full md:w-1/2">
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Baby Tracking"
                        className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </motion.div>

                  {/* Scrapbook Feature */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row-reverse items-center space-y-8 md:space-y-0 md:space-x-12 md:space-x-reverse"
                  >
                    <div className="w-full md:w-1/2">
                      <h3 className="text-4xl font-bold text-pink-600 mb-6">Digital Scrapbook</h3>
                      <p className="text-2xl text-gray-700 mb-6 leading-relaxed">
                        Capture and cherish your little one's precious moments in a beautiful, interactive digital
                        format.
                      </p>
                      <ul className="text-xl text-gray-600 space-y-4">
                        <li className="flex items-center">
                          <Star className="w-6 h-6 mr-2 text-pink-500" />
                          Milestone recording
                        </li>
                        <li className="flex items-center">
                          <BookOpen className="w-6 h-6 mr-2 text-pink-500" />
                          Photo and video uploads
                        </li>
                        <li className="flex items-center">
                          <Wand2 className="w-6 h-6 mr-2 text-pink-500" />
                          Customizable layouts
                        </li>
                      </ul>
                    </div>
                    <div className="w-full md:w-1/2">
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Digital Scrapbook"
                        className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </motion.div>

                  {/* Budgeting Feature */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12"
                  >
                    <div className="w-full md:w-1/2">
                      <h3 className="text-4xl font-bold text-purple-600 mb-6">Smart Budgeting</h3>
                      <p className="text-2xl text-gray-700 mb-6 leading-relaxed">
                        Plan your family's future with our intelligent budgeting tools and baby essentials finder.
                      </p>
                      <ul className="text-xl text-gray-600 space-y-4">
                        <li className="flex items-center">
                          <DollarSign className="w-6 h-6 mr-2 text-purple-500" />
                          Expense tracking
                        </li>
                        <li className="flex items-center">
                          <Baby className="w-6 h-6 mr-2 text-purple-500" />
                          Budget recommendations
                        </li>
                        <li className="flex items-center">
                          <Wand2 className="w-6 h-6 mr-2 text-purple-500" />
                          Cost-saving tips
                        </li>
                      </ul>
                    </div>
                    <div className="w-full md:w-1/2">
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Family Budgeting"
                        className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </motion.div>

                  {/* Milestones Feature */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row-reverse items-center space-y-8 md:space-y-0 md:space-x-12 md:space-x-reverse"
                  >
                    <div className="w-full md:w-1/2">
                      <h3 className="text-4xl font-bold text-pink-600 mb-6">Milestone Tracker</h3>
                      <p className="text-2xl text-gray-700 mb-6 leading-relaxed">
                        Never miss a moment with our comprehensive milestone tracking system.
                      </p>
                      <ul className="text-xl text-gray-600 space-y-4">
                        <li className="flex items-center">
                          <Baby className="w-6 h-6 mr-2 text-pink-500" />
                          Age-based milestone suggestions
                        </li>
                        <li className="flex items-center">
                          <Star className="w-6 h-6 mr-2 text-pink-500" />
                          Customizable milestones
                        </li>
                        <li className="flex items-center">
                          <BookOpen className="w-6 h-6 mr-2 text-pink-500" />
                          Celebration reminders
                        </li>
                      </ul>
                    </div>
                    <div className="w-full md:w-1/2">
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Milestone Tracker"
                        className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </motion.div>

                  {/* Nursery Design Feature */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12"
                  >
                    <div className="w-full md:w-1/2">
                      <h3 className="text-4xl font-bold text-purple-600 mb-6">AI Nursery Designer</h3>
                      <p className="text-2xl text-gray-700 mb-6 leading-relaxed">
                        Create the perfect nursery with our AI-powered design tool.
                      </p>
                      <ul className="text-xl text-gray-600 space-y-4">
                        <li className="flex items-center">
                          <Wand2 className="w-6 h-6 mr-2 text-purple-500" />
                          Personalized design suggestions
                        </li>
                        <li className="flex items-center">
                          <Baby2 className="w-6 h-6 mr-2 text-purple-500" />
                          Virtual room visualization
                        </li>
                        <li className="flex items-center">
                          <Baby className="w-6 h-6 mr-2 text-purple-500" />
                          Product recommendations
                        </li>
                      </ul>
                    </div>
                    <div className="w-full md:w-1/2">
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="AI Nursery Designer"
                        className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </motion.div>
                </motion.section>

                {/* Call to Action */}
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center space-y-8"
                >
                  <h2 className="text-5xl font-bold text-purple-700">Ready to Start Your Journey?</h2>
                  <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    Join ParentSphere today and experience the joy of parenthood with our supportive community and
                    innovative tools.
                  </p>
                  <Button
                    size="lg"
                    className="text-xl px-10 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-105 rounded-full shadow-lg"
                    onClick={() => setStep("signup")}
                  >
                    Begin Your Parenting Adventure
                  </Button>
                </motion.section>
              </div>
            </motion.div>
          )}

          {step === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-300 to-blue-200 p-4"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div
                  css={[animateBlob]}
                  className="absolute left-1/4 top-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                ></div>
                <div
                  css={[animateBlob, animationDelay2000]}
                  className="absolute right-1/4 bottom-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                ></div>
                <div
                  css={[animateBlob, animationDelay4000]}
                  className="absolute left-1/3 bottom-1/3 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                ></div>
              </div>

              <div className="relative max-w-md w-full">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-5xl font-bold text-purple-800 mb-2">
                    Parent<span className="text-pink-600">Sphere</span>
                  </h2>
                  <p className="text-xl text-purple-700">Join us on your parenting journey</p>
                </motion.div>

                <Card className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl">
                  <CardContent className="p-8">
                    <form onSubmit={handleSignUp} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-lg font-medium text-purple-800">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="text-lg py-3 bg-white/50 border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800 placeholder-purple-400"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-lg font-medium text-purple-800">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="text-lg py-3 bg-white/50 border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800 placeholder-purple-400"
                          placeholder="Enter your password"
                        />
                      </div>
                      <div className="pt-2">
                        <Button
                          type="submit"
                          className="w-full text-lg py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing Up..." : "Sign Up"}
                        </Button>
                      </div>
                    </form>
                    <div className="mt-6 text-center">
                      <p className="text-purple-700">
                        Already have an account?{" "}
                        <Button
                          variant="link"
                          className="text-pink-600 hover:text-pink-700 font-semibold"
                          onClick={() => setStep("signin")}
                        >
                          Sign In
                        </Button>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 text-center"
                >
                  <Button
                    variant="ghost"
                    className="text-purple-700 hover:text-purple-800 font-medium"
                    onClick={() => setStep("landing")}
                  >
                    ← Back to Home
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === "signin" && (
            <motion.div
              key="signin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-300 to-blue-200 p-4"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div
                  css={[animateBlob]}
                  className="absolute left-1/4 top-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                ></div>
                <div
                  css={[animateBlob, animationDelay2000]}
                  className="absolute right-1/4 bottom-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                ></div>
                <div
                  css={[animateBlob, animationDelay4000]}
                  className="absolute left-1/3 bottom-1/3 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                ></div>
              </div>

              <div className="relative max-w-md w-full">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-5xl font-bold text-purple-800 mb-2">
                    Parent<span className="text-pink-600">Sphere</span>
                  </h2>
                  <p className="text-xl text-purple-700">Welcome back to your parenting journey</p>
                </motion.div>

                <Card className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl">
                  <CardContent className="p-8">
                    <form onSubmit={handleSignIn} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-lg font-medium text-purple-800">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="text-lg py-3 bg-white/50 border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800 placeholder-purple-400"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-lg font-medium text-purple-800">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="text-lg py-3 bg-white/50 border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800 placeholder-purple-400"
                          placeholder="Enter your password"
                        />
                      </div>
                      <div className="pt-2">
                        <Button
                          type="submit"
                          className="w-full text-lg py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing In..." : "Sign In"}
                        </Button>
                      </div>
                    </form>
                    <div className="mt-6 text-center">
                      <p className="text-purple-700">
                        Don't have an account?{" "}
                        <Button
                          variant="link"
                          className="text-pink-600 hover:text-pink-700 font-semibold"
                          onClick={() => setStep("signup")}
                        >
                          Sign Up
                        </Button>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 text-center"
                >
                  <Button
                    variant="ghost"
                    className="text-purple-700 hover:text-purple-800 font-medium"
                    onClick={() => setStep("landing")}
                  >
                    ←Back to Home
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="container mx-auto px-4 py-16"
            >
              <div className="max-w-md mx-auto">
                <h2 className="text-4xl font-bold text-center mb-8 text-purple-600">
                  Welcome to Parent<span className="text-pink-500">Sphere</span>
                </h2>
                <Card className="bg-white soft-shadow">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-lg text-gray-600">
                          Baby's Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          className="text-lg py-6 bg-gray-100 text-gray-800 placeholder-gray-400"
                          placeholder="Enter baby's name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthdate" className="text-lg text-gray-600">
                          Birth Date
                        </Label>
                        <Input
                          id="birthdate"
                          name="birthdate"
                          type="date"
                          required
                          className="text-lg py-6 bg-gray-100 text-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-lg text-gray-600">Gender</Label>
                        <RadioGroup name="gender" className="flex space-x-4" defaultValue="neutral">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="boy" id="boy" />
                            <Label htmlFor="boy" className="text-lg text-gray-600">
                              Boy
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="girl" id="girl" />
                            <Label htmlFor="girl" className="text-lg text-gray-600">
                              Girl
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="neutral" id="neutral" />
                            <Label htmlFor="neutral" className="text-lg text-gray-600">
                              Neutral
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight" className="text-lg text-gray-600">
                          Weight (lbs){" "}
                        </Label>
                        <Input
                          id="weight"
                          name="weight"
                          type="number"
                          step="0.1"
                          required
                          className="text-lg py-6 bg-gray-100 text-gray-800 placeholder-gray-400"
                          placeholder="Enter weight"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height" className="text-lg text-gray-600">
                          Height (inches)
                        </Label>
                        <Input
                          id="height"
                          name="height"
                          type="number"
                          step="0.1"
                          required
                          className="text-lg py-6 bg-gray-100 text-gray-800 placeholder-gray-400"
                          placeholder="Enter height"
                        />
                      </div>
                      <div className="flex space-x-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full text-lg py-6 text-purple-600 border-purple-300 hover:bg-purple-100"
                          onClick={() => setStep("landing")}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="w-full text-lg py-6 bg-purple-600 hover:bg-purple-700 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? "Submitting..." : "Start Tracking"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {step === "dashboard" && babyData && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-8"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-purple-700"
                  >
                    Parent<span className="text-pink-600">Sphere</span>
                  </motion.h1>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-purple-700 border-purple-400 hover:bg-purple-100 transition-colors duration-200"
                      >
                        <Menu className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-white/80 backdrop-blur-sm border border-purple-200 shadow-lg rounded-xl p-2"
                      asChild
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <DropdownMenuItem
                          onClick={() => setStep("dashboard")}
                          className="flex items-center px-3 py-2 text-purple-700 hover:bg-purple-100 rounded-md transition-colors duration-200"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStep("budgeting")}
                          className="flex items-center px-3 py-2 text-purple-700 hover:bg-purple-100 rounded-md transition-colors duration-200"
                        >
                          <PiggyBank className="mr-2 h-4 w-4" />
                          Budgeting
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStep("scrapbook")}
                          className="flex items-center px-3 py-2 text-purple-700 hover:bg-purple-100 rounded-md transition-colors duration-200"
                        >
                          <Book className="mr-2 h-4 w-4" />
                          Scrapbook
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStep("milestones")}
                          className="flex items-center px-3 py-2 text-purple-700 hover:bg-purple-100 rounded-md transition-colors duration-200"
                        >
                          <Star className="mr-2 h-4 w-4" />
                          Milestones
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStep("nursery-design")}
                          className="flex items-center px-3 py-2 text-purple-700 hover:bg-purple-100 rounded-md transition-colors duration-200"
                        >
                          <Wand2 className="mr-2 h-4 w-4" />
                          Nursery Design
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStep("profile-customization")}
                          className="flex items-center px-3 py-2 text-purple-700 hover:bg-purple-100 rounded-md transition-colors duration-200"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                      </motion.div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Baby Info Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center">
                    <Baby className="w-20 h-20 text-pink-500" />
                    <motion.div
                      className="absolute -bottom-2 -right-2 bg-pink-500 rounded-full p-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setStep("profile-customization")}
                    >
                      <Pencil className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-purple-700"
                  >
                    {babyData.name}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-gray-700"
                  >
                    {calculateAge(babyData.birthdate)}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex space-x-8"
                  >
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-700">{babyData.height}"</p>
                      <p className="text-sm text-gray-600">Length</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-700">{babyData.weight} lbs</p>
                      <p className="text-sm text-gray-600">Weight</p>
                    </div>
                  </motion.div>
                </div>

                {/* Tracking Cards and AI Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InfoCard
                    icon={Moon}
                    title="Sleep"
                    value={`${sleepData.totalHours.toFixed(1)} hours`}
                    subValue={sleepData.lastSleep ? `Last: ${formatTimeAgo(sleepData.lastSleep)}` : "No data"}
                    color="bg-indigo-200 text-indigo-700"
                    onClick={() => setStep("sleep")}
                  />
                  <InfoCard
                    icon={Utensils}
                    title="Feeding"
                    value={`${feedingData.totalFeedings} times`}
                    subValue={feedingData.lastFeeding ? `Last: ${formatTimeAgo(feedingData.lastFeeding)}` : "No data"}
                    color="bg-green-200 text-green-700"
                    onClick={() => setStep("feeding")}
                  />
                  <InfoCard
                    icon={Diaper}
                    title="Diapers"
                    value={`${diaperData.totalChanges} changes`}
                    subValue={diaperData.lastChange ? `Last: ${formatTimeAgo(diaperData.lastChange)}` : "No data"}
                    color="bg-yellow-200 text-yellow-700"
                    onClick={() => setStep("diapers")}
                  />
                  <InfoCard
                    icon={Star}
                    title="Milestones"
                    value={`${milestoneData.totalAchieved} achieved`}
                    subValue={`Latest: ${milestoneData.latestMilestone || "None"}`}
                    color="bg-pink-200 text-pink-700"
                    onClick={() => setStep("milestones")}
                  />
                  <InfoCard
                    icon={Wand2}
                    title="Nursery Design"
                    value="In Progress"
                    subValue="50% complete"
                    color="bg-purple-200 text-purple-700"
                    onClick={() => setStep("nursery-design")}
                  />

                  {/* AI Insights Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="col-span-full"
                  >
                    <AIInsightCard
                      insights={[
                        "Next feeding might be due in about 2 hours.",
                        "A nap may be needed soon based on recent sleep patterns.",
                        "Diaper changes are on track with the usual routine.",
                        `${babyData.name} might be ready for tummy time exercises.`,
                        "Consider reading a story before the next nap for better sleep.",
                      ]}
                    />
                  </motion.div>
                </div>

                {/* AI Insights Section */}
              </div>
            </motion.div>
          )}

          {step === "budgeting" && (
            <motion.div
              key="budgeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-8"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-purple-600">
                    Parent<span className="text-pink-500">Sphere</span> - Budgeting
                  </h1>
                  <Button
                    variant="outline"
                    onClick={() => setStep("dashboard")}
                    className="text-purple-600 border-purple-300 hover:bg-purple-100"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <BudgetingPage />
              </div>
            </motion.div>
          )}

          {step === "scrapbook" && (
            <motion.div
              key="scrapbook"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-8"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-purple-600">
                    Parent<span className="text-pink-500">Sphere</span> - Scrapbook
                  </h1>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-purple-600 border-purple-300 hover:bg-purple-100"
                      >
                        <Menu className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white text-gray-800">
                      <DropdownMenuItem onClick={() => setStep("dashboard")} className="hover:bg-purple-100">
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStep("budgeting")} className="hover:bg-purple-100">
                        Budgeting
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStep("scrapbook")} className="hover:bg-purple-100">
                        Scrapbook
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>{" "}
                </div>
                <Scrapbook />
              </div>
            </motion.div>
          )}

          {step === "sleep" && (
            <motion.div
              key="sleep"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-8 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-purple-700">
                    Parent<span className="text-pink-600">Sphere</span> - Sleep Tracking
                  </h1>
                  <Button
                    variant="outline"
                    onClick={() => setStep("dashboard")}
                    className="text-purple-600 border-purple-300 hover:bg-purple-100"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <SleepTracker />
              </div>
            </motion.div>
          )}

          {step === "feeding" && (
            <motion.div
              key="feeding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-8 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-purple-700">
                    Parent<span className="text-pink-600">Sphere</span> - Feeding Tracking
                  </h1>
                  <Button
                    variant="outline"
                    onClick={() => setStep("dashboard")}
                    className="text-purple-600 border-purple-300 hover:bg-purple-100"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <FeedingTracker />
              </div>
            </motion.div>
          )}

          {step === "diapers" && (
            <motion.div
              key="diapers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-8 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-purple-700">
                    Parent<span className="text-pink-600">Sphere</span> - Diaper Tracking
                  </h1>
                  <Button
                    variant="outline"
                    onClick={() => setStep("dashboard")}
                    className="text-purple-600 border-purple-300 hover:bg-purple-100"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <DiaperTracker />
              </div>
            </motion.div>
          )}

          {step === "milestones" && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-8"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-purple-700">
                    Parent<span className="text-pink-600">Sphere</span> - Milestones
                  </h1>
                  <Button
                    variant="outline"
                    onClick={() => setStep("dashboard")}
                    className="text-purple-600 border-purple-300 hover:bg-purple-100"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <MilestoneTracker />
              </div>
            </motion.div>
          )}

          {step === "nursery-design" && (
            <motion.div
              key="nursery-design"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-8"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-purple-700">
                    Parent<span className="text-pink-600">Sphere</span> - Nursery Design
                  </h1>
                  <Button
                    variant="outline"
                    onClick={() => setStep("dashboard")}
                    className="text-purple-600 border-purple-300 hover:bg-purple-100"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <NurseryDesignTool />
              </div>
            </motion.div>
          )}

          {step === "profile-customization" && (
            <motion.div
              key="profile-customization"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-8"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-purple-700">
                    Parent<span className="text-pink-600">Sphere</span> - Profile Customization
                  </h1>
                  <Button
                    variant="outline"
                    onClick={() => setStep("dashboard")}
                    className="text-purple-600 border-purple-300 hover:bg-purple-100"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <ProfileCustomization />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

const blob = keyframes`
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
`

const animateBlob = css`
  animation: ${blob} 7s infinite;
`

const animationDelay2000 = css`
  animation-delay: 2s;
`

const animationDelay4000 = css`
  animation-delay: 4s;
`

function formatTimeAgo(date: Date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const days = Math.floor(diffInSeconds / 86400)
  const hours = Math.floor((diffInSeconds % 86400) / 3600)
  const minutes = Math.floor((diffInSeconds % 3600) / 60)

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else {
    return "Just now"
  }
}

