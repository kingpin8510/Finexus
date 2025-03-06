"use client"

import { DashboardLayout } from "../components/dashboard-layout"
import { DashboardOverview } from "../components/dashboard-overview"
import { TransactionList } from "../components/transaction-list"
import { BudgetTracker } from "../components/budget-tracker"
import { Reports } from "../components/reports"
import { useState } from "react"

type ActiveView = "dashboard" | "transactions" | "budget" | "reports"

export function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {activeView === "dashboard" && <DashboardOverview />}
      {activeView === "transactions" && <TransactionList />}
      {activeView === "budget" && <BudgetTracker />}
      {activeView === "reports" && <Reports />}
    </DashboardLayout>
  )
}

