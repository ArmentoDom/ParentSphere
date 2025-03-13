"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Baby, Ruler, Weight, Palette, Volume2, Save } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface BabyData {
  name: string
  birthdate: string
  gender: string
  weight: number
  height: number
  eye_color?: string
  hair_color?: string
  favorite_lullaby?: string
  night_light?: boolean
}

export function ProfileCustomization() {
  const [babyData, setBabyData] = useState<BabyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBabyData()
  }, [])

  const fetchBabyData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase.from("babies").select("*").eq("user_id", user.id).single()

      if (error) {
        console.error("Error fetching baby data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch baby data. Please try again.",
          variant: "destructive",
        })
      } else {
        setBabyData(data)
      }
    }
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setBabyData((prev) => ({
      ...prev!,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setBabyData((prev) => ({
      ...prev!,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setBabyData((prev) => ({
      ...prev!,
      [name]: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user && babyData) {
      const { error } = await supabase.from("babies").update(babyData).eq("user_id", user.id)

      if (error) {
        console.error("Error updating baby data:", error)
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
          variant: "default",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    )
  }

  if (!babyData) {
    return <div className="text-center text-gray-600">No baby data found.</div>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-2xl mx-auto overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="text-2xl font-bold flex items-center space-x-2">
            <Baby className="w-6 h-6" />
            <span>Customize {babyData.name}'s Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center text-purple-700">
                  <Weight className="w-4 h-4 mr-2" />
                  Weight (lbs)
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={babyData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  required
                  className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center text-purple-700">
                  <Ruler className="w-4 h-4 mr-2" />
                  Length (inches)
                </Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={babyData.height}
                  onChange={handleInputChange}
                  step="0.1"
                  required
                  className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="eye_color" className="flex items-center text-purple-700">
                  <Palette className="w-4 h-4 mr-2" />
                  Eye Color
                </Label>
                <Select value={babyData.eye_color} onValueChange={(value) => handleSelectChange("eye_color", value)}>
                  <SelectTrigger className="border-purple-300 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Select eye color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="hazel">Hazel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hair_color" className="flex items-center text-purple-700">
                  <Palette className="w-4 h-4 mr-2" />
                  Hair Color
                </Label>
                <Select value={babyData.hair_color} onValueChange={(value) => handleSelectChange("hair_color", value)}>
                  <SelectTrigger className="border-purple-300 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Select hair color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="blonde">Blonde</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="favorite_lullaby" className="flex items-center text-purple-700">
                <Volume2 className="w-4 h-4 mr-2" />
                Favorite Lullaby
              </Label>
              <Input
                id="favorite_lullaby"
                name="favorite_lullaby"
                value={babyData.favorite_lullaby || ""}
                onChange={handleInputChange}
                placeholder="E.g., Twinkle Twinkle Little Star"
                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-2"
            >
              <Switch
                id="night_light"
                checked={babyData.night_light}
                onCheckedChange={(checked) => handleSwitchChange("night_light", checked)}
              />
              <Label htmlFor="night_light" className="text-purple-700">
                Uses Night Light
              </Label>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

