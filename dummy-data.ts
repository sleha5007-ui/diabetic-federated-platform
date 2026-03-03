export const dashboardStats = {
  totalPatients: 1245,
  newPatientsThisMonth: 87,
  localModelAccuracy: 87,
  globalModelAccuracy: 91,
  differentialPrivacy: true,
  privacyBudget: 1.2,
  participatingHospitals: 12,
  trainingRounds: 45,
}

export const recentPatients = [
  {
    id: "P-1001",
    name: "John A.",
    age: 58,
    type: "Type 2",
    hba1c: 7.2,
    lastVisit: "2026-02-28",
    risk: "Moderate",
  },
  {
    id: "P-1002",
    name: "Maria L.",
    age: 45,
    type: "Type 1",
    hba1c: 6.8,
    lastVisit: "2026-03-01",
    risk: "Low",
  },
  {
    id: "P-1003",
    name: "Robert K.",
    age: 67,
    type: "Type 2",
    hba1c: 9.1,
    lastVisit: "2026-02-25",
    risk: "High",
  },
  {
    id: "P-1004",
    name: "Susan P.",
    age: 52,
    type: "Type 2",
    hba1c: 7.8,
    lastVisit: "2026-03-02",
    risk: "Moderate",
  },
  {
    id: "P-1005",
    name: "David W.",
    age: 39,
    type: "Type 1",
    hba1c: 6.5,
    lastVisit: "2026-03-03",
    risk: "Low",
  },
]

export const accuracyHistory = [
  { round: "R1", local: 62, global: 65 },
  { round: "R5", local: 68, global: 72 },
  { round: "R10", local: 73, global: 78 },
  { round: "R15", local: 76, global: 82 },
  { round: "R20", local: 79, global: 84 },
  { round: "R25", local: 81, global: 86 },
  { round: "R30", local: 83, global: 88 },
  { round: "R35", local: 85, global: 89 },
  { round: "R40", local: 86, global: 90 },
  { round: "R45", local: 87, global: 91 },
]

export const trainingConfig = {
  epochs: 10,
  batchSize: 32,
  learningRate: 0.001,
  privacyEpsilon: 1.2,
  clippingNorm: 1.0,
  noiseMultiplier: 0.8,
}
