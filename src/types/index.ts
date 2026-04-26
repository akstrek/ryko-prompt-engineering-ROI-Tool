/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScoringDimensions {
  accuracy: number;
  completeness: number;
  clarity: number;
  format_compliance: number;
}

export interface ComparisonResult {
  prompt_a: string;
  prompt_b: string;
  response_a: string;
  response_b: string;
  quality_a: number;
  quality_b: number;
  quality_delta: number;
  tokens_a: number;
  tokens_b: number;
  token_delta: number;
  cost_a: number;
  cost_b: number;
  cost_delta: number;
  roi_score: number;
  scores_a: number[]; // [accuracy, completeness, clarity, format_compliance]
  scores_b: number[];
  interpretation: string;
}

export interface BatchItem {
  id: string;
  roi_score: number;
  quality_delta: number;
  token_delta: number;
  grade: 'high' | 'medium' | 'low';
}

export type TaskType = 'Factual' | 'Creative' | 'Analytical' | 'Instructional';
