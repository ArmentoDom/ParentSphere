"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO, subDays } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BabyIcon, Droplet, Loader2, PlusCircle } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { supabase } from "@/lib/supabase"

interface DiaperEntry {
  id: number
  user_id: string
  date: string
  time: string
  type: "wet" | "soiled" | "both"
  created_at: string
}

export function DiaperTracker() {
  const [diaperEntries, setDiaperEntries] = useState<DiaperEntry[]>([])
  const [newEntry, setNewEntry] = useState<Partial<DiaperEntry>>({
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    type: "wet",
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUserAndEntries()
  }, [])

  const fetchUserAndEntries = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) {
      console.error("Error fetching user:", userError)
      return
    }

    if (user) {
      setUserId(user.id)
      fetchDiaperEntries(user.id)
    } else {
      console.error("No authenticated user found")
    }
  }

  const fetchDiaperEntries = async (userId: string) => {
    const { data, error } = await supabase
      .from("diaper_entries")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .order("time", { ascending: false })
      .limit(7)

    if (error) {
      console.error("Error fetching diaper entries:", error)
    } else {
      setDiaperEntries(data || [])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEntry((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: "wet" | "soiled" | "both") => {
    setNewEntry((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      console.error("No authenticated user")
      return
    }
    setIsLoading(true)
    if (newEntry.date && newEntry.time && newEntry.type) {
      const { data, error } = await supabase
        .from("diaper_entries")
        .insert([
          {
            user_id: userId,
            date: newEntry.date,
            time: newEntry.time,
            type: newEntry.type,
          },
        ])
        .select()

      if (error) {
        console.error("Error inserting diaper entry:", error)
      } else {
        await fetchDiaperEntries(userId)
        setNewEntry({
          date: format(new Date(), "yyyy-MM-dd"),
          time: format(new Date(), "HH:mm"),
          type: "wet",
        })
      }
    }
    setIsLoading(false)
  }

  const getTotalDiaperChanges = () => {
    return diaperEntries.length
  }

  const getLastDiaperChange = () => {
    if (diaperEntries.length === 0) return "N/A"
    const lastEntry = diaperEntries[0]
    return `${format(parseISO(lastEntry.date), "MMM dd")} at ${lastEntry.time}`
  }

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i)
    const formattedDate = format(date, "MMM dd")
    const entriesForDay = diaperEntries.filter((entry) => format(parseISO(entry.date), "MMM dd") === formattedDate)
    return {
      date: formattedDate,
      wet: entriesForDay.filter((entry) => entry.type === "wet").length,
      soiled: entriesForDay.filter((entry) => entry.type === "soiled").length,
      both: entriesForDay.filter((entry) => entry.type === "both").length,
      total: entriesForDay.length,
    }
  }).reverse()

  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-lg border-2 border-purple-200 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <CardTitle className="text-2xl font-bold flex items-center space-x-2">
            <BabyIcon className="w-8 h-8" />
            <span>Diaper Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium text-gray-600">
                  Date
                </Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={newEntry.date}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-sm font-medium text-gray-600">
                  Time
                </Label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  value={newEntry.time}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Type</Label>
                <RadioGroup
                  value={newEntry.type}
                  onValueChange={(value: "wet" | "soiled" | "both") => handleTypeChange(value)}
                  className="flex space-x-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wet" id="wet" />
                    <Label htmlFor="wet">Wet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="soiled" id="soiled" />
                    <Label htmlFor="soiled">Soiled</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Both</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Entry...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Diaper Entry
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white shadow-lg border-2 border-purple-200 rounded-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-purple-700">Diaper Change Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-sm text-purple-600">Total Changes</p>
                <p className="text-3xl font-bold text-purple-700 flex items-center">
                  <BabyIcon className="w-6 h-6 mr-2 text-pink-500" />
                  {getTotalDiaperChanges()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-600">Last Change</p>
                <p className="text-xl font-bold text-purple-700 flex items-center">
                  <Droplet className="w-6 h-6 mr-2 text-blue-500" />
                  {getLastDiaperChange()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-2 border-purple-200 rounded-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-purple-700">Recent Diaper Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {diaperEntries.slice(0, 5).map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-4 p-2 bg-purple-50 rounded-md"
                  >
                    <BabyIcon className="w-6 h-6 text-pink-500" />
                    <div>
                      <p className="font-semibold text-purple-700">{format(parseISO(entry.date), "MMM dd, yyyy")}</p>
                      <p className="text-sm text-purple-600">
                        {entry.time} - {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg border-2 border-purple-200 rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-700">Diaper Change Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSoiled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBoth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "#6B46C1" }} tickLine={{ stroke: "#6B46C1" }} />
                <YAxis tick={{ fill: "#6B46C1" }} tickLine={{ stroke: "#6B46C1" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderRadius: "8px",
                    border: "1px solid #6B46C1",
                  }}
                  labelStyle={{ color: "#6B46C1" }}
                />
                <Area type="monotone" dataKey="wet" stroke="#8884d8" fillOpacity={1} fill="url(#colorWet)" />
                <Area type="monotone" dataKey="soiled" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSoiled)" />
                <Area type="monotone" dataKey="both" stroke="#ffc658" fillOpacity={1} fill="url(#colorBoth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

