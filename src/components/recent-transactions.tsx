"use client"

import { useFinanceStore } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RecentTransactionsProps {
  limit?: number
}

export function RecentTransactions({ limit }: RecentTransactionsProps) {
  const { transactions } = useFinanceStore()

  // Sort transactions by date (newest first) and limit if needed
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)

  if (recentTransactions.length === 0) {
    return <p className="text-center text-muted-foreground">No transactions yet</p>
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center space-x-4">
              <div
                className={`rounded-full p-2 ${
                  transaction.type === "income"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300"
                }`}
              >
                {transaction.type === "income" ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.title}</p>
                <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{transaction.category}</Badge>
              <span
                className={`font-medium ${
                  transaction.type === "income"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

