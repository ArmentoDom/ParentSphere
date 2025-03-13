"use client"

import { BarChartIcon } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
}

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  config: Record<string, { label: string; color: string }>
}

export function ChartContainer({ config, className, children, ...props }: ChartProps) {
  return (
    <div className={className} {...props}>
      <style>
        {Object.entries(config)
          .map(([key, value]) => {
            return `
            .recharts-tooltip-item-name-${key},
            .recharts-legend-item-${key} .recharts-legend-item-text {
              color: ${value.color} !important;
            }
          `
          })
          .join("\n")}
      </style>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export function ChartTooltipContent({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Name</span>
            <span className="font-bold text-muted-foreground">{label}</span>
          </div>
          {payload.map((item: any) => (
            <div key={item.name} className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
              <span className="font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export function ChartTooltip({ children, ...props }: any) {
  return (
    <Tooltip content={<ChartTooltipContent />} {...props}>
      {children}
    </Tooltip>
  )
}

