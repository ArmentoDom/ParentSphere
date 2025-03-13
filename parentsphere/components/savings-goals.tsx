import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, Target } from "lucide-react"

export function SavingsGoals() {
  const [goals, setGoals] = useState<{ name: string; targetAmount: number; currentAmount: number }[]>([])
  const [newGoal, setNewGoal] = useState({ name: "", targetAmount: 0, currentAmount: 0 })

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      setGoals([...goals, newGoal])
      setNewGoal({ name: "", targetAmount: 0, currentAmount: 0 })
    }
  }

  const handleUpdateGoal = (index: number, amount: number) => {
    const updatedGoals = [...goals]
    updatedGoals[index].currentAmount += amount
    setGoals(updatedGoals)
  }

  return (
    <Card className="bg-white shadow-lg border-2 border-purple-200 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-6 text-purple-700">Savings Goals</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="goal-name" className="text-sm font-medium text-gray-600">
                Goal Name
              </Label>
              <Input
                id="goal-name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="e.g., College Fund"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="goal-target" className="text-sm font-medium text-gray-600">
                Target Amount
              </Label>
              <Input
                id="goal-target"
                type="number"
                value={newGoal.targetAmount || ""}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddGoal}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Goal
              </Button>
            </div>
          </div>
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4 text-purple-700">Your Savings Goals</h4>
            <AnimatePresence>
              {goals.map((goal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 bg-purple-50 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-lg font-semibold text-purple-700">{goal.name}</h5>
                    <span className="text-sm text-gray-600">
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <Progress
                    value={(goal.currentAmount / goal.targetAmount) * 100}
                    className="h-2 mb-4"
                    indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      placeholder="Amount to add"
                      className="w-1/2"
                      onChange={(e) => {
                        const amount = Number(e.target.value)
                        if (!isNaN(amount)) {
                          handleUpdateGoal(index, amount)
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleUpdateGoal(index, 0)}
                      className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300"
                    >
                      <Target className="w-5 h-5 mr-2" />
                      Update Goal
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

