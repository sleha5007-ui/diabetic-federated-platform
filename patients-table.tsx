"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { recentPatients } from "@/lib/dummy-data"

function getRiskColor(risk: string) {
  switch (risk) {
    case "High":
      return "destructive" as const
    case "Moderate":
      return "secondary" as const
    case "Low":
      return "outline" as const
    default:
      return "secondary" as const
  }
}

export function PatientsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
        <CardDescription>
          Latest diabetic patient records from your hospital
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Age</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead>HbA1c</TableHead>
              <TableHead className="hidden lg:table-cell">
                Last Visit
              </TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-mono text-xs">
                  {patient.id}
                </TableCell>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {patient.age}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {patient.type}
                </TableCell>
                <TableCell className="font-mono tabular-nums">
                  {patient.hba1c}%
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {patient.lastVisit}
                </TableCell>
                <TableCell>
                  <Badge variant={getRiskColor(patient.risk)}>
                    {patient.risk}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
