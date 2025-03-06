"use client"

import { useState } from "react"
import { useFinanceStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CATEGORIES } from "@/lib/constants"
import type { Budget } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function BudgetTracker() {
  const { budgets, transactions, addBudget, deleteBudget } = useFinanceStore()
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")

  const handleAddBudget = () => {
    if (!amount || !category) return

    addBudget({
      id: crypto.randomUUID(),
      category,
      amount: Number.parseFloat(amount),
    })

    setAmount("")
    setCategory("")
  }

  // Calculate total budget and expenses
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  // Calculate percentage of total budget spent
  const totalBudgetPercentage = totalBudget > 0 ? Math.min(Math.round((totalExpenses / totalBudget) * 100), 100) : 0

  // Check if over budget
  const isOverBudget = totalExpenses > totalBudget && totalBudget > 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Budget</CardTitle>
          <CardDescription>Track your overall spending against your total budget</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {formatCurrency(totalExpenses)} of {formatCurrency(totalBudget)}
            </span>
            <span className="text-sm font-medium">{totalBudgetPercentage}%</span>
          </div>
          <Progress value={totalBudgetPercentage} className="h-2" />

          {isOverBudget && (
            <Alert variant="destructive" className="mt-4">
              <Wallet className="h-4 w-4" />
              <AlertTitle>Budget Exceeded</AlertTitle>
              <AlertDescription>
                You've exceeded your total budget by {formatCurrency(totalExpenses - totalBudget)}.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Budget</CardTitle>
          <CardDescription>Set budgets for different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddBudget} className="w-full">
            Add Budget
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
          <CardDescription>Track spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgets.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No budgets set yet</p>
            ) : (
              budgets.map((budget) => (
                <CategoryBudget key={budget.id} budget={budget} transactions={transactions} onDelete={deleteBudget} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface CategoryBudgetProps {
  budget: Budget
  transactions: any[]
  onDelete: (id: string) => void
}

function CategoryBudget({ budget, transactions, onDelete }: CategoryBudgetProps) {
  // Calculate expenses for this category
  const categoryExpenses = transactions
    .filter((t) => t.type === "expense" && t.category === budget.category)
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate percentage of budget spent
  const percentage = Math.min(Math.round((categoryExpenses / budget.amount) * 100), 100)

  // Find category label
  const categoryLabel = CATEGORIES.find((c) => c.value === budget.category)?.label || budget.category

  // Check if over budget
  const isOverBudget = categoryExpenses > budget.amount

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{categoryLabel}</h4>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(categoryExpenses)} of {formatCurrency(budget.amount)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isOverBudget ? "text-destructive" : ""}`}>{percentage}%</span>
          <Button variant="ghost" size="sm" onClick={() => onDelete(budget.id)}>
            Remove
          </Button>
        </div>
      </div>
      <Progress
        value={percentage}
        className={`h-2 ${isOverBudget ? "bg-destructive/20" : ""}`}
        indicatorClassName={isOverBudget ? "bg-destructive" : undefined}
      />
    </div>
  )
}

