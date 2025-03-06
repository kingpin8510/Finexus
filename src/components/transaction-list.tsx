"use client"

import type React from "react"

import { useState } from "react"
import { useFinanceStore } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionForm } from "./transaction-form"
import { CATEGORIES, TRANSACTION_TYPES } from "@/lib/constants"
import type { Transaction } from "@/lib/types"

export function TransactionList() {
  const { transactions, updateTransaction, deleteTransaction } = useFinanceStore()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Apply filters
  const filteredTransactions = sortedTransactions.filter((transaction) => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory

    return matchesSearch && matchesType && matchesCategory
  })

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    updateTransaction(updatedTransaction)
    setEditingTransaction(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Transaction</CardTitle>
          <CardDescription>Record your income or expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div>
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={filterType} onValueChange={(value) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {TRANSACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions found</p>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
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
                  <div className="flex items-center space-x-4">
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
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setEditingTransaction(transaction)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Transaction</DialogTitle>
                            <DialogDescription>Make changes to your transaction</DialogDescription>
                          </DialogHeader>
                          {editingTransaction && (
                            <EditTransactionForm transaction={editingTransaction} onUpdate={handleUpdateTransaction} />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => deleteTransaction(transaction.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface EditTransactionFormProps {
  transaction: Transaction
  onUpdate: (transaction: Transaction) => void
}

function EditTransactionForm({ transaction, onUpdate }: EditTransactionFormProps) {
  const [title, setTitle] = useState(transaction.title)
  const [amount, setAmount] = useState(transaction.amount.toString()) // Ensure this is a string
  const [category, setCategory] = useState(transaction.category)
  const [type, setType] = useState(transaction.type)
  const [date, setDate] = useState(transaction.date)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({
      ...transaction,
      title,
      amount: Number.parseFloat(amount), // Parse to number when submitting
      category,
      type,
      date,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount
        </label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">
            Type
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
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
      </div>
      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium">
          Date
        </label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        Update Transaction
      </Button>
    </form>
  )
}

