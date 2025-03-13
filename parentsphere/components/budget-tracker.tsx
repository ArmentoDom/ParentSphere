import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Plus, Trash2 } from "lucide-react"

interface BudgetTrackerProps {
  monthlyBudget: number
}

export function BudgetTracker({ monthlyBudget }: BudgetTrackerProps) {
  const [expenses, setExpenses] = useState<{ category: string; amount: number }[]>([])
  const [newExpense, setNewExpense] = useState({ category: "", amount: 0 })

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = monthlyBudget - totalExpenses
  const progressPercentage = (totalExpenses / monthlyBudget) * 100

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount > 0) {
      setExpenses([...expenses, newExpense])
      setNewExpense({ category: "", amount: 0 })
    }
  }

  const handleRemoveExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index))
  }

  return (
    <Card className="bg-white shadow-lg border-2 border-purple-200 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-6 text-purple-700">Budget Tracker</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-600">Total Budget:</span>
            <span className="text-2xl font-bold text-purple-700">${monthlyBudget.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-600">Remaining:</span>
            <span className={`text-2xl font-bold ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${remainingBudget.toFixed(2)}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-3 bg-purple-100"
            indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expense-category" className="text-sm font-medium text-gray-600">
                Category
              </Label>
              <Input
                id="expense-category"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                placeholder="e.g., Diapers"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="expense-amount" className="text-sm font-medium text-gray-600">
                Amount
              </Label>
              <Input
                id="expense-amount"
                type="number"
                value={newExpense.amount || ""}
                onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddExpense} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-xl font-semibold mb-4 text-purple-700">Expense List</h4>
            <AnimatePresence>
              {expenses.map((expense, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center bg-purple-50 p-4 rounded-md mb-2"
                >
                  <span className="text-lg text-purple-700">{expense.category}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium text-purple-700">${expense.amount.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveExpense(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
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

