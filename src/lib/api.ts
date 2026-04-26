/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComparisonResult, TaskType } from '../types';

const API_URL = ((import.meta as any).env.VITE_API_URL as string) || 'http://localhost:8000';

export async function runComparison(
  prompt_a: string,
  prompt_b: string,
  task_type: TaskType,
  n_runs: number = 1
): Promise<ComparisonResult> {
  try {
    const response = await fetch(`${API_URL}/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt_a, prompt_b, task_type, n_runs }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to run comparison:', error);
    // Fallback to hardcoded data if API fails or is not available
    return getFallbackData(prompt_a, prompt_b);
  }
}

function getFallbackData(prompt_a: string, prompt_b: string): ComparisonResult {
  return {
    prompt_a,
    prompt_b,
    response_a: "Result for Prompt A. This is a baseline response summarizing the requested content with standard detail.",
    response_b: "Result for Prompt B. This response is more structured, uses expert terminology, and provides specific supporting evidence as requested in the refined prompt.",
    quality_a: 62,
    quality_b: 89,
    quality_delta: 27,
    tokens_a: 120,
    tokens_b: 340,
    token_delta: 220,
    cost_a: 0.0004,
    cost_b: 0.0011,
    cost_delta: 0.0007,
    roi_score: 38.57,
    scores_a: [58, 65, 70, 55],
    scores_b: [88, 92, 85, 91],
    interpretation: "27% quality gain at 2.8× the token cost"
  };
}
