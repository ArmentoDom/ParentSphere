import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Loader2 } from "lucide-react"

interface AIRecommendationsProps {
  budget: number
}

export function AIRecommendations({ budget }: AIRecommendationsProps) {
  const [query, setQuery] = useState("")
  const [recommendations, setRecommendations] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGetRecommendations = async () => {
    setIsLoading(true)
    // In a real application, this would make an API call to an AI service
    // For this example, we'll simulate a response with a delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const simulatedResponse = `Based on your budget of $${budget} and your interests, here are some recommendations:
  
1. Clothing: Look for multi-packs of onesies and sleepers from brands like Carter's or Gerber. These are affordable and practical.
2. Toys: Consider developmental toys like stacking cups or soft blocks. Brands like Fisher-Price offer good quality at reasonable prices.
3. Gear: For a stroller, the Graco Modes Pramette Travel System is a good mid-range option that grows with your child.
4. Feeding: If breastfeeding, invest in a quality pump like the Spectra S2. For formula feeding, Dr. Brown's bottles are excellent and affordable.

Remember to check for sales and consider second-hand items for bigger purchases to stretch your budget further.`

    setRecommendations(simulatedResponse)
    setIsLoading(false)
  }

  return (
    <Card className="bg-white shadow-lg border-2 border-purple-200 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-6 text-purple-700 flex items-center">
          <Brain className="w-6 h-6 mr-2 text-pink-500" />
          AI Recommendations
        </h3>
        <div className="space-y-6">
          <div>
            <Label htmlFor="ai-query" className="text-lg font-medium text-gray-600">
              What are you looking for?
            </Label>
            <Input
              id="ai-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Best affordable strollers for newborns"
              className="mt-2"
            />
          </div>
          <Button
            onClick={handleGetRecommendations}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              "Get AI Recommendations"
            )}
          </Button>
          {recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >
              <h4 className="text-xl font-semibold mb-4 text-purple-700">AI Recommendations</h4>
              <Textarea value={recommendations} readOnly className="h-64 bg-purple-50 text-purple-800" />
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

