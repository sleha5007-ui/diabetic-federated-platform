import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { glucose, bmi, age, bp } = body

    if (
      glucose == null ||
      bmi == null ||
      age == null ||
      bp == null
    ) {
      return NextResponse.json(
        { error: "All fields (glucose, bmi, age, bp) are required." },
        { status: 400 },
      )
    }

    const g = Number(glucose)
    const b = Number(bmi)
    const a = Number(age)
    const p = Number(bp)

    if ([g, b, a, p].some((v) => isNaN(v) || v < 0)) {
      return NextResponse.json(
        { error: "All values must be valid non-negative numbers." },
        { status: 400 },
      )
    }

    // Logistic-like risk calculation
    const riskScore = g * 0.4 + b * 0.2 + a * 0.2 + p * 0.2

    const prediction =
      riskScore > 120 ? "High Risk of Diabetes" : "Low Risk"

    return NextResponse.json({
      prediction,
      riskScore: Math.round(riskScore * 100) / 100,
      inputs: { glucose: g, bmi: b, age: a, bp: p },
    })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    )
  }
}
