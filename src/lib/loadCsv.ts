/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Papa from 'papaparse';
import { BatchItem, ComparisonResult } from '../types';

export async function loadBatchResults(): Promise<BatchItem[]> {
  try {
    const response = await fetch('/data/batch_results.csv');
    if (!response.ok) throw new Error('CSV not found');
    const csvData = await response.text();
    const parsed = Papa.parse(csvData, { header: true, dynamicTyping: true });
    return (parsed.data as any[])
      .filter(item => item && item.id)
      .map(item => ({
        id: String(item.id),
        roi_score: isNaN(Number(item.roi_score)) ? 0 : Number(item.roi_score),
        quality_delta: isNaN(Number(item.quality_delta)) ? 0 : Number(item.quality_delta),
        token_delta: isNaN(Number(item.token_delta)) ? 0 : Number(item.token_delta),
        grade: (item.grade as any) || 'low'
      }));
  } catch (error) {
    console.warn('Using fallback batch results');
    return [
      { id: 'RUN_001', roi_score: 42.5, quality_delta: 15, token_delta: 200, grade: 'high' },
      { id: 'RUN_002', roi_score: 28.1, quality_delta: 10, token_delta: 150, grade: 'medium' },
      { id: 'RUN_003', roi_score: 12.4, quality_delta: -5, token_delta: 300, grade: 'low' },
      { id: 'RUN_004', roi_score: 55.2, quality_delta: 30, token_delta: 100, grade: 'high' },
      { id: 'RUN_005', roi_score: 31.8, quality_delta: 12, token_delta: 400, grade: 'medium' },
    ];
  }
}

export async function loadComparisonResult(): Promise<ComparisonResult | null> {
  try {
    const response = await fetch('/data/comparison_result.csv');
    if (!response.ok) return null;
    const csvData = await response.text();
    const parsed = Papa.parse(csvData, { header: true, dynamicTyping: true });
    // Assuming the CSV has one row of the comparison result structure
    const data = parsed.data[0] as any;
    if (!data) return null;
    // Safely parse scores
    const parseScores = (val: any, fallback: number[]) => {
      let arr: any[] = [];
      if (Array.isArray(val)) arr = val;
      else if (typeof val === 'string') {
        try {
          arr = JSON.parse(val);
        } catch {
          return fallback;
        }
      } else {
        return fallback;
      }
      
      if (!Array.isArray(arr)) return fallback;
      return arr.map(v => isNaN(Number(v)) ? 0 : Number(v));
    };

    return {
      ...data,
      quality_a: isNaN(Number(data.quality_a)) ? 0 : Number(data.quality_a),
      quality_b: isNaN(Number(data.quality_b)) ? 0 : Number(data.quality_b),
      quality_delta: isNaN(Number(data.quality_delta)) ? 0 : Number(data.quality_delta),
      tokens_a: isNaN(Number(data.tokens_a)) ? 0 : Number(data.tokens_a),
      tokens_b: isNaN(Number(data.tokens_b)) ? 0 : Number(data.tokens_b),
      token_delta: isNaN(Number(data.token_delta)) ? 0 : Number(data.token_delta),
      cost_a: isNaN(Number(data.cost_a)) ? 0 : Number(data.cost_a),
      cost_b: isNaN(Number(data.cost_b)) ? 0 : Number(data.cost_b),
      cost_delta: isNaN(Number(data.cost_delta)) ? 0 : Number(data.cost_delta),
      roi_score: isNaN(Number(data.roi_score)) ? 0 : Number(data.roi_score),
      scores_a: parseScores(data.scores_a, [58, 65, 70, 55]),
      scores_b: parseScores(data.scores_b, [88, 92, 85, 91]),
    };
  } catch (error) {
    return null;
  }
}
