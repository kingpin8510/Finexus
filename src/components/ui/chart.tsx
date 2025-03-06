"use client"

import type React from "react"

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const Chart = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>
}

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>
}

export const ChartLegend = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex gap-2 mt-4">{children}</div>
}

export const ChartLegendItem = ({
  color,
  label,
}: {
  color: string
  label: string
}) => {
  return (
    <div className="flex items-center">
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="ml-2 text-sm">{label}</span>
    </div>
  )
}

export const ChartPie = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>
}

export const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <div className="absolute">{children}</div>
}

