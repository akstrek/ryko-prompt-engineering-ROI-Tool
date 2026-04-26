/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CardBase, HeaderStrip } from '../components/layout/CardBase';
import { VerticalPageName } from '../components/layout/VerticalPageName';
import { ExpandableViz } from '../components/layout/ExpandableViz';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { loadComparisonResult } from '../lib/loadCsv';
import { ComparisonResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

export default function QualityPage() {
  const [data, setData] = useState<ComparisonResult | null>(null);
  const [dimension, setDimension] = useState('Accuracy');

  useEffect(() => {
    loadComparisonResult().then(setData);
  }, []);

  if (!data) return null;

  const dimensions = ['Accuracy', 'Completeness', 'Clarity', 'Format Compliance'];
  const getDimValue = (dim: string, set: 'a' | 'b') => {
    const idx = dimensions.indexOf(dim);
    const score = set === 'a' ? data.scores_a?.[idx] : data.scores_b?.[idx];
    return typeof score === 'number' && !isNaN(score) ? score : 0;
  };

  const currentA = getDimValue(dimension, 'a');
  const currentB = getDimValue(dimension, 'b');
  const delta = currentB - currentA;
  const isNaNProgress = isNaN(delta);
  const displayDelta = isNaNProgress ? '0' : (delta > 0 ? `+${delta}` : delta);

  const chartData = [
    { name: 'Baseline (A)', value: currentA, fill: '#000000' },
    { name: 'Refined (B)', value: currentB, fill: '#D8560E' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-screen pb-20">
      <VerticalPageName name="QUALITY" />
      
      <div className="flex-grow flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-4 pb-12">
        {/* Card 1: Dimension deep-dive */}
        <CardBase className="p-0 overflow-hidden min-h-[450px] lg:h-[500px] shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
          <HeaderStrip title="DIMENSION ANALYSIS" variant="poppy" />
          <div className="p-6 md:p-8 pt-10 md:pt-12 h-full flex flex-col">
            <div className="mb-6">
              <Select value={dimension} onValueChange={setDimension}>
                <SelectTrigger className="w-full bg-[#F5F5F5] dark:bg-black dark:text-white border-2 border-black dark:border-[#F5F5F5] rounded-none shadow-[2px_2px_0px_black] dark:shadow-[2px_2px_0px_#F5F5F5] font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F5] border-2 border-black rounded-none">
                  {dimensions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-grow dark:text-white">
               <ExpandableViz title="DimensionDeepDive" className="w-full h-full">
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart 
                      data={chartData} 
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
                    >
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor', fontWeight: 700 }} width={80} />
                      <Bar dataKey="value" barSize={32}>
                         {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                         ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </ExpandableViz>
            </div>

            <div className="flex items-center justify-between mt-4 p-4 border-2 border-black bg-white dark:bg-black dark:border-white shadow-[3px_3px_0px_black] dark:shadow-[3px_3px_0px_white]">
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest">DELTA</span>
                  <span className="text-xl md:text-2xl font-black dark:text-white">{displayDelta} pts</span>
               </div>
               <div className={cn(
                 "px-3 py-1.5 border-2 border-black dark:border-white font-black text-[10px] md:text-xs uppercase",
                 delta >= 0 ? "bg-magenta text-black" : "bg-[#F5F5F5] text-black"
               )}>
                 {delta >= 0 ? 'IMPROVEMENT' : 'DEGRADATION'}
               </div>
            </div>
          </div>
        </CardBase>

        <div className="flex flex-col gap-6 md:gap-8">
          {/* Card 2: Best Responses */}
          <CardBase className="p-0 overflow-hidden shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
            <div className="border-b-2 border-black dark:border-white">
              <div className="bg-poppy px-4 py-1.5 text-[10px] font-black uppercase text-black inline-block border-r-2 border-black dark:border-white">
                BEST RESPONSE
              </div>
              <div className="p-4 font-mono text-[11px] md:text-[12px] italic text-black/80 dark:text-white/80 line-clamp-3">
                {data.response_b}
              </div>
            </div>
            <div>
               <div className="bg-[#F5F5F5] px-4 py-1.5 text-[10px] font-black uppercase text-black inline-block border-r-2 border-black dark:border-white border-t-2 dark:bg-[#1A1A1A]">
                BASELINE RESPONSE
              </div>
              <div className="p-4 font-mono text-[11px] md:text-[12px] text-black/60 dark:text-white/60 line-clamp-3">
                {data.response_a}
              </div>
            </div>
          </CardBase>

          {/* Card 3: ROI Formula */}
          <CardBase variant="dark" className="p-6 md:p-8 flex flex-col justify-center shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
            <HeaderStrip title="ROI CALCULATION" variant="poppy" />
            <div className="font-mono text-[14px] md:text-[16px] mb-6 text-center text-white">
              ROI = <span className="text-poppy">quality_delta</span> / (<span className="text-magenta">cost_delta</span> + 0.0001)
            </div>
            <div className="space-y-3 font-mono text-[10px] md:text-xs opacity-80 border-t border-white/20 pt-6">
               <div className="flex justify-between text-white">
                  <span>QUALITY Δ:</span>
                  <span className="text-poppy">{data.quality_delta}</span>
               </div>
               <div className="flex justify-between text-white">
                  <span>COST Δ:</span>
                  <span className="text-magenta">${data.cost_delta.toFixed(6)}</span>
               </div>
               <div className="flex justify-between border-t border-white/20 pt-2 font-bold text-sm text-white">
                  <span>FINAL ROI:</span>
                  <span className="text-[#FF69B4]">{data.roi_score}</span>
               </div>
            </div>
          </CardBase>
        </div>
      </div>
    </div>
  );
}
