"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Star, Trash2, Calendar, Clock, BookOpen, Award } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Milestone {
  id: string
  title: string
  date: string
  description: string
  user_id: string
  age_group: string
}

const ageGroups = ["0-3 months", "3-6 months", "6-9 months", "9-12 months", "12-18 months", "18-24 months"]

const defaultMilestones = {
  "0-3 months": [
    "Lifts head during tummy time (1-2 months)",
    "Smiles in response to caregiver (6-8 weeks)",
    "Follows objects with eyes (2-3 months)",
    "Coos and makes gurgling sounds (2-3 months)",
    "Recognizes familiar faces (2-3 months)",
    "Holds head steady without support (3 months)",
  ],
  "3-6 months": [
    "Rolls over from tummy to back (4 months)",
    "Laughs out loud (4 months)",
    "Reaches for and grasps objects (3-5 months)",
    "Sits with support (4-5 months)",
    "Responds to own name (4-6 months)",
    "Begins to babble (4-6 months)",
  ],
  "6-9 months": [
    "Sits without support (6-7 months)",
    "Babbles chains of consonants (6-7 months)",
    "Picks up small objects with thumb and finger (7-9 months)",
    "Starts crawling (7-9 months)",
    "Plays peek-a-boo (7-9 months)",
    "Pulls to stand (8-9 months)",
  ],
  "9-12 months": [
    "Says 'mama' or 'dada' with meaning (9-10 months)",
    "Understands simple words like 'no' and 'bye-bye' (9-10 months)",
    "Imitates sounds and gestures (9-12 months)",
    "Stands alone momentarily (11-12 months)",
    "Uses objects correctly (e.g., drinks from cup) (11-12 months)",
    "Takes first steps (11-13 months)",
  ],
  "12-18 months": [
    "Walks alone (12-16 months)",
    "Says several single words (12-18 months)",
    "Follows simple one-step directions (14-18 months)",
    "Scribbles with crayon (15-18 months)",
    "Points to body parts when asked (15-18 months)",
    "Begins to use utensils (15-18 months)",
  ],
  "18-24 months": [
    "Runs (18-24 months)",
    "Kicks a ball (18-24 months)",
    "Climbs on furniture (18-24 months)",
    "Uses 2-word phrases (18-24 months)",
    "Follows two-step instructions (18-24 months)",
    "Begins imaginative play (18-24 months)",
  ],
}

