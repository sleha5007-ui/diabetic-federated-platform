"use client"

import {
  Users,
  TrendingUp,
  Globe,
  ShieldCheck,
  Building2,
  RotateCw,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dashboardStats } from "@/lib/dummy-data"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
  badge?: { label: string; variant: "default" | "secondary" | "outline" }
  trend?: string
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  badge,
  trend,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex flex-col gap-1">
          <CardDescription className="text-xs font-medium uppercase tracking-wide">
            {title}
          </CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums">
            {value}
          </CardTitle>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
          {trend && (
            <span className="text-xs text-muted-foreground">{trend}</span>
          )}
          {!badge && !trend && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Total Patients"
        value={dashboardStats.totalPatients.toLocaleString()}
        description={`+${dashboardStats.newPatientsThisMonth} this month`}
        icon={Users}
        trend={`+${dashboardStats.newPatientsThisMonth} this month`}
      />
      <StatCard
        title="Local Model"
        value={`${dashboardStats.localModelAccuracy}%`}
        description="Accuracy on local data"
        icon={TrendingUp}
        trend="Accuracy on local data"
      />
      <StatCard
        title="Global Model"
        value={`${dashboardStats.globalModelAccuracy}%`}
        description="Aggregated model accuracy"
        icon={Globe}
        trend="Aggregated accuracy"
      />
      <StatCard
        title="Privacy Status"
        value={`ε = ${dashboardStats.privacyBudget}`}
        description="Differential privacy active"
        icon={ShieldCheck}
        badge={{ label: "Enabled", variant: "default" }}
      />
      <StatCard
        title="Hospitals"
        value={dashboardStats.participatingHospitals}
        description="In the federation"
        icon={Building2}
        trend="Participating in federation"
      />
      <StatCard
        title="Training Rounds"
        value={dashboardStats.trainingRounds}
        description="Federated rounds completed"
        icon={RotateCw}
        trend="Rounds completed"
      />
    </div>
  )
}
