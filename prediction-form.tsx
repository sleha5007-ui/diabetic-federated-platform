"use client"

import { useState } from "react"
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Droplets,
  Scale,
  CalendarDays,
  HeartPulse,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface PredictionResult {
  prediction: string
  riskScore: number
  inputs: { glucose: number; bmi: number; age: number; bp: number }
}

const formFields = [
  {
    key: "glucose",
    label: "Glucose Level",
    placeholder: "e.g. 148",
    unit: "mg/dL",
    icon: Droplets,
  },
  {
    key: "bmi",
    label: "BMI",
    placeholder: "e.g. 33.6",
    unit: "kg/m\u00B2",
    icon: Scale,
  },
  {
    key: "age",
    label: "Age",
    placeholder: "e.g. 50",
    unit: "years",
    icon: CalendarDays,
  },
  {
    key: "bp",
    label: "Blood Pressure",
    placeholder: "e.g. 72",
    unit: "mmHg",
    icon: HeartPulse,
  },
] as const

export function PredictionForm() {
  const [values, setValues] = useState<Record<string, string>>({
    glucose: "",
    bmi: "",
    age: "",
    bp: "",
  })
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          glucose: Number(values.glucose),
          bmi: Number(values.bmi),
          age: Number(values.age),
          bp: Number(values.bp),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong.")
      } else {
        setResult(data)
      }
    } catch {
      setError("Failed to connect to the prediction server.")
    } finally {
      setLoading(false)
    }
  }

  const allFilled = Object.values(values).every((v) => v.trim() !== "")
  const isHighRisk = result?.prediction === "High Risk of Diabetes"

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Form */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Patient Assessment</CardTitle>
              <CardDescription>
                Enter patient vitals to predict diabetes risk
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {formFields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={field.key}
                    className="flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <field.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {field.label}
                  </label>
                  <div className="relative">
                    <Input
                      id={field.key}
                      type="number"
                      step="any"
                      min="0"
                      placeholder={field.placeholder}
                      value={values[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="pr-16"
                      required
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {field.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={!allFilled || loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Predict Condition"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Result */}
      <div className="flex flex-col gap-4 lg:col-span-2">
        {!result && !error && (
          <Card className="flex flex-1 flex-col items-center justify-center border-dashed py-12">
            <Stethoscope className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Submit patient data to see results
            </p>
          </Card>
        )}

        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex items-start gap-3 pt-6">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  Prediction Error
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <>
            <Card
              className={
                isHighRisk
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-accent/30 bg-accent/5"
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  {isHighRisk ? (
                    <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">
                        {result.prediction}
                      </p>
                      <Badge variant={isHighRisk ? "destructive" : "secondary"}>
                        {isHighRisk ? "Alert" : "Normal"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {isHighRisk
                        ? "Patient shows elevated risk indicators. Further clinical evaluation recommended."
                        : "Patient vitals are within normal parameters. Continue routine monitoring."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Risk Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tabular-nums text-foreground">
                    {result.riskScore}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / 120 threshold
                  </span>
                </div>

                {/* Score bar */}
                <div className="mb-5 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all ${isHighRisk ? "bg-destructive" : "bg-accent"}`}
                    style={{
                      width: `${Math.min((result.riskScore / 200) * 100, 100)}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Glucose", value: result.inputs.glucose, weight: "40%" },
                    { label: "BMI", value: result.inputs.bmi, weight: "20%" },
                    { label: "Age", value: result.inputs.age, weight: "20%" },
                    { label: "BP", value: result.inputs.bp, weight: "20%" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg bg-secondary/60 px-3 py-2"
                    >
                      <p className="text-xs text-muted-foreground">
                        {item.label}{" "}
                        <span className="text-muted-foreground/60">
                          {"("}w: {item.weight}{")"}
                        </span>
                      </p>
                      <p className="text-sm font-semibold tabular-nums text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
