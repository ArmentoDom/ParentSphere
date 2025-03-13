"use client"

import { useState, useEffect } from "react"
import { format, parseISO, subDays } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Baby, Droplet, Clock, Utensils } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { supabase } from "@/lib/supabase"

interface FeedingEntry {
  id: number
  date: string
  time: string
  amount: number
  unit: string
  user_id: string
}

export function FeedingTracker() {
  const [feedingEntries, setFeedingEntries] = useState<FeedingEntry[]>([])
  const [newEntry, setNewEntry] = useState<Partial<FeedingEntry>>({
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    amount: 0,
    unit: "oz",
  })
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
      fetchFeedingEntries(user.id)
    } else {
      console.error("No authenticated user found")
    }
  }

  const fetchFeedingEntries = async (userId: string) => {
    const { data, error } = await supabase
      .from("feeding_entries")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(7)

    if (error) {
      console.error("Error fetching feeding entries:", error)
    } else {
      setFeedingEntries(data || [])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEntry((prev) => ({ ...prev, [name]: name === "amount" ? Number.parseFloat(value) : value }))
  }

  const handleUnitChange = (value: string) => {
    setNewEntry((prev) => ({ ...prev, unit: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      console.error("No authenticated user")
      return
    }
    if (newEntry.date && newEntry.time && newEntry.amount && newEntry.unit) {
      const { data, error } = await supabase
        .from("feeding_entries")
        .insert([
          {
            date: newEntry.date,
            time: newEntry.time,
            amount: newEntry.amount,
            unit: newEntry.unit,
            user_id: userId,
          },
        ])
        .select()

      if (error) {
        console.error("Error inserting feeding entry:", error)
      } else {
        await fetchFeedingEntries(userId)
        setNewEntry({
          date: format(new Date(), "yyyy-MM-dd"),
          time: format(new Date(), "HH:mm"),
          amount: 0,
          unit: "oz",
        })
      }
    }
  }

  const getTotalFeedingAmount = () => {
    return feedingEntries.reduce((sum, entry) => sum + entry.amount, 0).toFixed(1)
  }

  const getAverageFeedingAmount = () => {
    if (feedingEntries.length === 0) return 0
    return (feedingEntries.reduce((sum, entry) => sum + entry.amount, 0) / feedingEntries.length).toFixed(1)
  }

  const chartData = feedingEntries
    .slice()
    .reverse()
    .map((entry) => ({
      date: format(parseISO(entry.date), "MMM dd"),
      amount: entry.amount,
    }))

  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Feeding Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Label htmlFor="time" className="text-gray-800">
                  Time
                </Label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  value={newEntry.time}
                  onChange={handleInputChange}
                  required
                  className="bg-white/20 text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-gray-800">
                  Amount
                </Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  value={newEntry.amount}
                  onChange={handleInputChange}
                  required
                  step="0.1"
                  min="0"
                  className="bg-white/20 text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="unit" className="text-gray-800">
                  Unit
                </Label>
                <Select onValueChange={handleUnitChange} defaultValue={newEntry.unit}>
                  <SelectTrigger className="bg-white/20 text-gray-800">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              Add Feeding Entry
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Feeding Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-sm text-indigo-200">Total Amount</p>
                <p className="text-3xl font-bold text-gray-800 flex items-center">
                  <Droplet className="w-6 h-6 mr-2 text-blue-300" />
                  {getTotalFeedingAmount()} {feedingEntries[0]?.unit || "oz"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-indigo-200">Average Amount</p>
                <p className="text-3xl font-bold text-gray-800 flex items-center">
                  <Baby className="w-6 h-6 mr-2 text-green-300" />
                  {getAverageFeedingAmount()} {feedingEntries[0]?.unit || "oz"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Last Feeding</CardTitle>
          </CardHeader>
          <CardContent>
            {feedingEntries[0] && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-indigo-300 mr-4" />
                  <div>
                    <p className="text-gray-800 text-lg">{format(parseISO(feedingEntries[0].date), "MMM dd, yyyy")}</p>
                    <p className="text-indigo-200">{feedingEntries[0].time}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {feedingEntries[0].amount} {feedingEntries[0].unit}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Feeding Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="feedingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
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
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#82ca9d", stroke: "#82ca9d" }}
                  activeDot={{ r: 6, fill: "#82ca9d", stroke: "white" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

