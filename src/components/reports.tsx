"use client"

import { useFinanceStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CATEGORIES } from "@/lib/constants"
import { Chart, ChartContainer, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Colors for charts
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
  "#ff8042",
  "#a4de6c",
  "#d0ed57",
]

export function Reports() {
  const { transactions } = useFinanceStore()

  // Get expenses by category
  const expensesByCategory = CATEGORIES.map((category) => {
    const amount = transactions
      .filter((t) => t.type === "expense" && t.category === category.value)
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      name: category.label,
      value: amount,
    }
  }).filter((category) => category.value > 0)

  // Get monthly spending data
  const monthlyData = getMonthlyData(transactions)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="categories">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Spending by Category</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {expensesByCategory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No expense data available</p>
              ) : (
                <div className="h-[400px]">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart data={expensesByCategory} />
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      {expensesByCategory.map((entry, index) => (
                        <ChartLegendItem
                          key={`item-${index}`}
                          color={COLORS[index % COLORS.length]}
                          label={entry.name}
                        />
                      ))}
                    </ChartLegend>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyData.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No monthly data available</p>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, "")} />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), "Amount"]} />
                      <Legend />
                      <Bar name="Income" dataKey="income" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                      <Bar name="Expenses" dataKey="expenses" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={false}
      outerRadius={120}
      fill="#8884d8"
      dataKey="value"
      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
  )
}

function getMonthlyData(transactions: any[]) {
  const monthlyData: Record<string, { month: string; income: number; expenses: number }> = {}

  // Process transactions
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date)
    const monthYear = `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        month: monthYear,
        income: 0,
        expenses: 0,
      }
    }

    if (transaction.type === "income") {
      monthlyData[monthYear].income += transaction.amount
    } else {
      monthlyData[monthYear].expenses += transaction.amount
    }
  })

  // Convert to array and sort by date
  return Object.values(monthlyData).sort((a, b) => {
    const [aMonth, aYear] = a.month.split(" ")
    const [bMonth, bYear] = b.month.split(" ")

    const aDate = new Date(`${aMonth} 1, ${aYear}`)
    const bDate = new Date(`${bMonth} 1, ${bYear}`)

    return aDate.getTime() - bDate.getTime()
  })
}

