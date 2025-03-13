"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Knowledge base
const knowledgeBase = [
  {
    keywords: ["sleep", "nap", "bedtime"],
    response:
      "Consistent sleep schedules are crucial for babies. Aim for a regular bedtime and create a calming routine.",
  },
  {
    keywords: ["feed", "feeding", "milk", "formula"],
    response:
      "Newborns typically feed every 2-3 hours. As they grow, the frequency may decrease but the amount per feeding often increases.",
  },
  {
    keywords: ["diaper", "change", "wet"],
    response: "Newborns may need up to 10-12 diaper changes a day. This usually decreases as they grow older.",
  },
  {
    keywords: ["cry", "crying", "fussy"],
    response:
      "Crying is a baby's main form of communication. Check for hunger, discomfort, tiredness, or the need for a diaper change.",
  },
  {
    keywords: ["development", "milestone", "growth"],
    response:
      "Every baby develops at their own pace. Regular check-ups with your pediatrician can help track your baby's growth and development.",
  },
]

// Simple NLP function
function processInput(input: string) {
  const lowercaseInput = input.toLowerCase()
  for (const item of knowledgeBase) {
    if (item.keywords.some((keyword) => lowercaseInput.includes(keyword))) {
      return item.response
    }
  }
  return "I'm sorry, I don't have specific information about that. Please consult with your pediatrician for personalized advice."
}

export function SphereAI() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const aiResponse = processInput(input)
    setResponse(aiResponse)
    setInput("")
  }

  return (
    <Card className="bg-white soft-shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <Brain className="w-6 h-6 mr-2 text-blue-500" />
          Sphere AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sphere AI for parenting advice..."
            className="bg-secondary text-foreground placeholder-muted-foreground"
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
            Get Guidance
          </Button>
        </form>
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-blue-50 rounded-md"
            >
              <p className="text-foreground">{response}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

