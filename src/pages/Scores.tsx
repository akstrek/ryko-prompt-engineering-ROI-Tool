/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CardBase, HeaderStrip } from '../components/layout/CardBase';
import { VerticalPageName } from '../components/layout/VerticalPageName';
import { ExpandableViz } from '../components/layout/ExpandableViz';
import { loadComparisonResult } from '../lib/loadCsv';
import { ComparisonResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ScoresPage() {
  const [data, setData] = useState<ComparisonResult | null>(null);

  useEffect(() => {
    loadComparisonResult().then(setData);
  }, []);

  if (!data) return null;

  const chartData = [
    { name: 'Accuracy', A: data.scores_a?.[0] ?? 0, B: data.scores_b?.[0] ?? 0 },
    { name: 'Completeness', A: data.scores_a?.[1] ?? 0, B: data.scores_b?.[1] ?? 0 },
    { name: 'Clarity', A: data.scores_a?.[2] ?? 0, B: data.scores_b?.[2] ?? 0 },
    { name: 'Format', A: data.scores_a?.[3] ?? 0, B: data.scores_b?.[3] ?? 0 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-screen pb-20">
      <VerticalPageName name="SCORES" />
      
      <div className="flex-grow flex flex-col gap-6 md:gap-4 pb-12">
        {/* ROW 1: Charts and Metrics */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-4 lg:h-[380px]">
          <div className="lg:col-span-5 h-[300px] lg:h-full">
             <CardBase className="h-full p-0 overflow-hidden shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
                <HeaderStrip title="QUALITY DELTA" variant="poppy" />
                <ExpandableViz title="QualityDelta" className="p-4 md:p-8 pt-10 md:pt-12">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.08)" />
                        <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor' }} />
                        <YAxis axisLine={true} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor' }} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#F5F5F5', border: '3px solid black', borderRadius: 0, shadow: '4px 4px 0px black' }}
                          labelStyle={{ fontWeight: 900, marginBottom: 4, color: 'black' }}
                        />
                        <Bar dataKey="A" fill="currentColor" className="text-black dark:text-white" barSize={24} />
                        <Bar dataKey="B" fill="#D8560E" barSize={24} />
                      </BarChart>
                   </ResponsiveContainer>
                </ExpandableViz>
             </CardBase>
          </div>

          <div className="lg:col-span-7 h-auto lg:h-full">
            <CardBase className="h-full border-[3px] border-black p-6 md:p-8 grid grid-cols-2 gap-4 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
              <HeaderStrip title="METRIC SNAPSHOT" variant="white" />
              <MetricTile label="Overall A" value={data.quality_a} />
              <MetricTile label="Overall B" value={data.quality_b} />
              <MetricTile label="Token Δ" value={data.token_delta > 0 ? `+${data.token_delta}` : data.token_delta} />
              <MetricTile label="Cost Δ" value={`$${data.cost_delta.toFixed(4)}`} />
            </CardBase>
          </div>
        </div>

        {/* ROW 2: Responses */}
        <div className="w-full h-auto lg:h-full">
          <CardBase className="h-full p-0 flex flex-col md:flex-row overflow-hidden border-black shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
            <div className="flex-1 p-6 relative flex flex-col min-h-[200px] border-b-[3px] md:border-b-0 md:border-r-[3px] border-black">
               <HeaderStrip title="RESPONSE A" variant="black" className="left-0" />
               <div className="mt-8 overflow-y-auto no-scrollbar font-mono text-[11px] md:text-[12px] leading-relaxed dark:text-white">
                  {data.response_a}
               </div>
            </div>
            
            <div className="flex-1 p-6 bg-[#BAFCA2] relative flex flex-col min-h-[200px] text-[#000000]">
               <HeaderStrip title="RESPONSE B" variant="resp-b" className="left-0" />
               <div className="mt-8 overflow-y-auto no-scrollbar font-mono text-[11px] md:text-[12px] leading-relaxed">
                  {data.response_b}
               </div>
            </div>
          </CardBase>
        </div>
      </div>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string | number }) {
  const displayValue = typeof value === 'number' && isNaN(value) ? '--' : value;
  return (
    <div className="bg-[#F5F5F5] border-2 border-black flex flex-col items-center justify-center p-4">
      <span className="text-[32px] font-black leading-none mb-2 select-none">{displayValue}</span>
      <span className="text-[11px] font-bold uppercase tracking-widest text-black/60">{label}</span>
    </div>
  );
}
