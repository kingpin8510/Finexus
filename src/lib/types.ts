export interface Transaction {
  id: string
  title: string
  amount: number
  category: string
  type: "income" | "expense"
  date: string
}

export interface Budget {
  id: string
  category: string
  amount: number
}

