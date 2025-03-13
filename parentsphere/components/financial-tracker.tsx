import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, PlusCircle } from "lucide-react"

export function FinancialTracker() {
  const [transactions, setTransactions] = useState<
    { date: string; description: string; amount: number; type: string }[]
  >([])
  const [newTransaction, setNewTransaction] = useState({ date: "", description: "", amount: 0, type: "expense" })

  const handleAddTransaction = () => {
    if (newTransaction.date && newTransaction.description && newTransaction.amount) {
      setTransactions([...transactions, newTransaction])
      setNewTransaction({ date: "", description: "", amount: 0, type: "expense" })
    }
  }

  const calculateBalance = () => {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === "income" ? balance + transaction.amount : balance - transaction.amount
    }, 0)
  }

  return (
    <Card className="bg-white shadow-lg border-2 border-purple-200 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-6 text-purple-700">Financial Tracker</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="transaction-date" className="text-sm font-medium text-gray-600">
                Date
              </Label>
              <Input
                id="transaction-date"
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="transaction-description" className="text-sm font-medium text-gray-600">
                Description
              </Label>
              <Input
                id="transaction-description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                placeholder="e.g., Groceries"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="transaction-amount" className="text-sm font-medium text-gray-600">
                Amount
              </Label>
              <Input
                id="transaction-amount"
                type="number"
                value={newTransaction.amount || ""}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="transaction-type" className="text-sm font-medium text-gray-600">
                Type
              </Label>
              <Select
                value={newTransaction.type}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}
              >
                <SelectTrigger id="transaction-type" className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleAddTransaction}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Transaction
          </Button>
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4 text-purple-700">Transaction History</h4>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {transactions.map((transaction, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              transaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-2 text-purple-700">Current Balance</h4>
            <p className="text-3xl font-bold text-green-600 flex items-center">
              <DollarSign className="w-8 h-8 mr-2" />
              {calculateBalance().toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

