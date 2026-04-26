/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CardBase, HeaderStrip } from '../components/layout/CardBase';
import { VerticalPageName } from '../components/layout/VerticalPageName';
import { ExpandableViz } from '../components/layout/ExpandableViz';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { loadBatchResults } from '../lib/loadCsv';
import { BatchItem } from '../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { cn } from '@/lib/utils';

export default function BatchPage() {
  const [items, setItems] = useState<BatchItem[]>([]);

  useEffect(() => {
    loadBatchResults().then(setItems);
  }, []);

  const scatterData = items.map(item => ({
    x: item.token_delta,
    y: item.quality_delta,
    roi: item.roi_score,
    id: item.id
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-screen pb-20">
      <VerticalPageName name="BATCH" />
      
      <div className="flex-grow flex flex-col gap-6 md:gap-4 pb-12">
        {/* Card 1: Upload */}
        <CardBase className="p-0 overflow-hidden shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
          <HeaderStrip title="BATCH ANALYSIS" variant="poppy" />
          <div className="p-6 md:p-8 pt-10 md:pt-12 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-full md:flex-grow border-2 border-dashed border-black dark:border-white bg-[#F5F5F5] dark:bg-black h-24 md:h-32 flex flex-col items-center justify-center group cursor-pointer hover:bg-black/5 transition-colors">
               <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest mb-1 md:mb-2 group-hover:scale-110 transition-transform dark:text-white">DROP CSV FILE HERE</span>
               <span className="text-[8px] md:text-[10px] font-mono text-black/50 dark:text-white/50 italic">Required: prompt_a, prompt_b, task_type</span>
            </div>
            <button className="w-full md:w-auto h-24 md:h-32 px-8 md:px-12 bg-poppy text-black border-[3px] border-black dark:border-white shadow-[4px_4px_0px_black] dark:shadow-[4px_4px_0px_white] font-black uppercase tracking-widest active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
              RUN BATCH →
            </button>
          </div>
        </CardBase>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-4 lg:h-[450px]">
          {/* Card 2: Scatter Plot */}
          <div className="lg:col-span-5 h-[300px] lg:h-full">
            <CardBase className="h-full p-0 overflow-hidden shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
              <HeaderStrip title="COST-QUALITY FRONTIER" variant="black" />
              <ExpandableViz title="CostQualityScatter" className="p-6 md:p-8 pt-10 md:pt-12">
                 <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" vertical={false} />
                      <XAxis type="number" dataKey="x" name="token delta" axisLine={true} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: 'currentColor' }} label={{ value: 'TOKEN Δ', position: 'bottom', fontSize: 9, offset: 0, fontWeight: 900, fill: 'currentColor' }} />
                      <YAxis type="number" dataKey="y" name="quality delta" axisLine={true} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: 'currentColor' }} label={{ value: 'QUALITY Δ', angle: -90, position: 'insideLeft', fontSize: 9, fontWeight: 900, fill: 'currentColor' }} />
                      <ZAxis type="number" range={[100, 100]} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: '#F5F5F5', border: '3px solid black', borderRadius: 0, boxShadow: '4px 4px 0px black' }}
                      />
                      <Scatter name="Runs" data={scatterData} fill="#D8560E" stroke="currentColor" strokeWidth={2} />
                    </ScatterChart>
                 </ResponsiveContainer>
              </ExpandableViz>
            </CardBase>
          </div>

          {/* Card 3: Table */}
          <div className="lg:col-span-7 h-auto min-h-[400px] lg:h-full">
            <CardBase className="h-full p-0 overflow-hidden flex flex-col shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
              <HeaderStrip title="RESULTS" variant="poppy" />
              <div className="mt-10 overflow-x-auto flex-grow h-full no-scrollbar">
                <Table className="min-w-[500px]">
                  <TableHeader className="bg-[#F5F5F5] dark:bg-[#1A1A1A] sticky top-0 z-10">
                    <TableRow className="border-b-2 border-black dark:border-white hover:bg-transparent">
                      <TableHead className="text-[10px] md:text-[11px] font-black uppercase text-black dark:text-white">ID</TableHead>
                      <TableHead className="text-[10px] md:text-[11px] font-black uppercase text-black dark:text-white text-right">ROI SCORE</TableHead>
                      <TableHead className="text-[10px] md:text-[11px] font-black uppercase text-black dark:text-white text-right">QUALITY Δ</TableHead>
                      <TableHead className="text-[10px] md:text-[11px] font-black uppercase text-black dark:text-white text-right">TOKEN Δ</TableHead>
                      <TableHead className="text-[10px] md:text-[11px] font-black uppercase text-black dark:text-white text-center">GRADE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, i) => {
                      const displayROI = isNaN(item.roi_score) ? '--' : item.roi_score.toFixed(1);
                      const displayQualityDelta = isNaN(item.quality_delta) ? '0' : (item.quality_delta > 0 ? `+${item.quality_delta}` : item.quality_delta);
                      return (
                        <TableRow key={item.id} className={cn("border-b border-black/10 dark:border-white/10 transition-colors", i % 2 === 0 ? "bg-[#F5F5F5] dark:bg-[#0A0A0A]" : "bg-white dark:bg-[#111]")}>
                          <TableCell className="font-mono text-[10px] md:text-[11px] font-bold dark:text-white">{item.id}</TableCell>
                          <TableCell className="text-right font-black text-roi-pink">{displayROI}</TableCell>
                          <TableCell className="text-right font-bold dark:text-white">{displayQualityDelta}</TableCell>
                          <TableCell className="text-right font-mono text-[10px] md:text-[11px] dark:text-white/60">{isNaN(item.token_delta) ? '--' : item.token_delta}</TableCell>
                          <TableCell className="text-center">
                            <GradeBadge grade={item.grade} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardBase>
          </div>
        </div>
      </div>
    </div>
  );
}

function GradeBadge({ grade }: { grade: BatchItem['grade'] }) {
  const styles = {
    high: "bg-poppy text-black",
    medium: "bg-magenta text-black",
    low: "bg-[#F5F5F5] text-black border-black/20"
  };
  return (
    <Badge className={cn("rounded-none border-2 border-black font-black text-[9px] uppercase px-2", styles[grade])}>
      {grade}
    </Badge>
  );
}
