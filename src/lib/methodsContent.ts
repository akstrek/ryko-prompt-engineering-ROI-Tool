/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// src/lib/methodsContent.ts
// Fetches LLM-generated body text for Methods page cards 2 and 4.
// Falls back to hardcoded strings if API unavailable.

const FALLBACK_SCORING = `Gemini 2.0 Flash scores each response 0–100 across
4 dimensions. Upgrade path to Claude-as-judge documented in config/llm.py.`

const FALLBACK_LIMITATIONS = [
  "Gemini-as-judge circularity — the scoring model may favor its own output patterns.",
  "Prompt selection bias — results depend on the quality of the prompt pairs tested.",
  "No human validation baseline — scores are not cross-referenced against human raters."
]

export async function getScoringApproach(apiUrl: string): Promise<string> {
  try {
    const res = await fetch(`${apiUrl}/methods/scoring`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    if (!res.ok) throw new Error("API unavailable")
    const data = await res.json()
    return data.content as string
  } catch {
    return FALLBACK_SCORING
  }
}

export async function getKnownLimitations(apiUrl: string): Promise<string[]> {
  try {
    const res = await fetch(`${apiUrl}/methods/limitations`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    if (!res.ok) throw new Error("API unavailable")
    const data = await res.json()
    return data.items as string[]
  } catch {
    return FALLBACK_LIMITATIONS
  }
}
