import { motion } from "framer-motion"
import { Brain, Lightbulb, Clock, Calendar, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react" // Import React

interface AIInsightCardProps {
  insights: string[]
}

const insightIcons = [Lightbulb, Clock, Calendar, Zap, Brain]

export function AIInsightCard({ insights }: AIInsightCardProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-100 to-pink-100 shadow-lg border-2 border-purple-200 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          <Brain className="w-6 h-6" />
          <span>AI Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <motion.ul className="space-y-4">
          {insights.map((insight, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm p-3 rounded-lg shadow-sm"
            >
              {React.createElement(insightIcons[index % insightIcons.length], {
                className: "w-5 h-5 text-purple-500 mt-1 flex-shrink-0",
              })}
              <span className="text-purple-800 text-sm">{insight}</span>
            </motion.li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
  )
}

