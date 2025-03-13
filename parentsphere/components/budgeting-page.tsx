"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, ShoppingBag, PiggyBank, TrendingUp, ArrowRight } from "lucide-react"
import { BudgetTracker } from "./budget-tracker"
import { AIRecommendations } from "./ai-recommendations"
import { FinancialTracker } from "./financial-tracker"
import { SavingsGoals } from "./savings-goals"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function BudgetingPage() {
  const [monthlyBudgets, setMonthlyBudgets] = useState<{ [key: string]: number }>({})
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString("default", { month: "long" }))
  const [newBudget, setNewBudget] = useState<number>(0)

  useEffect(() => {
    // Initialize budgets with 0 for each month
    const initialBudgets = months.reduce(
      (acc, month) => {
        acc[month] = 0
        return acc
      },
      {} as { [key: string]: number },
    )
    setMonthlyBudgets(initialBudgets)
  }, [])

  const handleSetBudget = () => {
    setMonthlyBudgets((prev) => ({
      ...prev,
      [selectedMonth]: newBudget,
    }))
    setNewBudget(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-center text-purple-800 mb-8"
        >
          Smart Budgeting for Your Family
        </motion.h1>

        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-2 border-purple-200 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
            <CardTitle className="text-3xl font-bold flex items-center space-x-2">
              <DollarSign className="w-8 h-8" />
              <span>Family Budget Planner</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8"
            >
              <Label htmlFor="month-select" className="text-xl font-semibold text-purple-700 mb-2 block">
                Select Month
              </Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger
                  id="month-select"
                  className="w-full text-lg py-6 border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                >
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label htmlFor="monthly-budget" className="text-xl font-semibold text-purple-700 mb-2 mt-4 block">
                Set Your Monthly Baby Budget for {selectedMonth}
              </Label>
              <div className="flex items-center mt-2">
                <Input
                  id="monthly-budget"
                  type="number"
                  placeholder="Enter amount"
                  className="text-lg py-6 border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-l-lg"
                  value={newBudget || ""}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                />
                <Button
                  className="ml-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 rounded-r-lg transition-all duration-300 transform hover:scale-105 py-6 text-lg"
                  onClick={handleSetBudget}
                >
                  <span>Set Budget</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-purple-700 mb-4">Current Monthly Budgets</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {months.map((month) => (
                  <div key={month} className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-600">{month}</h4>
                    <p className="text-lg text-purple-800">${monthlyBudgets[month] || 0}</p>
                  </div>
                ))}
              </div>
            </div>

            <Tabs defaultValue="budget-tracker" className="space-y-8">
              <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-purple-100 p-2 rounded-lg">
                <TabsTrigger
                  value="budget-tracker"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md transition-all duration-300 py-3"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  <span>Budget Tracker</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ai-recommendations"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md transition-all duration-300 py-3"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span>AI Recommendations</span>
                </TabsTrigger>
                <TabsTrigger
                  value="financial-tracker"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md transition-all duration-300 py-3"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>Financial Tracker</span>
                </TabsTrigger>
                <TabsTrigger
                  value="savings-goals"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md transition-all duration-300 py-3"
                >
                  <PiggyBank className="w-5 h-5 mr-2" />
                  <span>Savings Goals</span>
                </TabsTrigger>
              </TabsList>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <TabsContent value="budget-tracker">
                  <BudgetTracker monthlyBudget={monthlyBudgets[selectedMonth] || 0} />
                </TabsContent>
                <TabsContent value="ai-recommendations">
                  <AIRecommendations budget={monthlyBudgets[selectedMonth] || 0} />
                </TabsContent>
                <TabsContent value="financial-tracker">
                  <FinancialTracker />
                </TabsContent>
                <TabsContent value="savings-goals">
                  <SavingsGoals />
                </TabsContent>
              </motion.div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

