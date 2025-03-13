"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Award, Gift } from "lucide-react"

interface Milestone {
  id: number
  age_group: string
  title: string
  description: string
  completed: boolean
}

const milestoneData: Milestone[] = [
  { id: 1, age_group: "0-3 months", title: "First Smile", description: "Baby's first social smile", completed: false },
  {
    id: 2,
    age_group: "0-3 months",
    title: "Holds Head Up",
    description: "Baby can hold head up during tummy time",
    completed: false,
  },
  {
    id: 3,
    age_group: "3-6 months",
    title: "Rolls Over",
    description: "Baby can roll from tummy to back",
    completed: false,
  },
  { id: 4, age_group: "3-6 months", title: "First Laugh", description: "Baby's first laugh", completed: false },
  {
    id: 5,
    age_group: "6-9 months",
    title: "Sits Without Support",
    description: "Baby can sit without support",
    completed: false,
  },
  {
    id: 6,
    age_group: "6-9 months",
    title: "First Word",
    description: "Baby says first recognizable word",
    completed: false,
  },
  { id: 7, age_group: "9-12 months", title: "Crawling", description: "Baby starts crawling", completed: false },
  {
    id: 8,
    age_group: "9-12 months",
    title: "Stands with Support",
    description: "Baby can stand while holding onto furniture",
    completed: false,
  },
]

export function MilestoneTracker() {
  const [milestones, setMilestones] = useState<Milestone[]>(milestoneData)
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("0-3 months")

  useEffect(() => {
    // In a real app, we would fetch the milestones from the database here
    // For now, we'll use the static data
  }, [])

  const completeMilestone = async (id: number) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, completed: true } : m)))
    // In a real app, we would update the database here
    alert("Congratulations! You've reached a new milestone!")
  }

  const filteredMilestones = milestones.filter((m) => m.age_group === selectedAgeGroup)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="bg-white/80 backdrop-blur-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600">
          <CardTitle className="text-3xl font-bold text-white flex items-center">
            <Star className="w-8 h-8 mr-2" />
            Milestone Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex space-x-2 mb-4">
            {["0-3 months", "3-6 months", "6-9 months", "9-12 months"].map((ageGroup) => (
              <Button
                key={ageGroup}
                variant={selectedAgeGroup === ageGroup ? "default" : "outline"}
                onClick={() => setSelectedAgeGroup(ageGroup)}
                className={selectedAgeGroup === ageGroup ? "bg-purple-600 text-white" : "text-purple-600"}
              >
                {ageGroup}
              </Button>
            ))}
          </div>
          <div className="space-y-4">
            {filteredMilestones.map((milestone) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-semibold text-purple-600">{milestone.title}</h3>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    {milestone.completed ? (
                      <Badge variant="default" className="bg-green-500">
                        <Award className="w-4 h-4 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => completeMilestone(milestone.id)}
                        size="sm"
                        className="bg-purple-600 text-white hover:bg-purple-700"
                      >
                        <Gift className="w-4 h-4 mr-1" />
                        Achieve
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

