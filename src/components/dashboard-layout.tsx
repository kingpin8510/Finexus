"use client"

import type React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { BarChart3, CreditCard, Home, Wallet } from "lucide-react"

type ActiveView = "dashboard" | "transactions" | "budget" | "reports"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
}

export function DashboardLayout({ children, activeView, setActiveView }: DashboardLayoutProps) {
  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      value: "dashboard" as ActiveView,
    },
    {
      title: "Transactions",
      icon: CreditCard,
      value: "transactions" as ActiveView,
    },
    {
      title: "Budget",
      icon: Wallet,
      value: "budget" as ActiveView,
    },
    {
      title: "Reports",
      icon: BarChart3,
      value: "reports" as ActiveView,
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">Finance Dashboard</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton onClick={() => setActiveView(item.value)} isActive={activeView === item.value}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="flex h-16 items-center justify-between border-b px-6">
            <h2 className="text-xl font-semibold capitalize">{activeView}</h2>
            <ModeToggle />
          </div>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

