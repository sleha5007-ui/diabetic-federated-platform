"use client"

import { useState, useCallback } from "react"
import {
  Brain,
  Send,
  CheckCircle2,
  Clock,
  Loader2,
  ShieldCheck,
  Server,
  Zap,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { trainingConfig } from "@/lib/dummy-data"

type TrainingStep = "idle" | "training" | "trained" | "sending" | "sent" | "aggregating" | "complete"

interface LogEntry {
  message: string
  timestamp: string
  type: "info" | "success" | "warning"
}

export function TrainingSimulation() {
  const [step, setStep] = useState<TrainingStep>("idle")
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      {
        message,
        timestamp: new Date().toLocaleTimeString(),
        type,
      },
    ])
  }, [])

  const simulateProgress = useCallback(
    (duration: number): Promise<void> => {
      return new Promise((resolve) => {
        const interval = 50
        const steps = duration / interval
        let current = 0
        const timer = setInterval(() => {
          current++
          setProgress(Math.min((current / steps) * 100, 100))
          if (current >= steps) {
            clearInterval(timer)
            resolve()
          }
        }, interval)
      })
    },
    [],
  )

  const trainLocal = useCallback(async () => {
    setStep("training")
    setProgress(0)
    setLogs([])

    addLog("Initializing local model training...")
    addLog(`Configuration: ${trainingConfig.epochs} epochs, batch size ${trainingConfig.batchSize}`)
    await simulateProgress(1500)

    addLog("Loading local patient dataset (2,847 records)...")
    await simulateProgress(1000)

    addLog("Applying differential privacy noise (ε = 1.2)...")
    addLog(`Clipping norm: ${trainingConfig.clippingNorm}, Noise multiplier: ${trainingConfig.noiseMultiplier}`)
    await simulateProgress(1200)

    addLog("Training epoch 1/10... Loss: 0.4521")
    await simulateProgress(800)
    addLog("Training epoch 5/10... Loss: 0.2103")
    await simulateProgress(800)
    addLog("Training epoch 10/10... Loss: 0.0847")
    await simulateProgress(600)

    addLog("Local model training complete!", "success")
    addLog("Local accuracy: 87.3%", "success")
    setStep("trained")
    setProgress(100)
  }, [addLog, simulateProgress])

  const sendToServer = useCallback(async () => {
    setStep("sending")
    setProgress(0)

    addLog("Encrypting model gradients...")
    await simulateProgress(800)

    addLog("Applying secure aggregation protocol...")
    await simulateProgress(600)

    addLog("Sending encrypted model update to federation server...")
    await simulateProgress(1200)

    addLog("Model update sent successfully!", "success")
    setStep("sent")
    setProgress(100)

    // Auto-start aggregation
    await new Promise((r) => setTimeout(r, 500))
    setStep("aggregating")
    setProgress(0)

    addLog("Federation server: Received updates from 12/12 hospitals")
    await simulateProgress(800)

    addLog("Federation server: Running FedAvg aggregation...")
    await simulateProgress(1500)

    addLog("Federation server: Validating global model...")
    await simulateProgress(600)

    addLog("Global model updated! New accuracy: 92.1%", "success")
    addLog("Aggregation round 46 complete", "success")
    setStep("complete")
    setProgress(100)
  }, [addLog, simulateProgress])

  const resetSimulation = useCallback(() => {
    setStep("idle")
    setProgress(0)
    setLogs([])
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground text-balance">
          Federated Training Simulation
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Simulate the federated learning workflow: train locally, share
          securely, and aggregate globally
        </p>
      </div>

      {/* Pipeline Status */}
      <Card>
        <CardHeader>
          <CardTitle>Training Pipeline</CardTitle>
          <CardDescription>
            Current status of the federated learning round
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Status Steps */}
            <div className="grid gap-4 sm:grid-cols-3">
              <PipelineStep
                icon={Brain}
                title="Local Training"
                description="Train on hospital data"
                status={
                  step === "training"
                    ? "active"
                    : step === "idle"
                      ? "pending"
                      : "done"
                }
              />
              <PipelineStep
                icon={Send}
                title="Model Upload"
                description="Send encrypted gradients"
                status={
                  step === "sending"
                    ? "active"
                    : ["idle", "training", "trained"].includes(step)
                      ? "pending"
                      : "done"
                }
              />
              <PipelineStep
                icon={Server}
                title="Global Aggregation"
                description="FedAvg on server"
                status={
                  step === "aggregating"
                    ? "active"
                    : step === "complete"
                      ? "done"
                      : "pending"
                }
              />
            </div>

            {/* Progress Bar */}
            {step !== "idle" && step !== "complete" && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {step === "training" && "Training local model..."}
                    {step === "trained" && "Training complete"}
                    {step === "sending" && "Sending to server..."}
                    {step === "sent" && "Upload complete"}
                    {step === "aggregating" && "Aggregating models..."}
                  </span>
                  <span className="text-sm font-mono text-muted-foreground tabular-nums">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={trainLocal}
                disabled={step === "training" || step === "sending" || step === "aggregating"}
                className="gap-2"
              >
                {step === "training" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                Train Local Model
              </Button>

              <Button
                onClick={sendToServer}
                disabled={step !== "trained"}
                variant={step === "trained" ? "default" : "secondary"}
                className="gap-2"
              >
                {step === "sending" || step === "aggregating" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send Model to Server
              </Button>

              {step === "complete" && (
                <Button onClick={resetSimulation} variant="outline" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Run New Round
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Training Log */}
        <Card>
          <CardHeader>
            <CardTitle>Training Log</CardTitle>
            <CardDescription>
              Real-time output from the training pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-y-auto rounded-lg bg-secondary/40 p-4 font-mono text-xs">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">
                  Click &quot;Train Local Model&quot; to start the simulation...
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="shrink-0 text-muted-foreground">
                        [{log.timestamp}]
                      </span>
                      <span
                        className={
                          log.type === "success"
                            ? "text-accent"
                            : log.type === "warning"
                              ? "text-destructive"
                              : "text-foreground"
                        }
                      >
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Training Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Training Configuration</CardTitle>
            <CardDescription>
              Current hyperparameters and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <ConfigItem label="Epochs" value={String(trainingConfig.epochs)} />
              <ConfigItem
                label="Batch Size"
                value={String(trainingConfig.batchSize)}
              />
              <ConfigItem
                label="Learning Rate"
                value={String(trainingConfig.learningRate)}
              />
              <div className="h-px bg-border" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  Differential Privacy Settings
                </span>
                <Badge variant="default" className="ml-auto">
                  Enabled
                </Badge>
              </div>
              <ConfigItem
                label="Privacy Budget (ε)"
                value={String(trainingConfig.privacyEpsilon)}
              />
              <ConfigItem
                label="Clipping Norm"
                value={String(trainingConfig.clippingNorm)}
              />
              <ConfigItem
                label="Noise Multiplier"
                value={String(trainingConfig.noiseMultiplier)}
              />

              {/* Aggregation Status */}
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Aggregation Status
                </span>
                <Badge
                  variant={step === "complete" ? "default" : "secondary"}
                >
                  {step === "idle" && "Waiting"}
                  {step === "training" && "Local Training"}
                  {step === "trained" && "Ready to Send"}
                  {step === "sending" && "Uploading"}
                  {step === "sent" && "Uploaded"}
                  {step === "aggregating" && "Aggregating"}
                  {step === "complete" && "Complete"}
                </Badge>
              </div>
              <div className="rounded-lg bg-secondary/40 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Hospitals Reported
                  </span>
                  <span className="font-mono font-medium text-foreground tabular-nums">
                    {step === "complete" ? "12/12" : step === "sent" || step === "aggregating" ? "11/12" : "0/12"}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Round</span>
                  <span className="font-mono font-medium text-foreground tabular-nums">
                    {step === "complete" ? "46" : "45"}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Algorithm</span>
                  <span className="font-medium text-foreground">
                    FedAvg
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PipelineStep({
  icon: Icon,
  title,
  description,
  status,
}: {
  icon: React.ElementType
  title: string
  description: string
  status: "pending" | "active" | "done"
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${
        status === "active"
          ? "border-primary bg-primary/5"
          : status === "done"
            ? "border-accent/30 bg-accent/5"
            : "border-border bg-card"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          status === "active"
            ? "bg-primary text-primary-foreground"
            : status === "done"
              ? "bg-accent text-accent-foreground"
              : "bg-secondary text-muted-foreground"
        }`}
      >
        {status === "active" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : status === "done" ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ConfigItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-mono font-medium text-foreground tabular-nums">
        {value}
      </span>
    </div>
  )
}
