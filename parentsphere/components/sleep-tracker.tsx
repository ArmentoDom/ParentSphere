"use client"

import { useState, useEffect } from "react"
import { format, parseISO, differenceInMinutes, subDays } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Moon, Sun, Zap } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { supabase } from "@/lib/supabase"

interface SleepEntry {
  id: number
  date: string
  start_time: string
  wake_time: string
  duration: number
  user_id: string
}

export function SleepTracker() {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [newEntry, setNewEntry] = useState<Partial<SleepEntry>>({
    date: format(new Date(), "yyyy-MM-dd"),
    start_time: "",
    wake_time: "",
  })
  const [aiComment, setAiComment] = useState<string>("")
  const [userId, setUserId] = useState<string | null>(null)

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
      fetchSleepEntries(user.id)
    } else {
      console.error("No authenticated user found")
    }
  }

  const fetchSleepEntries = async (userId: string) => {
    const { data, error } = await supabase
      .from("sleep_entries")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(7)

    if (error) {
      console.error("Error fetching sleep entries:", error)
    } else {
      setSleepEntries(data || [])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEntry((prev) => ({ ...prev, [name]: value }))
  }

  const calculateDuration = (start: string, end: string) => {
    const startDate = parseISO(`2000-01-01T${start}:00`)
    const endDate = parseISO(`2000-01-01T${end}:00`)
    let duration = differenceInMinutes(endDate, startDate)
    if (duration < 0) {
      duration += 24 * 60 // Add 24 hours if end time is on the next day
    }
    return duration / 60 // Convert minutes to hours
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      console.error("No authenticated user")
      return
    }
    if (newEntry.date && newEntry.start_time && newEntry.wake_time) {
      const duration = calculateDuration(newEntry.start_time, newEntry.wake_time)
      const { data, error } = await supabase
        .from("sleep_entries")
        .insert([
          {
            date: newEntry.date,
            start_time: newEntry.start_time,
            wake_time: newEntry.wake_time,
            duration,
            user_id: userId,
          },
        ])
        .select()

      if (error) {
        console.error("Error inserting sleep entry:", error)
      } else {
        await fetchSleepEntries(userId)
        setNewEntry({
          date: format(new Date(), "yyyy-MM-dd"),
          start_time: "",
          wake_time: "",
        })
        generateAIComment(data?.[0])
      }
    }
  }

  const generateAIComment = (entry: SleepEntry | undefined) => {
    if (!entry) return
    const hours = Math.floor(entry.duration)
    const minutes = Math.round((entry.duration - hours) * 60)
    let comment = `You slept for ${hours} hours and ${minutes} minutes. `

    if (entry.duration < 6) {
      comment += "That's less than recommended. Try to get more sleep tonight!"
    } else if (entry.duration > 9) {
      comment += "That's more than average. Make sure you're not oversleeping regularly."
    } else {
      comment += "That's a good amount of sleep. Keep up the good work!"
    }

    setAiComment(comment)
  }

  const getAverageSleepDuration = () => {
    if (sleepEntries.length === 0) return 0
    const totalDuration = sleepEntries.reduce((sum, entry) => sum + entry.duration, 0)
    return (totalDuration / sleepEntries.length).toFixed(1)
  }

  const getLastSleepDuration = () => {
    if (sleepEntries.length === 0) return 0
    return sleepEntries[0].duration.toFixed(1)
  }

  const chartData = sleepEntries
    .slice()
    .reverse()
    .map((entry) => ({
      date: format(parseISO(entry.date), "MMM dd"),
      duration: entry.duration,
    }))

  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Sleep Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date" className="text-gray-800">
                  Date
                </Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={newEntry.date}
                  onChange={handleInputChange}
                  required
                  className="bg-white/20 text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="start_time" className="text-gray-800">
                  Sleep Time
                </Label>
                <Input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={newEntry.start_time}
                  onChange={handleInputChange}
                  required
                  className="bg-white/20 text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="wake_time" className="text-gray-800">
                  Wake Time
                </Label>
                <Input
                  type="time"
                  id="wake_time"
                  name="wake_time"
                  value={newEntry.wake_time}
                  onChange={handleInputChange}
                  required
                  className="bg-white/20 text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              Add Sleep Entry
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Sleep Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-sm text-indigo-200">Average Sleep</p>
                <p className="text-3xl font-bold text-gray-800 flex items-center">
                  <Moon className="w-6 h-6 mr-2 text-indigo-300" />
                  {getAverageSleepDuration()}h
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-indigo-200">Last Night</p>
                <p className="text-3xl font-bold text-gray-800 flex items-center">
                  <Sun className="w-6 h-6 mr-2 text-yellow-300" />
                  {getLastSleepDuration()}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Sleep Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Zap className="w-8 h-8 text-yellow-300" />
              <p className="text-gray-800">{aiComment}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Sleep Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="gray-800" />
                <YAxis stroke="gray-800" />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(255,255,255,0.1)", border: "none", borderRadius: "8px" }}
                  labelStyle={{ color: "gray-800" }}
                  itemStyle={{ color: "gray-800" }}
                />
                <Area type="monotone" dataKey="duration" stroke="#8884d8" fillOpacity={1} fill="url(#sleepGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

