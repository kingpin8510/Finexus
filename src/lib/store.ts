"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Budget, Transaction } from "./types"

interface FinanceState {
  transactions: Transaction[]
  budgets: Budget[]
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (transaction: Transaction) => void
  deleteTransaction: (id: string) => void
  addBudget: (budget: Budget) => void
  deleteBudget: (id: string) => void
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: [],
      budgets: [],

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),

      updateTransaction: (updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        })),

      addBudget: (budget) =>
        set((state) => ({
          budgets: [...state.budgets, budget],
        })),

      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        })),
    }),
    {
      name: "finance-storage",
    },
  ),
)