export function MilestonesTracker() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    age_group: "0-3 months",
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUserAndMilestones()
  }, [])

  const fetchUserAndMilestones = async () => {
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
      fetchMilestones(user.id)
    } else {
      console.error("No authenticated user found")
    }
  }

  const fetchMilestones = async (userId: string) => {
    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching milestones:", error)
    } else {
      setMilestones(data || [])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewMilestone((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setNewMilestone((prev) => ({ ...prev, age_group: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      console.error("No authenticated user")
      return
    }
    setIsLoading(true)
    if (newMilestone.title && newMilestone.date && newMilestone.age_group) {
      const { data, error } = await supabase
        .from("milestones")
        .insert([
          {
            user_id: userId,
            title: newMilestone.title,
            date: newMilestone.date,
            description: newMilestone.description || "",
            age_group: newMilestone.age_group,
          },
        ])
        .select()

      if (error) {
        console.error("Error inserting milestone:", error)
      } else {
        await fetchMilestones(userId)
        setNewMilestone({
          title: "",
          date: format(new Date(), "yyyy-MM-dd"),
          description: "",
          age_group: "0-3 months",
        })
      }
    }
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("milestones").delete().eq("id", id)
    if (error) {
      console.error("Error deleting milestone:", error)
    } else {
      setMilestones((prev) => prev.filter((milestone) => milestone.id !== id))
    }
  }

  return (
    <div className="space-y-12">
      <Card className="bg-white shadow-xl border-2 border-purple-200 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
          <CardTitle className="text-3xl font-bold flex items-center">
            <PlusCircle className="w-8 h-8 mr-3" />
            Add New Milestone
          </CardTitle>
          <CardDescription className="text-purple-100 text-lg">
            Capture your baby's special moments and achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-medium text-gray-700">
                  Milestone Title
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={newMilestone.title}
                  onChange={handleInputChange}
                  required
                  className="text-lg"
                  placeholder="e.g., First smile, First steps"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-lg font-medium text-gray-700">
                  Date Achieved
                </Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={newMilestone.date}
                  onChange={handleInputChange}
                  required
                  className="text-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age_group" className="text-lg font-medium text-gray-700">
                Age Group
              </Label>
              <Select onValueChange={handleSelectChange} value={newMilestone.age_group}>
                <SelectTrigger className="w-full text-lg">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-medium text-gray-700">
                Description (optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newMilestone.description}
                onChange={handleInputChange}
                className="text-lg"
                placeholder="Add any special details about this milestone"
                rows={4}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-lg py-6 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                "Adding Milestone..."
              ) : (
                <>
                  <PlusCircle className="w-6 h-6 mr-2" />
                  Add Milestone
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-xl border-2 border-purple-200 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
          <CardTitle className="text-3xl font-bold flex items-center">
            <Clock className="w-8 h-8 mr-3" />
            Milestone Timeline
          </CardTitle>
          <CardDescription className="text-purple-100 text-lg">Your baby's journey of growth</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs defaultValue="0-3 months" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {ageGroups.map((group) => (
                <TabsTrigger
                  key={group}
                  value={group}
                  className="text-lg py-3 px-4 rounded-lg transition-all duration-300"
                >
                  {group}
                </TabsTrigger>
              ))}
            </TabsList>
            {ageGroups.map((group) => (
              <TabsContent key={group} value={group}>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    <AnimatePresence>
                      {milestones
                        .filter((milestone) => milestone.age_group === group)
                        .map((milestone) => (
                          <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="bg-purple-50 hover:bg-purple-100 transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-xl font-semibold text-purple-800 flex items-center">
                                      <Award className="w-5 h-5 mr-2 text-pink-500" />
                                      {milestone.title}
                                    </CardTitle>
                                    <CardDescription className="text-md text-purple-600 flex items-center mt-2">
                                      <Calendar className="w-5 h-5 mr-2" />
                                      {format(new Date(milestone.date), "MMMM d, yyyy")}
                                    </CardDescription>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(milestone.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                                  >
                                    <Trash2 className="h-6 w-6" />
                                  </Button>
                                </div>
                              </CardHeader>
                              {milestone.description && (
                                <CardContent className="pt-2">
                                  <p className="text-md text-gray-600">{milestone.description}</p>
                                </CardContent>
                              )}
                            </Card>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                    {milestones.filter((milestone) => milestone.age_group === group).length === 0 && (
                      <Card className="bg-gray-50">
                        <CardContent className="p-6">
                          <p className="text-lg text-gray-500 text-center">
                            No milestones recorded for this age group yet.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-purple-800 mb-4">Common Milestones:</h3>
                    <ul className="list-disc list-inside space-y-3">
                      {defaultMilestones[group as keyof typeof defaultMilestones].map((milestone, index) => (
                        <li key={index} className="text-md text-gray-600 flex items-start">
                          <Clock className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-purple-500" />
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="bg-purple-50 border-t-2 border-purple-100 p-6">
          <p className="text-lg text-purple-700 flex items-center">
            <Star className="w-6 h-6 mr-2 text-yellow-400" />
            {milestones.length} milestone{milestones.length !== 1 ? "s" : ""} recorded
          </p>
        </CardFooter>
      </Card>

      <Card className="bg-white shadow-xl border-2 border-purple-200 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
          <CardTitle className="text-3xl font-bold flex items-center">
            <BookOpen className="w-8 h-8 mr-3" />
            Milestone Insights
          </CardTitle>
          <CardDescription className="text-purple-100 text-lg">Understanding your baby's development</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <p className="text-lg text-gray-700">
              Tracking your baby's milestones is an exciting part of parenthood. Remember that every child develops at
              their own pace, and it's normal for milestones to be reached at different times.
            </p>
            <p className="text-lg text-gray-700">
              If you have any concerns about your baby's development, always consult with your pediatrician. They can
              provide personalized advice and ensure your baby is progressing well.
            </p>
            <div className="flex items-center bg-purple-100 rounded-xl p-6">
              <BookOpen className="w-12 h-12 text-purple-600 mr-4 flex-shrink-0" />
              <p className="text-lg text-purple-800">
                Tip: Celebrate each milestone, no matter how small. Every achievement is a step in your baby's unique
                journey of growth and development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

